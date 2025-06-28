import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOrCreateContact } from "@/Utils/util";
import { Contact } from "@/app/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phoneNumber } = body;

    // Validate input
    if (!email && !phoneNumber) {
      return NextResponse.json(
        { error: "Email or phoneNumber is required." }, 
        { status: 400 }
      );
    }

    // Find or create contact with proper linking
    const { primary, allContacts } = await findOrCreateContact(
      prisma, 
      email, 
      phoneNumber
    );

    // Collect all unique emails and phone numbers
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];

    // Add primary contact data first
    if (primary.email) emails.add(primary.email);
    if (primary.phoneNumber) phoneNumbers.add(primary.phoneNumber);

    // Process all contacts
    allContacts.forEach((contact: Contact) => {
      if (contact.linkPrecedence === "secondary") {
        secondaryContactIds.push(contact.id);
      }
      if (contact.email && contact.id !== primary.id) emails.add(contact.email);
      if (contact.phoneNumber && contact.id !== primary.id) phoneNumbers.add(contact.phoneNumber);
    });

    // Ensure primary contact's data appears first in arrays
    const emailsArray = [
      ...(primary.email ? [primary.email] : []),
      ...Array.from(emails).filter(e => e !== primary.email)
    ];
    
    const phoneNumbersArray = [
      ...(primary.phoneNumber ? [primary.phoneNumber] : []),
      ...Array.from(phoneNumbers).filter(p => p !== primary.phoneNumber)
    ];

    return NextResponse.json({
      contact: {
        primaryContatctId: primary.id, // Note: keeping the typo as per requirements
        emails: emailsArray,
        phoneNumbers: phoneNumbersArray,
        secondaryContactIds: secondaryContactIds.sort((a, b) => a - b), // Sort for consistency
      },
    });

  } catch (error) {
    console.error("Error in /identify endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
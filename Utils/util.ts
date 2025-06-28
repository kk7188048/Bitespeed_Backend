import { PrismaClient } from "@prisma/client";
import { Contact } from "@/app/generated/prisma";

export async function findOrCreateContact(
  prisma: PrismaClient,
  email?: string,
  phoneNumber?: string
) {
  // Find all contacts that match either email or phone
  const matchingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : []),
      ],
    },
    orderBy: { createdAt: 'asc' }
  });

  // If no matches, create new primary contact
  if (!matchingContacts.length) {
    const newContact = await prisma.contact.create({
      data: { 
        email, 
        phoneNumber,
        linkPrecedence: "primary"
      },
    });
    return {
      primary: newContact,
      allContacts: [newContact],
      newlyCreated: true,
    };
  }

  // Get all linked contact IDs (including the matches themselves)
  const linkedIds = new Set<number>();
  for (const contact of matchingContacts) {
    if (contact.linkedId) {
      linkedIds.add(contact.linkedId);
    } else {
      linkedIds.add(contact.id); // This is a primary contact
    }
  }

  // Fetch all contacts in the linked groups
  const allLinkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: Array.from(linkedIds) } },
        { linkedId: { in: Array.from(linkedIds) } },
      ],
    },
    orderBy: { createdAt: 'asc' }
  });

  // Find the oldest primary contact (this will be THE primary)
  const primaryContacts = allLinkedContacts.filter((c: Contact) => c.linkPrecedence === "primary");
  const oldestPrimary = primaryContacts.sort((a: Contact, b: Contact) => 
    a.createdAt.getTime() - b.createdAt.getTime()
  )[0];

  // If we have multiple primary contacts, we need to merge them
  if (primaryContacts.length > 1) {
    // Convert all other primaries to secondary
    const otherPrimaries = primaryContacts.filter((c: Contact)=> c.id !== oldestPrimary.id);
    
    await Promise.all(
      otherPrimaries.map((contact: Contact) =>
        prisma.contact.update({
          where: { id: contact.id },
          data: {
            linkedId: oldestPrimary.id,
            linkPrecedence: "secondary",
          },
        })
      )
    );

    // Update any contacts that were linked to other primaries
    await Promise.all(
      otherPrimaries.map((contact: Contact) =>
        prisma.contact.updateMany({
          where: { linkedId: contact.id },
          data: { linkedId: oldestPrimary.id },
        })
      )
    );
  }

  // Re-fetch all contacts after potential updates
  const finalLinkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: oldestPrimary.id },
        { linkedId: oldestPrimary.id },
      ],
    },
    orderBy: { createdAt: 'asc' }
  });

  // Check if we need to create a new secondary contact
  const exactMatch = finalLinkedContacts.find((c: Contact)=> 
    c.email === email && c.phoneNumber === phoneNumber
  );

  let shouldCreateNew = false;
  
  // Create new secondary if:
  // 1. No exact match exists AND
  // 2. We have new information (email or phone not in existing contacts)
  if (!exactMatch) {
    const hasNewEmail = email && !finalLinkedContacts.some((c: Contact) => c.email === email);
    const hasNewPhone = phoneNumber && !finalLinkedContacts.some((c: Contact)=> c.phoneNumber === phoneNumber);
    
    if (hasNewEmail || hasNewPhone) {
      shouldCreateNew = true;
    }
  }

  let newContact = null;
  if (shouldCreateNew) {
    newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: oldestPrimary.id,
        linkPrecedence: "secondary",
      },
    });
    finalLinkedContacts.push(newContact);
  }

  return {
    primary: oldestPrimary,
    allContacts: finalLinkedContacts,
    newlyCreated: false,
  };
}
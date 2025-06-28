# 🧠 Bitespeed Backend Task: Identity Reconciliation

This project implements a backend API to reconcile identities across multiple customer purchases based on phone numbers and emails. The goal is to track all contacts that belong to the same person even if different combinations of phone/email are used.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (or PostgreSQL)
- **ORM:** Prisma
- **API Format:** RESTful JSON

---

## 📂 Folder Structure

```
.
├── app/api/identify/route.ts       # Main API endpoint
├── prisma/schema.prisma            # Contact model definition
├── utils/contactUtils.ts           # Linked contact resolver
├── lib/prisma.ts                   # Prisma client config
├── .env                            # Environment variables
├── tsconfig.json / package.json    # Config and dependencies
```

---

## 🧪 API Usage

### Endpoint
```
POST /api/identify
```

### Request Body

```json
{
  "email": "example@domain.com",   
  "phoneNumber": "1234567890"      
}
```

### Response Body

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["a@b.com", "x@y.com"],
    "phoneNumbers": ["1234567890", "9999999999"],
    "secondaryContactIds": [2, 3]
  }
}
```

> ❗ You must send at least one of `email` or `phoneNumber`.

---

## 🧪 Test Scenarios

| Test Case | Description |
|-----------|-------------|
| New email+phone | Creates new primary |
| Match by phone, new email | Adds as secondary |
| Match by email, new phone | Adds as secondary |
| Exact match | Returns existing group |
| Match only phone/email | Returns resolved group |
| Merging two primaries | Older one becomes primary |
| No match | New primary created |
| Empty body | Returns 400 error |

---

## 🛠 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/bitespeed-identity.git
cd bitespeed-identity
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

```bash
# .env
DATABASE_URL="file:./dev.db"
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the dev server

```bash
npm run dev
```

---

## 🌐 Deployment

You can deploy this app using:
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)
- [Railway](https://railway.app/)

Make sure to set the correct `DATABASE_URL` in your deployed environment.

---

## 📮 Submission Checklist

- [x] `/api/identify` endpoint is exposed
- [x] Hosted publicly via Vercel/Render
- [x] Code is on GitHub with commits and documentation
- [x] JSON body support for all requests
- [x] Postman tested for all edge cases

---

## 📎 Hosted API URL

> 🔗 `https://your-hosted-url.com/api/identify`

---

## 🧑‍💻 Author

**Krishna Kumar**  
[LinkedIn](https://www.linkedin.com/in/your-profile)  
[GitHub](https://github.com/your-username)

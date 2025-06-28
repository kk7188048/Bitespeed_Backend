# 🧠 Bitespeed Backend Task: Identity Reconciliation

This project is a backend API built using **Next.js App Router**, **Prisma**, and **PostgreSQL** to reconcile customer identities based on shared email and phone number.

---

## 🌐 Hosted API

> ✅ **Production API Endpoint:**  
> [`POST https://bitespeed-backend-olive.vercel.app/api/identify`](https://bitespeed-backend-olive.vercel.app/api/identify)

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma
- **Deployment:** Vercel

---

## 📁 Project Structure

```
.
├── app/api/identify/route.ts       # Main API logic
├── prisma/schema.prisma            # DB model
├── utils/contactUtils.ts           # Utility to fetch linked contacts
├── lib/prisma.ts                   # Prisma client setup
├── .env                            # Database config
├── next.config.ts                  # Next.js config (lint skipping for build)
├── package.json / tsconfig.json    # Project setup
```

---

## 📮 API Usage

### Endpoint
```
POST /api/identify
```

### Request Body
```json
{
  "email": "example@domain.com",       // optional
  "phoneNumber": "1234567890"          // optional
}
```

> ⚠️ At least one of `email` or `phoneNumber` is required.

---

### Response Format

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["example@domain.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}
```

---

## 🧪 Test Scenarios

| Test Case | Description |
|-----------|-------------|
| New email + phone | Creates new primary |
| Match by phone, new email | Adds as secondary |
| Match by email, new phone | Adds as secondary |
| Exact match | Returns existing group |
| Only phone/email match | Returns linked group |
| Merge 2 primaries | Oldest becomes primary |
| Invalid request | Returns 400 error |

---

## 🛠 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/kk7188048/Bitespeed_Backend.git
cd Bitespeed_Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
DATABASE_URL="postgresql://<user>:<pass>@<host>:<port>/<db>?sslmode=require"
```

### 4. Push schema and generate client

```bash
npx prisma db push
npx prisma generate
```

### 5. Run locally

```bash
npm run dev
```

---

## 🚀 Deployment on Vercel

This app is auto-deployed using Vercel.

### Production URL:
> [`https://bitespeed-backend-olive.vercel.app`](https://bitespeed-backend-olive.vercel.app)

---

## 📎 GitHub Repository

> [`https://github.com/kk7188048/Bitespeed_Backend`](https://github.com/kk7188048/Bitespeed_Backend)

---

## ✅ Checklist

- [x] `/api/identify` API implemented
- [x] Publicly hosted on Vercel
- [x] PostgreSQL via Neon
- [x] Prisma ORM integrated
- [x] Fully documented and tested via Postman
- [x] Ready for production

---

## 👨‍💻 Author

**Krishna Kumar**  
[GitHub](https://github.com/kk7188048)  

---

## 📝 License

This project is provided for Bitespeed technical assessment. You may reuse the code for educational or internal evaluation purposes.


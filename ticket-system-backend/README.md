# TickeZ Backend

This repository contains the **backend service** for the TickeZ system.  

It is built with **NestJS**, uses **MongoDB** as the database, and **Prisma** as the ORM to simplify database access and schema management.

The backend provides APIs for authentication, events, tickets, transactions, vouchers, payments (Stripe), file uploads (Cloudinary), and email services.

---

## Tech Stack

- NestJS (Node.js framework)
- MongoDB
- Prisma ORM
- Stripe (Payments)
- Cloudinary (Image upload)
- Docker & Docker Compose

---

## Project Structure

```
ticket-system-backend/
├── prisma/ # Prisma schema
├── generated/ # Generated Prisma client
├── src/
│ ├── auth/ # Authentication & guards
│ ├── admin/ # Admin management
│ ├── customer/ # Customer profile & actions
│ ├── event/ # Event management
│ ├── ticket/ # Ticket & QR handling
│ ├── transaction/ # Payment transactions
│ ├── voucher/ # Voucher system
│ ├── stripe/ # Stripe integration & webhook
│ ├── cloudinary/ # Image upload service
│ ├── mail/ # Email & OTP services
│ ├── prisma/ # Prisma service wrapper
│ ├── database/ # Database module
│ ├── config/ # App configuration
│ ├── app.module.ts
│ └── main.ts # Application entry point
├── test/ # E2E tests
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```


---

## Requirements

- Node.js >= 16
- npm
- MongoDB (local or cloud)
- Docker & Docker Compose (recommended)
- Stripe CLI (for local webhook testing)

---

## Environment Configuration

Before running the project, create a `.env` file from the example:

```bash
cp .env.example .env
```

## Project Setup
### Option 1: Run with Docker (Recommended)
```bash
cp .env.example .env
npx prisma generate
docker compose up -d
```

The backend will run at: `http://localhost:3001`

### Option 2: Run without Docker
```bash
cp .env.example .env
npx prisma generate
npm ci
npm run start:dev
```

## Prisma & Database Commands

Sync Prisma schema with the database:
```bash
npm run db:sync
```

Push changes after updating schema.prisma:
```bash
npx prisma db push
```

## Stripe Webhook (Local Development)

To receive Stripe webhook events when running locally, you need Stripe CLI.

### Install Stripe CLI
- Follow the official guide:
https://stripe.com/docs/stripe-cli

- After installation, log in:
```bash
stripe login
```
### Run Stripe Webhook Listener
- When running the backend locally, start the webhook forwarder:
```bash
stripe listen --forward-to http://localhost:3001/stripe/stripe-webhook
```

- Copy the generated webhook secret and update:
```bash
# in .env file
STRIPE_WEBHOOK_SECRET=whsec_...
```

- This step is required for payment flows to work correctly in local development.

## Notes

- Prisma client is generated into the `generated/` directory.

- MongoDB can be local or MongoDB Atlas.

- Docker is strongly recommended to avoid environment issues.

- Stripe webhooks will not work locally without Stripe CLI.
# ClearBooks Desktop

ClearBooks Desktop is the frontend application for **ClearBooks**, a secure bookkeeping platform for small businesses. The app helps users track income and expenses, view financial summaries, manage opening balances, and work with reporting periods that can be locked for audit-safe financial history.

This repository contains the desktop-facing client application. The backend API is maintained separately in the `clearbooks-backend` repository.

## Project Status

This project is in early development. The backend API already supports authentication, user/business provisioning, transactions, summaries, opening snapshots, reporting periods, and locked-period protection.

The first frontend milestone is to build a simple desktop dashboard that connects to the existing backend APIs.

## Core Features Planned

- Secure login using AWS Cognito
- Dashboard for income, expenses, profit, and tax summaries
- Add income transactions
- Add expense transactions
- View transaction history
- Create and view opening financial snapshot
- View monthly reporting periods
- Lock reporting periods
- Prevent changes to locked financial periods
- Clean UI for small business owners and future accountant-ready workflows

## Tech Stack

The planned frontend stack is:

- React
- TypeScript
- Vite
- React Router
- AWS Cognito authentication
- Fetch or Axios for API requests
- CSS or Tailwind CSS for styling

## Backend API

The frontend will connect to the ClearBooks backend API.

Local backend URL:

```txt
http://localhost:3000
```

Important API routes currently available:

```txt
GET    /health
GET    /health/db
GET    /api/me
POST   /api/transactions/income
POST   /api/transactions/expense
GET    /api/transactions
GET    /api/summary/income
GET    /api/summary/tax
GET    /api/summary/profit
POST   /api/opening-snapshot
GET    /api/opening-snapshot
GET    /api/periods
PATCH  /api/periods/:id/lock
```

## Security Principles

Security is a core part of ClearBooks.

The frontend should never be treated as the source of truth. It may show or hide UI elements, but the backend must always enforce authorization, ownership, validation, and locked-period rules.

Key rules:

- Do not store secrets in the frontend repository.
- Do not commit access tokens, ID tokens, refresh tokens, or `.env` files.
- Use Cognito access tokens for authenticated backend requests.
- Never send `businessId` or `userId` from the frontend request body.
- Backend routes should use authenticated request context for business scoping.
- The frontend should handle errors safely without exposing internal details.
- Use HTTPS in production.
- Keep environment-specific values in local environment files.

## Suggested Environment Variables

Create a local environment file such as:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_COGNITO_REGION=ca-central-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
```

Do not commit real `.env` files.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Initial Development Plan

Recommended first milestone:

1. Create the React/Vite/TypeScript project structure.
2. Add routing for login, dashboard, transactions, opening snapshot, and reporting periods.
3. Connect the app to Cognito authentication.
4. Call `GET /api/me` after login to confirm backend authentication works.
5. Build a basic dashboard using summary endpoints.
6. Add income and expense transaction forms.
7. Add transaction list view.
8. Add opening snapshot view.
9. Add reporting periods list and lock button.
10. Test that locked periods reject new transactions from the frontend flow.

## Product Positioning

ClearBooks is designed to help small businesses keep clean financial records and understand their numbers before tax season.

The goal is not to replace accountants. The goal is to prepare organized, accountant-friendly bookkeeping data.

## Repository Naming

Recommended repository name:

```txt
clearbooks-desktop
```

## License

This project is currently private/internal. Add a license before making it public.

# TickeZ Frontend

This is the **frontend application** for the TickeZ system, built with **React**, **Vite**, and **Tailwind CSS**.  

The project focuses on event browsing, ticket booking, user authentication, and organizer management features.

---

## Tech Stack

- React (JavaScript)
- Vite
- Tailwind CSS
- Axios
- ESLint

---

## Project Structure
```arduino
tickez-frontend/
├── public/ # Static assets
│ ├── logo.png
│ └── dieu-khoan.pdf
├── src/
│ ├── assets/ # Images and static resources
│ ├── components/ # Reusable UI components
│ ├── context/ # React Context (global state)
│ ├── createEvents/ # Event creation flow (multi-step pages)
│ ├── dashboard/ # Dashboard pages
│ ├── eventorderpage/ # Orders, vouchers, admin views
│ ├── information/ # Admin / organizer profile pages
│ ├── myEventsPage/ # Organizer event management
│ ├── organizerlayout/ # Organizer layout & terms
│ ├── pages/ # Application pages (routing targets)
│ ├── services/ # API services (Axios clients)
│ ├── App.jsx # Main app & routing
│ ├── index.jsx # Entry point
│ └── index.css # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── package-lock.json
```

## Requirements

- Node.js >= 16
- npm

---

## Installation

Install project dependencies:

```bash
npm install
```

## Running the Project (Local)

Start the development server:
```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## Notes

- This frontend communicates with the backend via REST APIs defined in src/services.

- Environment variables (if needed) should be configured according to the backend setup.

- The project uses Vite, so hot-reload is enabled by default.

## Scripts

Commonly used commands:
```bash
npm run dev       # Run development server
npm run build     # Build for production
npm run preview   # Preview production build
```
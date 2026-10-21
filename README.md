# 🎫 IT Help Desk Ticketing System

A full-stack, responsive IT Help Desk ticketing web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **SQLite**. 

This system allows employees to submit technical support requests, track ticket lifecycle statuses, and provides an IT queue dashboard for technicians to triage, update, and manage support tickets.

---

## 🚀 Features

- **📊 Dashboard Overview (`/`)**: Live metric cards displaying aggregate counts for Total, Open, In Progress, and Resolved tickets.
- **📝 Ticket Submission Portal (`/submit`)**: User-friendly form allowing users to submit issues with category selection (Hardware, Software, Network, Access, Other) and urgency priority levels (Low, Medium, High, Urgent).
- **📋 IT Technician Queue (`/queue`)**:
  - Live search across ticket subjects, descriptions, and requester emails.
  - Multi-filter support by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) and priority.
  - Inline status update dropdowns for instant state transitions.
  - Interactive ticket detail modal view.
  - Ticket deletion capabilities.
  - Formatted ticket identifiers (e.g., `#TCK-001`).
- **⚡ RESTful API Endpoints**: Clean Next.js route handlers supporting full CRUD operations (`GET`, `POST`, `PATCH`, `DELETE`).
- **🗄️ Database ORM**: Powered by Prisma with SQLite for reliable local relational data persistence.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React 19 / App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** SQLite
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   └── tickets/
│   │       ├── route.ts         # GET (all tickets) & POST (create ticket)
│   │       └── [id]/
│   │           └── route.ts     # PATCH (update status) & DELETE (remove ticket)
│   ├── queue/
│   │   └── page.tsx             # IT technician ticket queue & triage interface
│   ├── submit/
│   │   └── page.tsx             # Employee ticket submission form
│   ├── layout.tsx               # Root layout & global navigation bar
│   ├── page.tsx                 # Dashboard home page with metric counters
│   └── globals.css              # Global styles & Tailwind directives
├── prisma/
│   ├── schema.prisma            # Database schema & ticket model definition
│   └── dev.db                   # SQLite local database file
├── lib/
│   └── prisma.ts                # Singleton Prisma client instance
├── .gitignore                   # Ignored files (node_modules, .env, *.db)
├── package.json
└── README.md
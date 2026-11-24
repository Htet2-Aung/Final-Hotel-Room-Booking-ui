# Relax Oasis - Hotel Room Booking (Frontend)

React single-page app for the Relax Oasis hotel booking system.

**Backend repo (required, start it first):** https://github.com/Htet2-Aung/Final-Hotel-Room-Booking-Backend

## Tech Stack

- React 18, React Router 6, Redux Toolkit
- Axios -> backend REST API at http://localhost:8181
- Bootstrap 5 / SB Admin 2 theme, DataTables, Chart.js, React Quill, jsPDF

## How to Run

1. Start the backend API first (see its README) -> http://localhost:8181
2. Install dependencies:

       npm install

3. Start the dev server:

       npm start

4. Open http://localhost:3000

## Demo Accounts (auto-seeded by the backend on an empty database)

| Role  | Email             | Password | What you can try |
|-------|-------------------|----------|------------------|
| Admin | `admin@gmail.com` | `5678`   | Dashboard, room & room type CRUD, user management, confirm bookings (auto-emails the guest), payments, activity log |
| User  | `user@gmail.com`  | `1234`   | Browse/search rooms, book a room, pay with wallet, view/cancel your bookings |

## Feature Overview

- Room browsing with search by date range and room type
- Booking flow with wallet payment and automatic refund on cancel
- Admin confirms a booking -> a confirmation email is sent to the guest automatically
- Admin user management (view, delete with confirm dialog)
- Activity log: automatic audit trail plus personal notes (add / edit / delete)
- Shared UI components: ConfirmModal, ActionIcon, reusable admin tables
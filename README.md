# Temple Management System

A full-stack MERN application designed to help temples manage daily sevas, recurring subscriptions, and counter receipts efficiently.

⚠️ This project is currently under active development.

---

## Features

### Dashboard
- Displays today's scheduled sevas
- Shows payment status for each seva
- Allows marking payment as paid
- Allows marking seva as completed
- Summary cards showing:
  - Total sevas today
  - Pending payments
  - Completed sevas

### Counter System
- Generate receipts for walk-in devotees
- Select multiple sevas
- Automatic receipt numbering
- Stores transaction data

### Recurring Sevas
- Register birthday or anniversary sevas
- Optional annadaan inclusion
- Automatic yearly execution generation using cron jobs
- Payment tracking for each execution

### Seva Catalog
- Add new sevas
- Edit seva prices
- Enable or disable sevas
- Counter page shows only active sevas

---

## Tech Stack

Frontend
- React
- Vite
- Tailwind CSS

Backend
- Node.js
- Express.js

Database
- MongoDB
- Mongoose

Other Tools
- node-cron (for recurring seva automation)

---

## System Workflow

RecurringSeva → defines recurring subscription  
SevaExecution → yearly generated seva instance  
Receipt → counter transaction record

A background cron job automatically generates seva executions based on recurring subscriptions.

---

## Setup Instructions
# Clone the repository
git clone <your-repo-link>

# Navigate to the project
cd temple-admin-system

# Install backend dependencies
cd backend
npm install

# Start backend server
npm run dev

# Open another terminal and install frontend dependencies
cd ../frontend
npm install

# Start frontend
npm run dev

# Application URLs
Frontend: http://localhost:5173
Backend:  http://localhost:5000

---

## Future Improvements

- Revenue analytics
- Devotee search functionality
- Enhanced dashboard insights
- Reporting features

---

## Author

Sinchana Ganapati Naik
# Temple Management System

A full-stack MERN application designed to help temples manage daily sevas, recurring subscriptions, and counter receipts efficiently.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Other:** node-cron (recurring seva automation)

## Features

### Dashboard
- View today's scheduled sevas with payment status
- Mark sevas as paid or completed
- Summary cards: total sevas, pending payments, completed sevas

### Counter System
- Generate receipts for walk-in devotees
- Select multiple sevas with automatic receipt numbering
- Stores all transaction data

### Recurring Sevas
- Register birthday or anniversary sevas with optional annadaan inclusion
- Automatically generates yearly seva executions using cron jobs
- Payment tracking for each execution

### Seva Catalog
- Add, edit, enable, or disable sevas
- Counter page displays only active sevas

## System Workflow

RecurringSeva → defines recurring subscription
SevaExecution → yearly generated seva instance
Receipt → counter transaction record

A background cron job automatically generates seva executions based on recurring subscriptions.

## Setup Instructions

1. Clone the repository
   git clone https://github.com/SinchanaGanapatiNaik/temple-management

2. Install backend dependencies
   cd backend
   npm install
   npm run dev

3. Install frontend dependencies (new terminal)
   cd frontend
   npm install
   npm run dev

## Application URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Future Improvements

- Revenue analytics
- Devotee search functionality
- Enhanced dashboard insights
- Reporting features

## Author

Sinchana Ganapati Naik

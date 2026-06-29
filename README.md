# Sprout – Budget Tracker

A personal budget tracking web app that helps users manage expenses, transactions, and savings goals.

## Team Members
- Diwan Bhangal – Front-end: dashboard layout
- Soniya Dasadia – Front-end: loading, get started page
- Joleene Ismael – Front-end: modals, expenses, transactions, savings logic, backend skeleton
- Raeya sangha - ER Diagram
- Alfonso Diaz - Database Schema Quality, Normalization, & SQL Correctness
- Karan Goel - SQL
- Mina Mansour - Repo set up, kanban board
- Haider Waheed - Front-end QA and Error handling
- Harbir Bains - Activity blog/Wiki

## Features
- Add, edit, and delete expense budget categories
- Track transactions per category. Actual column updates automatically
- Transaction category dropdown pulls from expense categories
- Savings goals with progress bar and Add Money functionality
- Filter expenses and transactions by date range, category, min/max amount
- Sort by amount low to high or high to low
- Overview stats: Balance Remaining, Total Spent, Total Saved are all dynamic
- Balance Remaining turns red when over budget
- All data persists in localStorage (to be replaced with backend in Milestone 3)

## How to Run (Front-end)
1. Clone the repository:
```bash
   git clone git https://github.com/MinaManso/sprout.git
```
2. Open the project folder in VS Code
3. Install the Live Server extension
4. Right-click `dashboard.html` and select **Open with Live Server**

## How to Run (Back-end)
1. Navigate to the backend folder:
```bash
   cd backend
```
2. Install dependencies:
```bash
   npm install
```
3. Start the server:
```bash
   npm run dev
```
4. Server runs at `http://localhost:3000`

## API Endpoints (Stubs)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Create an expense |
| DELETE | /api/expenses/:id | Delete an expense |
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Create a transaction |
| DELETE | /api/transactions/:id | Delete a transaction |
| GET | /api/savings | Get all savings goals |
| POST | /api/savings | Create a savings goal |
| DELETE | /api/savings/:id | Delete a savings goal |

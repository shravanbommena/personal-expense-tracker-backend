# Personal Expense Tracker API

## Overview

The Personal Expense Tracker API is a RESTful service built using Node.js and Express.js that allows users to manage their personal financial records. Users can record their income and expenses, retrieve past transactions, and obtain summaries by category or time period.

## Features

- Add new transactions (income or expense)
- Retrieve all transactions or a specific transaction by ID
- Update and delete transactions
- Get a summary of transactions categorized by type (income/expense)
- Validate date input using Day.js

## Technologies Used

- Node.js
- Express.js
- SQLite
- Day.js
- CORS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node package manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/personal-expense-tracker.git
   cd personal-expense-tracker
   ```

   Install dependencies:

   ```bash
   npm install
   ```

Run the application:

```bash
node app.js
```

The server will start on `http://localhost:3000`.

### Database Setup

The application uses SQLite as the database. The database file expenses.db will be created automatically on the first run if it does not already exist. The necessary tables will be created during initialization.
API Documentation
Endpoints

1. Create a Transaction

   - POST `/transactions`

   - Request Body:

   ```json
   {
     "type": "income", // or "expense"
     "category_id": 1, // ID of the category
     "amount": 100.0,
     "date": "2024-10-05",
     "description": "Salary"
   }
   ```

   - Response:
     - 201 Created: Returns the created transaction object.
     - 400 Bad Request: If the date format is invalid.
     - 500 Internal Server Error: If there’s an error adding the transaction.

2. Get All Transactions

   - GET `/transactions`
   - Response:
     - 200 OK: Returns an array of all transaction objects.
     - 500 Internal Server Error: If there’s an error fetching transactions.

3. Get a Transaction by ID

   - GET `/transactions/:id`
   - Response:
     - 200 OK: Returns the transaction object for the given ID.
     - 404 Not Found: If the transaction is not found.
     - 500 Internal Server Error: If there’s an error fetching the transaction.

4. Update a Transaction

   - PUT `/transactions/:id`

   - Request Body:

   ```json
   {
     "type": "income", // or "expense"
     "category_id": 1, // ID of the category
     "amount": 150.0,
     "date": "2024-10-10",
     "description": "Updated Salary"
   }
   ```

   - Response:
     - 200 OK: Returns the updated transaction object.
     - 400 Bad Request: If the date format is invalid.
     - 404 Not Found: If the transaction is not found.
     - 500 Internal Server Error: If there’s an error updating the transaction.

5. Delete a Transaction

   - DELETE `/transactions/:id`
   - Response:
     - 204 No Content: If the transaction is successfully deleted.
     - 404 Not Found: If the transaction is not found.
     - 500 Internal Server Error: If there’s an error deleting the transaction.

6. Get Summary of Transactions

   - GET `/transactions/summary`
   - Response:
     - 200 OK: Returns a summary of transactions categorized by type (income/expense).
     - 500 Internal Server Error: If there’s an error fetching the summary.

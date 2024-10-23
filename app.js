const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dayjs = require("dayjs");

const app = express();

const dbPath = path.join(__dirname, "database.db");

app.use(express.json());
app.use(cors());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server started running at http://localhost:5000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Function to check if date is valid using Day.js
const isValidDate = (date) => {
  return dayjs(date, "YYYY-MM-DD", true).isValid(); // Strict parsing
};

// Get summary of transactions
app.get("/transactions/summary", async (req, res) => {
  const getSummaryQuery = `SELECT type, SUM(amount) AS total FROM transactions GROUP BY type;`;

  try {
    const dbResponse = await db.all(getSummaryQuery);

    return res.status(200).json(dbResponse);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching summary", error: err.message });
  }
});

// Create a new transaction
app.post("/transactions", async (req, res) => {
  const { type, category_id, amount, date, description } = req.body;

  // Validate date format
  if (!isValidDate(date)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Please use YYYY-MM-DD." });
  }

  const insertTransactionQuery = `INSERT INTO transactions (type, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)`;

  try {
    const dbResponse = await db.run(insertTransactionQuery, [
      type,
      category_id,
      amount,
      date,
      description,
    ]);
    res.status(201).json({
      id: dbResponse.lastID,
      type,
      category_id,
      amount,
      date,
      description,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error adding transaction", error: err.message });
  }
});

// Get all transactions
app.get("/transactions", async (req, res) => {
  const getAllTransactionsQuery = `SELECT id, type, category_id, amount, date, description FROM transactions`;

  try {
    const dbResponse = await db.all(getAllTransactionsQuery);
    return res.status(200).json(dbResponse);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching transactions", error: err.message });
  }
});

// Get a transaction by ID
app.get("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  const getTransactionByIdQuery = `SELECT id, type, category_id, amount, date, description FROM transactions WHERE id = ?`;

  try {
    const dbResponse = await db.get(getTransactionByIdQuery, [id]);
    if (!dbResponse) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(dbResponse);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching transaction", error: err.message });
  }
});

// Update a transaction by ID
app.put("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  const { type, category_id, amount, date, description } = req.body;

  // Validate date format
  if (!isValidDate(date)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Please use YYYY-MM-DD." });
  }

  const updateTransactionQuery = `UPDATE transactions SET type = ?, category_id = ?, amount = ?, date = ?, description = ? WHERE id = ?`;

  try {
    await db.run(updateTransactionQuery, [
      type,
      category_id,
      amount,
      date,
      description,
      id,
    ]);
    if (this.changes === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ id, type, category_id, amount, date, description });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating transaction", error: err.message });
  }
});

// Delete a transaction by ID
app.delete("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  const deleteTransactionQuery = `DELETE FROM transactions WHERE id = ?`;

  try {
    const dbResponse = await db.run(deleteTransactionQuery, [id]);
    if (dbResponse.changes === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.status(204);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting transaction", error: err.message });
  }
});

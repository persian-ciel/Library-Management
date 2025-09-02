import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

let db;

// Email transporter configuration (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password", // Replace with your app-specific password
  },
});

async function initDB() {
  try {
    db = await open({
      filename: "./library.db",
      driver: sqlite3.Database,
    });

    // Books table creation
    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        description TEXT,
        rate REAL,
        image TEXT
      )
    `);

    // Users table creation
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        postcode TEXT,
        email TEXT UNIQUE
      )
    `);

    // Borrowed Books (Transactions)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS borrowed_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        book_id INTEGER,
        borrow_date TEXT,
        due_date TEXT,
        returned_date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(book_id) REFERENCES books(id)
      )
    `);

    // Archive table for borrowed books history
    await db.exec(`
      CREATE TABLE IF NOT EXISTS borrowed_books_archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        book_id INTEGER,
        borrow_date TEXT,
        due_date TEXT,
        returned_date TEXT,
        archived_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(book_id) REFERENCES books(id)
      )
    `);

    // Insert sample books if table is empty
    const row = await db.get("SELECT COUNT(*) as count FROM books");
    if (row.count === 0) {
      const sampleBooks = [];
      for (let i = 1; i <= 10; i++) {
        sampleBooks.push([
          `Book ${i}`,
          `Author ${i}`,
          `Description ${i}`,
          (Math.random() * 5).toFixed(1),
          "",
        ]);
      }
      const stmt = await db.prepare(
        "INSERT INTO books (title, author, description, rate, image) VALUES (?, ?, ?, ?, ?)"
      );
      for (const b of sampleBooks) {
        await stmt.run(...b);
      }
      await stmt.finalize();
      console.log("Inserted sample books");
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

// Function to check due books and send email notifications
async function checkDueBooks() {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    const dueBooks = await db.all(
      `
      SELECT bb.*, u.email, u.username, b.title
      FROM borrowed_books bb
      JOIN users u ON bb.user_id = u.id
      JOIN books b ON bb.book_id = b.id
      WHERE bb.due_date = ? AND bb.returned_date IS NULL
    `,
      [currentDate]
    );

    for (const book of dueBooks) {
      const mailOptions = {
        from: "your-email@gmail.com", // Replace with your email
        to: book.email,
        subject: `Reminder: Return "${book.title}" by ${book.username}`,
        text: `Dear ${book.username},\n\nThe book "${book.title}" is due for return today. Please return it to the library as soon as possible.\n\nThank you,\nLibrary Team`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${book.email} for book "${book.title}"`);
      } catch (emailErr) {
        console.error(`Failed to send email to ${book.email}:`, emailErr);
      }
    }
  } catch (err) {
    console.error("Failed to check due books:", err);
  }
}

// Run the check every minute
setInterval(checkDueBooks, 60 * 1000);

// Books endpoints
app.get("/books", async (req, res) => {
  try {
    const books = await db.all("SELECT * FROM books");
    res.json(books);
  } catch (err) {
    console.error("Failed to fetch books:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await db.get("SELECT * FROM books WHERE id=?", [
      req.params.id,
    ]);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    console.error("Failed to fetch book:", err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, description, rate, image } = req.body;
    const result = await db.run(
      "INSERT INTO books (title, author, description, rate, image) VALUES (?, ?, ?, ?, ?)",
      [title, author, description, rate, image]
    );
    const book = await db.get("SELECT * FROM books WHERE id=?", [
      result.lastID,
    ]);
    res.status(201).json(book);
  } catch (err) {
    console.error("Failed to create book:", err);
    res.status(500).json({ error: "Failed to create book" });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { title, author, description, rate, image } = req.body;
    await db.run(
      "UPDATE books SET title=?, author=?, description=?, rate=?, image=? WHERE id=?",
      [title, author, description, rate, image, req.params.id]
    );
    const book = await db.get("SELECT * FROM books WHERE id=?", [
      req.params.id,
    ]);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    console.error("Failed to update book:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM books WHERE id=?", [
      req.params.id,
    ]);
    if (result.changes === 0) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json({ message: "Book deleted" });
    }
  } catch (err) {
    console.error("Failed to delete book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// Users endpoints
app.get("/users", async (req, res) => {
  try {
    const users = await db.all(
      "SELECT id, username, postcode, email FROM users"
    );
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, password, postcode, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (username, password, postcode, email) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, postcode, email]
    );
    const user = await db.get(
      "SELECT id, username, postcode, email FROM users WHERE id=?",
      [result.lastID]
    );
    res.status(201).json(user);
  } catch (err) {
    console.error("Failed to create user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { username, password, postcode, email } = req.body;

    // Check if user exists
    const existingUser = await db.get("SELECT id FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate fields
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    // Hash the password if provided
    let hashedPassword = password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user in the database
    await db.run(
      "UPDATE users SET username=?, password=?, postcode=?, email=? WHERE id=?",
      [username, hashedPassword, postcode, email, req.params.id]
    );

    // Fetch the updated user data
    const updatedUser = await db.get(
      "SELECT id, username, postcode, email FROM users WHERE id=?",
      [req.params.id]
    );
    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Borrowed Books Endpoints
app.post("/borrow", async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    const borrow_date = new Date().toISOString();

    // Insert transaction
    const result = await db.run(
      "INSERT INTO borrowed_books (user_id, book_id, borrow_date, due_date) VALUES (?, ?, ?, ?)",
      [user_id, book_id, borrow_date, due_date]
    );

    const borrowed = await db.get("SELECT * FROM borrowed_books WHERE id=?", [
      result.lastID,
    ]);
    res.status(201).json(borrowed);
  } catch (err) {
    console.error("Failed to assign book:", err);
    res.status(500).json({ error: "Failed to assign book" });
  }
});

app.get("/borrow", async (req, res) => {
  try {
    const { search, filterBy } = req.query;
    let query = `
      SELECT bb.*, u.username, b.title
      FROM borrowed_books bb
      JOIN users u ON bb.user_id = u.id
      JOIN books b ON bb.book_id = b.id
    `;
    let params = [];

    if (search && filterBy) {
      if (filterBy === "user") {
        query += " WHERE u.username LIKE ?";
        params = [`%${search}%`];
      } else if (filterBy === "book") {
        query += " WHERE b.title LIKE ?";
        params = [`%${search}%`];
      } else {
        query += " WHERE u.username LIKE ? OR b.title LIKE ?";
        params = [`%${search}%`, `%${search}%`];
      }
    }

    query += " ORDER BY bb.borrow_date DESC";

    const rows = await db.all(query, params);
    res.json(rows || []); // Always return an array
  } catch (err) {
    console.error("Failed to fetch borrowed books:", err);
    res.status(500).json([]); // Return empty array on error
  }
});

app.put("/borrow/:id/return", async (req, res) => {
  try {
    const returned_date = new Date().toISOString();
    const archived_at = new Date().toISOString();

    // Fetch the borrowed book record
    const borrowed = await db.get("SELECT * FROM borrowed_books WHERE id=?", [
      req.params.id,
    ]);

    if (!borrowed) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    // Archive the record
    await db.run(
      "INSERT INTO borrowed_books_archive (user_id, book_id, borrow_date, due_date, returned_date, archived_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        borrowed.user_id,
        borrowed.book_id,
        borrowed.borrow_date,
        borrowed.due_date,
        returned_date,
        archived_at,
      ]
    );

    // Update the borrowed book record
    await db.run("UPDATE borrowed_books SET returned_date=? WHERE id=?", [
      returned_date,
      req.params.id,
    ]);

    const updated = await db.get("SELECT * FROM borrowed_books WHERE id=?", [
      req.params.id,
    ]);
    res.json(updated);
  } catch (err) {
    console.error("Failed to mark return:", err);
    res.status(500).json({ error: "Failed to mark return" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Initialize DB and start the server
initDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

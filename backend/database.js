import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./library.db",
    driver: sqlite3.Database,
  });

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

  const bookCount = await db.get("SELECT COUNT(*) as count FROM books");
  if (bookCount.count === 0) {
    const sampleBooks = [
      {
        title: "Book 1",
        author: "Author 1",
        description: "Desc 1",
        rate: 5.0,
        image: "",
      },
      {
        title: "Book 2",
        author: "Author 2",
        description: "Desc 2",
        rate: 4.0,
        image: "",
      },
      {
        title: "Book 3",
        author: "Author 3",
        description: "Desc 3",
        rate: 3.0,
        image: "",
      },
      {
        title: "Book 4",
        author: "Author 4",
        description: "Desc 4",
        rate: 5.0,
        image: "",
      },
      {
        title: "Book 5",
        author: "Author 5",
        description: "Desc 5",
        rate: 4.0,
        image: "",
      },
      {
        title: "Book 6",
        author: "Author 6",
        description: "Desc 6",
        rate: 3.0,
        image: "",
      },
      {
        title: "Book 7",
        author: "Author 7",
        description: "Desc 7",
        rate: 5.0,
        image: "",
      },
      {
        title: "Book 8",
        author: "Author 8",
        description: "Desc 8",
        rate: 4.0,
        image: "",
      },
      {
        title: "Book 9",
        author: "Author 9",
        description: "Desc 9",
        rate: 3.0,
        image: "",
      },
      {
        title: "Book 10",
        author: "Author 10",
        description: "Desc 10",
        rate: 5.0,
        image: "",
      },
    ];
    for (const book of sampleBooks) {
      await db.run(
        "INSERT INTO books (title, author, description, rate, image) VALUES (?, ?, ?, ?, ?)",
        [book.title, book.author, book.description, book.rate, book.image]
      );
    }
    console.log("Inserted sample books");
  }

  return db;
}

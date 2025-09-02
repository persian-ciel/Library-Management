import React, { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import BorrowForm from "./BorrowForm";
import BorrowTable from "./BorrowTable";

export default function Cart() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchBorrowed();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/users");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setError(`Failed to fetch users: ${err.message}`);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:4000/books");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
      setError(`Failed to fetch books: ${err.message}`);
    }
  };

  const fetchBorrowed = async (q = "", f = "all") => {
    try {
      const res = await fetch(
        `http://localhost:4000/borrow?search=${encodeURIComponent(
          q
        )}&filterBy=${encodeURIComponent(f)}`
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${
            errorData.error || "Not Found"
          }`
        );
      }
      const data = await res.json();
      console.log("Fetched borrowed data:", data);
      setBorrowed(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch borrowed books:", err);
      setBorrowed([]);
      setError(`Failed to fetch borrowed books: ${err.message}`);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedBook || !dueDate) {
      alert("Please select user, book, and due date");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser,
          book_id: selectedBook,
          due_date: dueDate,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${
            errorData.error || "Failed to assign"
          }`
        );
      }
      await fetchBorrowed(search, filterBy);
      setSelectedUser("");
      setSelectedBook("");
      setDueDate("");
      setError(null);
    } catch (err) {
      console.error("Failed to assign book:", err);
      alert(`Failed to assign book: ${err.message}`);
      setError(`Failed to assign book: ${err.message}`);
    }
  };

  const handleReturn = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/borrow/${id}/return`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${
            errorData.error || "Failed to mark return"
          }`
        );
      }
      await fetchBorrowed(search, filterBy);
      setError(null);
    } catch (err) {
      console.error("Failed to mark return:", err);
      alert(`Failed to mark return: ${err.message}`);
      setError(`Failed to mark return: ${err.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Borrowed Books</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <BorrowForm
        users={users}
        books={books}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        dueDate={dueDate}
        setDueDate={setDueDate}
        handleAssign={handleAssign}
      />

      <SearchFilter
        search={search}
        setSearch={setSearch}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        fetchBorrowed={fetchBorrowed}
      />

      <BorrowTable borrowed={borrowed} handleReturn={handleReturn} />
    </div>
  );
}

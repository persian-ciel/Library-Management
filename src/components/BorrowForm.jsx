import React, { useState, useEffect } from "react";

export default function BorrowForm({
  users,
  books,
  selectedUser,
  setSelectedUser,
  selectedBook,
  setSelectedBook,
  dueDate,
  setDueDate,
  handleAssign,
}) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg shadow">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border p-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>

      <select
        value={selectedBook}
        onChange={(e) => setSelectedBook(e.target.value)}
        className="border p-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Book</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={handleAssign}
      >
        Assign
      </button>
    </div>
  );
}

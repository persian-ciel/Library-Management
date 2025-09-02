import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";

export default function BorrowTable({ borrowed, handleReturn, handleDelete }) {
  return (
    <div className="overflow-x-auto max-h-[350px] overflow-y-auto border rounded-lg shadow">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-gray-100 sticky top-zero">
          <tr>
            <th className="border p-3 text-left">User</th>
            <th className="border p-3 text-left">Book</th>
            <th className="border p-3 text-left">Borrow Date</th>
            <th className="border p-3 text-left">Due Date</th>
            <th className="border p-3 text-left">Returned</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowed.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No borrowed books found
              </td>
            </tr>
          ) : (
            borrowed.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="border p-3">{row.username}</td>
                <td className="border p-3">{row.title}</td>
                <td className="border p-3">
                  {new Date(row.borrow_date).toLocaleDateString()}
                </td>
                <td className="border p-3">
                  {new Date(row.due_date).toLocaleDateString()}
                </td>
                <td className="border p-3">
                  {row.returned_date
                    ? new Date(row.returned_date).toLocaleDateString()
                    : "Not returned"}
                </td>
                <td className="border p-3 flex space-x-2">
                  {!row.returned_date && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      onClick={() => handleReturn(row.id)}
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

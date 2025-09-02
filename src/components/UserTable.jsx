import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

export default function UserTable({
  filteredUsers,
  isLoading,
  error,
  fetchUsers,
  setSelectedUser,
  page,
  setPage,
  usersPerPage,
}) {
  const { paginatedItems, renderPaginationControls } = Pagination({
    items: filteredUsers.map((user) => (
      <tr key={user.id} className="hover:bg-gray-50">
        <td className="py-2 px-4 border-b">{user.id}</td>
        <td className="py-2 px-4 border-b">{user.username}</td>
        <td className="py-2 px-4 border-b">{user.postcode}</td>
        <td className="py-2 px-4 border-b">{user.email}</td>
        <td className="py-2 px-4 border-b">
          <button
            onClick={() => setSelectedUser(user)}
            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 disabled:bg-gray-300 transition-colors text-sm"
            disabled={isLoading}
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete user ID ${user.id}?`
                )
              ) {
                fetch(`http://localhost:4000/users/${user.id}`, {
                  method: "DELETE",
                })
                  .then((res) => {
                    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                    fetchUsers();
                  })
                  .catch((err) => {
                    console.error("Failed to delete user:", err);
                    setError(`Failed to delete user: ${err.message}`);
                  });
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300 transition-colors text-sm"
            disabled={isLoading}
          >
            Delete
          </button>
        </td>
      </tr>
    )),
    itemsPerPage: usersPerPage,
    page,
    setPage,
  });

  return (
    <div className="flex-1 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">
            No users found. Add some users to get started!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow h-full content-start">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left font-semibold">
                  ID
                </th>
                <th className="py-3 px-4 border-b text-left font-semibold">
                  Username
                </th>
                <th className="py-3 px-4 border-b text-left font-semibold">
                  Postcode
                </th>
                <th className="py-3 px-4 border-b text-left font-semibold">
                  Email
                </th>
                <th className="py-3 px-4 border-b text-left font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{paginatedItems}</tbody>
          </table>
          {renderPaginationControls()}
        </div>
      )}
    </div>
  );
}

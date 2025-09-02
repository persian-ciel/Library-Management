import React, { useEffect, useState } from "react";

export default function UserSearch({
  searchQuery,
  setSearchQuery,
  isLoading,
  setSelectedUser,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">User Profiles</h1>
      <div className="flex space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="Search by username or email"
          disabled={isLoading}
        />
        <button
          onClick={() => setSelectedUser({})}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
          disabled={isLoading}
        >
          Add New User
        </button>
      </div>
    </div>
  );
}

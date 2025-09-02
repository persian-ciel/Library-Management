import React, { useEffect, useState } from "react";
import UserModal from "./UserModal";
import Pagination from "./Pagination";
import UserTable from "./UserTable";
import UserSearch from "./UserSearch";

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/users")
      .then((res) => {
        if (!res.ok)
          throw new Error(`HTTP error ${res.status}: Users endpoint not found`);
        return res.json();
      })
      .then((data) => {
        console.log("Users fetched:", data);
        setUsers(data);
        setFilteredUsers(data);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError(err.message || "Failed to load users. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to first page on search
  }, [searchQuery, users]);

  return (
    <div className="p-4 h-screen flex flex-col bg-gray-200 overflow-hidden">
      <UserSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        setSelectedUser={setSelectedUser}
      />

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 text-sm hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <UserTable
        filteredUsers={filteredUsers}
        isLoading={isLoading}
        error={error}
        fetchUsers={fetchUsers}
        setSelectedUser={setSelectedUser}
        page={page}
        setPage={setPage}
        usersPerPage={usersPerPage}
      />

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}

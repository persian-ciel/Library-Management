import React, { useState, useEffect } from "react";

export default function SearchFilter({
  search,
  setSearch,
  filterBy,
  setFilterBy,
  fetchBorrowed,
}) {
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchBorrowed(query, filterBy);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilterBy(newFilter);
    fetchBorrowed(search, newFilter);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by user or book"
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filterBy}
        onChange={handleFilterChange}
        className="border p-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="user">User</option>
        <option value="book">Book</option>
      </select>
    </div>
  );
}

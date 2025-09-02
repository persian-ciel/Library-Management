import React, { useEffect, useState } from "react";
import CountCard from "./CountCard";

function Dashboard() {
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0); // ✅ New state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch books count
      const booksRes = await fetch("http://localhost:4000/books");
      if (!booksRes.ok) throw new Error(`HTTP error ${booksRes.status}`);
      const booksData = await booksRes.json();
      setBookCount(booksData.length);

      // Fetch users count
      const usersRes = await fetch("http://localhost:4000/users");
      if (!usersRes.ok) throw new Error(`HTTP error ${usersRes.status}`);
      const usersData = await usersRes.json();
      setUserCount(usersData.length);

      // Fetch borrowed books
      const borrowedRes = await fetch("http://localhost:4000/borrow");
      if (!borrowedRes.ok) throw new Error(`HTTP error ${borrowedRes.status}`);
      const borrowedData = await borrowedRes.json();

      // ✅ Separate returned and non-returned
      const nonReturnedCount = borrowedData.filter(
        (item) => !item.returned_date
      ).length;
      const returnedCountVal = borrowedData.filter(
        (item) => item.returned_date
      ).length;

      setBorrowedCount(nonReturnedCount);
      setReturnedCount(returnedCountVal);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow text-center mb-4">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to the Library Management System
        </h1>
        <p className="text-gray-600">
          Use the sidebar to navigate to Books or Profiles.
        </p>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4 h-full content-start">
          <CountCard title="Total Books" count={bookCount} />
          <CountCard title="Total Users" count={userCount} />
          <CountCard title="Borrowed Books" count={borrowedCount} />
          <CountCard title="Returned Books" count={returnedCount} />{" "}
          {/* ✅ new card */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

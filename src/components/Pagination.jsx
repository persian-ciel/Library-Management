import React from "react";

export default function Pagination({ items, itemsPerPage, page, setPage }) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const renderPaginationControls = () => (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition"
      >
        Previous
      </button>
      <span className="px-3 py-1 text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition"
      >
        Next
      </button>
    </div>
  );

  return { paginatedItems, renderPaginationControls };
}

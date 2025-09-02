import React, { useEffect, useState } from "react";
import Card from "./Cards";
import BookModal from "./BookModal";

function Books() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState(1);
  const booksPerPage = 10; 

  const fetchBooks = () => {
    fetch("http://localhost:4000/books")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(
          "Books fetched:",
          data.map((b) => ({
            id: b.id,
            title: b.title,
            image: b.image ? b.image.substring(0, 20) : "no image",
          }))
        );
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Failed to fetch books:", err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(filtered);
    setPage(1); // Reset to first page on search
  }, [searchQuery, books]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (page - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-4 h-screen flex flex-col bg-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <button
          onClick={() => setSelectedBook({})}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
        >
          Add New Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 w-full rounded"
          placeholder="Search by title or author"
        />
      </div>

      {/* Books Grid */}
      <div className="flex-1 overflow-hidden">
        {filteredBooks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              No books found. Add some books to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3 h-full content-start">
            {paginatedBooks.map((book) => (
              <Card
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Previous
          </button>
          <span className="self-center text-gray-700 font-medium text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Next
          </button>
        </div>
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={fetchBooks}
        />
      )}
    </div>
  );
}

export default Books;

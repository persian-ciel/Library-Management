import React from "react";

function Card({ book, onClick }) {
  const placeholderImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  return (
    <div
      className="bg-white p-2 rounded shadow cursor-pointer hover:shadow-lg transition-shadow w-full h-48 flex flex-col" // Reduced height to h-48
      onClick={onClick}
    >
      <div className="flex justify-center mb-2">
        <img
          src={book.image || placeholderImage}
          alt={book.title || "Book"}
          className="w-20 h-28 object-cover rounded" // Smaller image size
          onError={(e) => {
            console.error(
              `Failed to load image for book ID ${book.id}:`,
              book.image
            );
            e.target.src = placeholderImage;
          }}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="font-bold text-xs mb-1 text-center line-clamp-2 leading-tight">
          {book.title || "Untitled"}
        </h2>
        <p className="text-gray-700 text-xs text-center line-clamp-2 mb-1">
          {book.author || "Unknown Author"}
        </p>
        <p className="text-gray-600 text-xs text-center">
          ⭐ {book.rate != null ? book.rate.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
}

export default Card;

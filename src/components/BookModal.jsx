import React, { useState } from "react";

function BookModal({ book, onClose, onUpdate }) {
  const isNewBook = !book?.id;
  const [formData, setFormData] = useState(
    book
      ? { ...book, image: book.image || "" }
      : { title: "", author: "", description: "", rate: 0, image: "" }
  );
  const [imagePreview, setImagePreview] = useState(book?.image || "");
  const [error, setError] = useState("");

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let { width, height } = img;

          // Calculate new dimensions to reduce size
          const maxDimension = 800; // Max width/height in pixels
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality reduction
          let quality = 0.8;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          if (dataUrl.length / 1024 > maxSizeKB) {
            reject(new Error("Image too large after compression"));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setError("");
    if (file) {
      try {
        const base64String = await compressImage(file, 500); // Max 500KB
        setFormData((prev) => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
        console.log(
          "Compressed image to base64:",
          base64String.substring(0, 50)
        );
      } catch (err) {
        console.error("Image compression failed:", err);
        setError("Failed to compress image. Try a smaller file.");
      }
    } else {
      setFormData((prev) => ({ ...prev, image: "" }));
      setImagePreview("");
    }
  };

  const handleSave = async () => {
    try {
      const url = isNewBook
        ? "http://localhost:4000/books"
        : `http://localhost:4000/books/${book.id}`;
      const method = isNewBook ? "POST" : "PUT";

      console.log(`Saving book (ID: ${isNewBook ? "new" : book.id}):`, {
        ...formData,
        image: formData.image ? formData.image.substring(0, 50) : "no image",
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isNewBook ? "create" : "update"} book: ${
            response.statusText
          }`
        );
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error(`Failed to ${isNewBook ? "create" : "update"} book`, err);
      setError(`Failed to save book: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (isNewBook) return;
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await fetch(`http://localhost:4000/books/${book.id}`, {
          method: "DELETE",
        });
        onUpdate();
        onClose();
      } catch (err) {
        console.error("Failed to delete book", err);
        setError("Failed to delete book");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-1/2 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {isNewBook ? "Add New Book" : formData.title || "Edit Book"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Book Title"
        />
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Author"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Description"
        />
        <input
          name="rate"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={formData.rate}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Rating (0-5)"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 w-full mb-2"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Book preview"
            className="w-32 h-32 object-cover mb-2 rounded"
            onError={(e) => {
              console.error("Failed to load image preview");
              e.target.style.display = "none";
            }}
          />
        )}

        <div className="flex justify-end gap-4 mt-4">
          {!isNewBook && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isNewBook ? "Create" : "Save"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookModal;

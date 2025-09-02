import React, { useState } from "react";

function UserModal({ user, onClose, onUpdate }) {
  const isNewUser = !user?.id;
  const [formData, setFormData] = useState(
    user
      ? {
          ...user,
          password: "",
          postcode: user.postcode || "",
          email: user.email || "",
        }
      : { username: "", password: "", postcode: "", email: "" }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const url = isNewUser
        ? "http://localhost:4000/users"
        : `http://localhost:4000/users/${user.id}`;
      const method = isNewUser ? "POST" : "PUT";

      console.log(`Saving user (ID: ${isNewUser ? "new" : user.id}):`, {
        ...formData,
        password: formData.password ? "[hidden]" : "unchanged",
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          password: formData.password || undefined, // Exclude empty password on update
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to ${isNewUser ? "create" : "update"} user: ${
            errorData.error || response.statusText
          }`
        );
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error(`Failed to ${isNewUser ? "create" : "update"} user`, err);
      setError(`Failed to save user: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (isNewUser) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:4000/users/${user.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }
        onUpdate();
        onClose();
      } catch (err) {
        console.error("Failed to delete user", err);
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-1/2 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {isNewUser ? "Add New User" : formData.username || "Edit User"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
          placeholder={
            isNewUser ? "Password" : "Password (Leave blank to keep existing)"
          }
        />
        <input
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
          placeholder="Postcode"
        />
        <div className="flex justify-end gap-4 mt-4">
          {!isNewUser && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isNewUser ? "Create" : "Save"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;

import React from "react";

function CountCard({ title, count }) {
  console.log(`Rendering ${title}:`, count); // Debug log to confirm props

  return (
    <div className="bg-white p-4 rounded shadow  text-center">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <p className="text-gray-700 text-xl">{count}</p>
    </div>
  );
}

export default CountCard;

import React from "react";

function Title({ text, onClick }) {
  return (
    <li
      onClick={onClick}
      className="hover:text-gray-200 hover:bg-blue-500 cursor-pointer p-3 transition-colors"
    >
      {text}
    </li>
  );
}

export default Title;

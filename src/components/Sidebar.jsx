import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const titles = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Profile", path: "/profile" },
    { text: "Books", path: "/books" },
    { text: "Cart", path: "/cart" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 text-left">Library Menu</h2>
      <ul className="space-y-4 flex-1 list-none p-0 m-0 text-left">
        {titles.map((item) => (
          <li
            key={item.path} // Using path as key since it's unique
            className="hover:bg-blue-500 hover:text-gray-200 cursor-pointer p-3 rounded transition-colors"
          >
            <Link to={item.path} className="block w-full">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-sm mt-auto">© 2025 Library</div>
    </aside>
  );
}

export default Sidebar;

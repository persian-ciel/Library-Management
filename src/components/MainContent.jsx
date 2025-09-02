import React from "react";
import Dashboard from "./Dahboard";
import Books from "./Book";
import Profile from "./profile";
import Cart from "./Cart";

function MainContent({ currentPage, setCurrentPage }) {
  return (
    <div className="flex-1 h-screen bg-gray-200 overflow-hidden">
      {" "}
      {/* Fixed height and no overflow */}
      <div className="h-full">
        {currentPage === "dashboard" && (
          <Dashboard setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "books" && <Books setCurrentPage={setCurrentPage} />}
        {currentPage === "profile" && (
          <Profile setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "cart" && <Cart setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}

export default MainContent;

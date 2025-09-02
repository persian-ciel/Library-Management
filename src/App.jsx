import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dahboard";
import Books from "./components/Book";
import Profile from "./components/profile";
import Cart from "./components/Cart";

function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen bg-gray-200">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Dashboard />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

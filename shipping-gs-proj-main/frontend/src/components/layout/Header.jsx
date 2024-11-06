// src/components/layout/Header.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { navLinks } from "../../lib/constants";
import { UserPen, Menu, X } from "lucide-react";
import { userNotExists } from "../../redux/reducer/auth";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // Manage menu state
  const location = useLocation(); // Get the current location (pathname)
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get dispatch function from Redux

  const { user } = useSelector((state) => state.auth); // Get user data from Redux
  const userRole = user?.role;

  // Filter links based on user role
  const filteredNavLinks = navLinks.filter(
    (link) =>  link.role === userRole
  );

  const handleLogout = () => {
    dispatch(userNotExists());
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Top section for displaying user dashboard info */}

      {/* Hamburger Icon for Mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <Menu
          className="text-black w-8 h-8 cursor-pointer"
          onClick={() => setMenuOpen(true)}
        />
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-60 p-7 flex flex-col gap-8 bg-blue-200 shadow-xl z-30 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:w-72`}
      >
        {/* Close Icon for Mobile */}
        <div className="lg:hidden flex justify-end">
          <X
            className="w-8 h-8 cursor-pointer text-black"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <img
            src="https://ship.gs/logo-2.png"
            alt="logo"
            width={50}
            height={30}
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-9">
          {filteredNavLinks.map((link) => (
            <Link
              to={link.url}
              key={link.label}
              className={`flex items-center gap-3 text-body-medium ${
                location.pathname === link.url
                  ? "text-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setMenuOpen(false)} // Close menu on link click
            >
              {link.icon}
              <p>{link.label}</p>
            </Link>
          ))}
          <button onClick={handleLogout}>LogOut</button>
        </div>
      </div>

      {/* Overlay for mobile (closes menu on click) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Header;

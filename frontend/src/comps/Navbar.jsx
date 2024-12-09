import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarState } from "../utils/Constants";
import hamburger from "../assets/hamburger.jpg";

function Navbar({ changeNavbarState, navbarState }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight + 10);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen]);

  const handleNavigation = (state, path) => {
    changeNavbarState(state);
    navigate(path);
  };

  const handleLogoutNavigation = () => {
    localStorage.removeItem("fileManagerJwtToken");
    navigate("/");
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-gray-800 p-4 hidden md:flex items-center justify-between">
        <div onClick={() => handleNavigation(NavbarState.HOME, "/")} className="text-white text-xl font-bold cursor-pointer">FileManager</div>
        <ul className="flex space-x-6">
          <li
            className={
              navbarState === NavbarState.HOME
                ? "text-gray-400 cursor-pointer"
                : "text-white hover:text-gray-400 cursor-pointer"
            }
          >
            <Link to="/" onClick={() => changeNavbarState(NavbarState.HOME)}>
              Home
            </Link>
          </li>
          <li
            className={
              navbarState === NavbarState.DELETE_FILES
                ? "text-gray-400 cursor-pointer"
                : "text-white hover:text-gray-400 cursor-pointer"
            }
          >
            <Link
              to="/AdvanceOperations"
              onClick={() => changeNavbarState(NavbarState.DELETE_FILES)}
            >
              Delete Files
            </Link>
          </li>
          <li
            className={
              navbarState === NavbarState.GROUP_FILES
                ? "text-gray-400 cursor-pointer"
                : "text-white hover:text-gray-400 cursor-pointer"
            }
          >
            <Link
              to="/AdvanceOperations"
              onClick={() => changeNavbarState(NavbarState.GROUP_FILES)}
            >
              Group Files
            </Link>
          </li>
          <li
            className={
              navbarState === NavbarState.GROUP_FILES_DATES
                ? "text-gray-400 cursor-pointer"
                : "text-white hover:text-gray-400 cursor-pointer"
            }
          >
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                changeNavbarState(NavbarState.GROUP_FILES_DATES)
              }
            >
              Group Files (Dates)
            </Link>
          </li>
          <li
            className={
              navbarState === NavbarState.ADVANCED_SEARCH
                ? "text-gray-400 cursor-pointer"
                : "text-white hover:text-gray-400 cursor-pointer"
            }
          >
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                changeNavbarState(NavbarState.ADVANCED_SEARCH)
              }
            >
              Advanced Search
            </Link>
          </li>
          <li
            className="text-white hover:text-gray-400 cursor-pointer">
            <Link
              to="/login"
              onClick={() =>
                handleLogoutNavigation()
              }
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex bg-gray-800 p-4 items-center justify-between md:hidden">
        <div onClick={() => handleNavigation(NavbarState.HOME, "/")} className="text-white text-xl font-bold cursor-pointer">FileManager</div>
        <img
          src={hamburger}
          className="w-7"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          alt="Hamburger Menu"
        />
      </nav>
      <nav
        className="bg-gray-800 flex md:hidden transition-height duration-300 ease-in-out overflow-hidden"
        style={{ height: `${menuHeight}px` }}
        ref={menuRef}
      >
        <ul className="flex flex-col items-center w-full pb-2">
          <li className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/"
              onClick={() => handleNavigation(NavbarState.HOME, "/")}
            >
              Home
            </Link>
          </li>
          <li className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                handleNavigation(NavbarState.DELETE_FILES, "/AdvanceOperations")
              }
            >
              Delete Files
            </Link>
          </li>
          <li className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                handleNavigation(NavbarState.GROUP_FILES, "/AdvanceOperations")
              }
            >
              Group Files
            </Link>
          </li>
          <li className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                handleNavigation(
                  NavbarState.GROUP_FILES_DATES,
                  "/AdvanceOperations"
                )
              }
            >
              Group Files (Dates)
            </Link>
          </li>
          <li className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/AdvanceOperations"
              onClick={() =>
                handleNavigation(
                  NavbarState.ADVANCED_SEARCH,
                  "/AdvanceOperations"
                )
              }
            >
              Advanced Search
            </Link>
          </li>
          <li
            className="text-white hover:text-gray-400 cursor-pointer my-1">
            <Link
              to="/login"
              onClick={() =>
                handleLogoutNavigation()
              }
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

import React from "react";
import { NavbarState } from "../utils/Constants";

function Navbar({ changeNavbarState }) {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-xl font-bold">FileManager</div>
      <ul className="flex space-x-6">
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState(NavbarState.DELETE_FILES);
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Delete Files
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState(NavbarState.GROUP_FILES);
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Group Files
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState(NavbarState.GROUP_FILES_DATES);
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Group Files (Dates)
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState(NavbarState.ADVANCED_SEARCH);
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Advanced Search
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState(NavbarState.DIRECTORY_STALKER);
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Directory Stalker
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

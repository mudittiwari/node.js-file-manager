import React from "react";

function Navbar({ changeNavbarState }) {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-xl font-bold">FileManager</div>
      <ul className="flex space-x-6">
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState("deleteFiles");
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Delete Files
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState("groupFiles");
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Group Files
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState("groupFilesDates");
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Group Files (Dates)
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState("advancedSearch");
          }}
          className="text-white hover:text-gray-400 cursor-pointer"
        >
          Advanced Search
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            changeNavbarState("directoryStalker");
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

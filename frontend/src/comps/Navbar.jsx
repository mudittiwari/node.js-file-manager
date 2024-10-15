import React, { useEffect, useRef, useState } from "react";
import { NavbarState } from "../utils/Constants";
import hamburger from "../assets/hamburger.jpg";
function Navbar({ changeNavbarState, navbarState }) {

  const [isOpen, setIsOpen] = useState(false);
  const menuRef=useRef(null);
  const [menuHeight,setMenuHeight]=useState(0);

  useEffect(()=>{
    if(isOpen && menuRef.current){
      setMenuHeight(menuRef.current.scrollHeight+10);
    }
    else{
      setMenuHeight(0);
    }
  },[isOpen])
  return (
    <>
      <nav className="bg-gray-800 p-4 hidden md:flex items-center justify-between">
        <div className="text-white text-xl font-bold">FileManager</div>
        <ul className="flex space-x-6">
          <li
            onClick={(e) => {
              e.preventDefault();
              changeNavbarState(NavbarState.DELETE_FILES);
            }}
            className={navbarState===NavbarState.DELETE_FILES?"text-gray-400 cursor-pointer" :"text-white hover:text-gray-400 cursor-pointer"}
          >
            Delete Files
          </li>
          <li
            onClick={(e) => {
              e.preventDefault();
              changeNavbarState(NavbarState.GROUP_FILES);
            }}
            className={navbarState===NavbarState.GROUP_FILES?"text-gray-400 cursor-pointer" :"text-white hover:text-gray-400 cursor-pointer"}
          >
            Group Files
          </li>
          <li
            onClick={(e) => {
              e.preventDefault();
              changeNavbarState(NavbarState.GROUP_FILES_DATES);
            }}
            className={navbarState===NavbarState.GROUP_FILES_DATES?"text-gray-400 cursor-pointer" :"text-white hover:text-gray-400 cursor-pointer"}
          >
            Group Files (Dates)
          </li>
          <li
            onClick={(e) => {
              e.preventDefault();
              changeNavbarState(NavbarState.ADVANCED_SEARCH);
            }}
            className={navbarState===NavbarState.ADVANCED_SEARCH?"text-gray-400 cursor-pointer" :"text-white hover:text-gray-400 cursor-pointer"}
          >
            Advanced Search
          </li>
        </ul>
      </nav>
      <nav className="flex bg-gray-800 p-4 items-center justify-between md:hidden">
        <div className="text-white text-xl font-bold">FileManager</div>
        <img src={hamburger} className="w-7" onClick={()=>{
          setIsOpen(!isOpen);
        }} />
      </nav>
        <nav className="bg-gray-800 flex md:hidden transition-height duration-300 ease-in-out overflow-hidden" style={{"height":`${menuHeight}px`}} ref={menuRef}>
          <ul className="flex flex-col items-center w-full pb-2">
            <li
              onClick={(e) => {
                e.preventDefault();
                changeNavbarState(NavbarState.DELETE_FILES);
              }}
              className="text-white hover:text-gray-400 cursor-pointer my-1"
            >
              Delete Files
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                changeNavbarState(NavbarState.GROUP_FILES);
              }}
              className="text-white hover:text-gray-400 cursor-pointer my-1"
            >
              Group Files
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                changeNavbarState(NavbarState.GROUP_FILES_DATES);
              }}
              className="text-white hover:text-gray-400 cursor-pointer my-1"
            >
              Group Files (Dates)
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                changeNavbarState(NavbarState.ADVANCED_SEARCH);
              }}
              className="text-white hover:text-gray-400 cursor-pointer my-1"
            >
              Advanced Search
            </li>
          </ul>
        </nav>
    </>
  );
}

export default Navbar;

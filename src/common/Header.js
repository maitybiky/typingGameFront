import React from "react";
import { Link } from "react-router-dom";
import { FaBeer } from 'react-icons/fa';


import "./Header.css";
const Header = () => {
  return (
    <div className="container">
      <div className="menu-button">Menu</div>
      <ul className="flexnav" data-breakpoint={800}>
        {/* <li>
          <a href="#">Home</a>
        </li> */}
        <li>
          <Link to="/game">
           Game
          </Link>
        </li>
        {/* <li>
         <Link to="/">
           Chat
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Header;

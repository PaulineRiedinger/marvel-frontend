import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/img/Marvel-logo.jpg";
import "../style/Header.css";

const Header = () => {
  return (
    <header>
      <nav>
        <NavLink to="/" end>
          <img src={logo} alt="logo de Marvel" />
        </NavLink>
        <div className="nav-container">
          <NavLink to="/characters" className="nav-link">
            PERSONNAGES
          </NavLink>
          <NavLink to="/comics" className="nav-link">
            COMICS
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            FAVORIS
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;

// src/pages/customSuit/CustomSuit.js
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "./../../assets/img/icon/matcha.png";
import "./CustomSuit.scss";
import "./Header.scss";

const CustomSuit = () => {
  const location = useLocation();

  return (
    <div className="custom-suit">
      <header id="header">
        <div className="all">
          <div className="logo">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "95px", height: "auto" }}
              />{" "}
              {/* Adjust the width as needed */}
            </a>
          </div>
          <nav>
            <ul className="customMenu">
              <li>
                <Link
                  to="/custom-suits/fabric"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/fabric" ? "active" : ""}`}
                >
                  FABRIC
                </Link>
              </li>
              <li>
                <i className="fa fa-angle-right"></i>
              </li>
              <li>
                <Link
                  to="/custom-suits/style"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/style" ? "active" : ""}`}
                >
                  STYLE
                </Link>
              </li>
              <li>
                <i className="fa fa-angle-right"></i>
              </li>
              <li>
                <Link
                  to="/custom-suits/lining"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/lining" ? "active" : ""}`}
                >
                  LINING
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomSuit;

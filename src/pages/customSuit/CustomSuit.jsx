// src/pages/customSuit/CustomSuit.js
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo/logo_custom.jpg";
import "./CustomSuit.scss";
import "./Header.scss";
import { FaAngleRight } from "react-icons/fa";

const CustomSuit = () => {
  const location = useLocation();

  return (
    <div className="custom-suit">
      <header id="header">
        <div className="all">
          <div className="logo">
            <Link to='/' className="custom-logo-link" rel="home">
              <img
                width="306"
                height="81"
                src={logo}
                className="custom-logo"
                alt="Matcha Vest"
              />
            </Link>
          </div>
          <nav>
            <ul className="customMenu">
              <li>
                {/* <Link
                  to="/custom-suits/fabric"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/fabric" ? "active" : ""}`}
                > */}
                  FABRIC
                {/* </Link> */}
              </li>
              <li>
                <FaAngleRight />
              </li>
              <li>
                {/* <Link
                  to="/custom-suits/style"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/style" ? "active" : ""}`}
                > */}
                  STYLE
                {/* </Link> */}
              </li>
              <li>
                <FaAngleRight />
              </li>
              <li>
                {/* <Link
                  to="/custom-suits/lining"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/lining" ? "active" : ""}`}
                > */}
                  LINING
                {/* </Link> */}
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

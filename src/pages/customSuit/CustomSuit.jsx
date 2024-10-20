// src/pages/customSuit/CustomSuit.js
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import './CustomSuit.scss';
import './Header.scss';

const CustomSuit = () => {
  const location = useLocation();

  return (
    <div className="custom-suit">
      <header id="header">
        <div className="all">
          <div className="logo">
            <a href="#" className="custom-logo-link" rel="home">
              <img
                width="306"
                height="81"
                src="https://adongsilk.com/wp-content/uploads/2024/03/cropped-Logo_ADS-03_2024-final2_edit1-1-1.png"
                className="custom-logo"
                alt="A DONG SILK I Hoi An Tailor"
              />
            </a>
          </div>
          <nav>
            <ul className="customMenu">
              <li>
                <Link to="/custom-suits/fabric" className={`toggle-side-menu ${location.pathname === '/custom-suits/fabric' ? 'active' : ''}`}>
                  FABRIC
                </Link>
              </li>
              <li><i className="fa fa-angle-right"></i></li>
              <li>
                <Link to="/custom-suits/style" className={`toggle-side-menu ${location.pathname === '/custom-suits/style' ? 'active' : ''}`}>
                  STYLE
                </Link>
              </li>
              <li><i className="fa fa-angle-right"></i></li>
              <li>
                <Link to="/custom-suits/lining" className={`toggle-side-menu ${location.pathname === '/custom-suits/lining' ? 'active' : ''}`}>
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

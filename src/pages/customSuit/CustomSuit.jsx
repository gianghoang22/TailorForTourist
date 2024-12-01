// src/pages/customSuit/CustomSuit.js
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/img/logo/logo_custom.jpg";
import "./CustomSuit.scss";
import "./Header.scss";

const CustomSuit = () => {
  const location = useLocation();

  // Add animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
      },
    },
  };

  const headerVariants = {
    initial: { y: -100 },
    animate: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const menuVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="custom-suit"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.header id="header" variants={headerVariants}>
        <div className="all">
          <motion.div className="logo" variants={logoVariants}>
            <a href="#" className="custom-logo-link" rel="home">
              <motion.img
                width="306"
                height="81"
                src={logo}
                className="custom-logo"
                alt="Matcha Vest"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </a>
          </motion.div>
          <nav>
            <motion.ul className="customMenu" variants={menuVariants}>
              <motion.li variants={menuItemVariants}>
                <Link
                  to="/custom-suits/fabric"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/fabric" ? "active" : ""}`}
                >
                  FABRIC
                </Link>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <i className="fa fa-angle-right"></i>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <Link
                  to="/custom-suits/style"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/style" ? "active" : ""}`}
                >
                  STYLE
                </Link>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <i className="fa fa-angle-right"></i>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <Link
                  to="/custom-suits/lining"
                  className={`toggle-side-menu ${location.pathname === "/custom-suits/lining" ? "active" : ""}`}
                >
                  LINING
                </Link>
              </motion.li>
            </motion.ul>
          </nav>
        </div>
      </motion.header>

      <motion.div
        className="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CustomSuit;

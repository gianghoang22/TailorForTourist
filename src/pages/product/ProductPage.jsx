import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import "./ProductPage.scss";
import Sidebar from "../../layouts/components/sidebar/Sidebar";
import { Footer } from "../../layouts/components/footer/Footer";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ProductItem Component
const ProductItem = ({ product }) => (
  <motion.div
    className="col-md-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03 }}
  >
    <Link to={`/product-collection/${product.productID}`} className="card">
      <img src={product.imgURL} alt={product.productCode} />
      <h5 className="card-title">{product.productCode}</h5>
      <p className="card-text">Price from: {product.price} $</p>
    </Link>
  </motion.div>
);

ProductItem.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.number.isRequired,
    productCode: PropTypes.string.isRequired,
    measurementID: PropTypes.number,
    categoryID: PropTypes.number.isRequired,
    fabricID: PropTypes.number.isRequired,
    liningID: PropTypes.number.isRequired,
    orderID: PropTypes.number,
    imgURL: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

// Product Collection Component
const Product = ({ products }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h1>Product Collection</h1>
    <div className="row" style={{ paddingBottom: "50px" }}>
      {products.map((product, index) => (
        <ProductItem key={product.productID} product={product} />
      ))}
    </div>
  </motion.div>
);

Product.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productID: PropTypes.number.isRequired,
      productCode: PropTypes.string.isRequired,
      measurementID: PropTypes.number,
      categoryID: PropTypes.number.isRequired,
      fabricID: PropTypes.number.isRequired,
      liningID: PropTypes.number.isRequired,
      orderID: PropTypes.number,
      imgURL: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // 3 products per row * 4 rows

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://vesttour.xyz/api/Product/products/custom-false");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Fetch products by category ID
  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://vesttour.xyz/api/Product/category-iscustomfalse/${categoryId}`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
      },
    },
  };

  const bannerVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const bannerSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear"
  };

  const bannerSlides = [
    {
      image: "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Men's Suit",
      description: "Beautiful men's suits, updated with the latest trend styles."
    },
    {
      image: "https://images.unsplash.com/photo-1634729108541-516d16ddceec?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Thay thế bằng URL thật
      title: "Wedding Collection",
      description: "Discover our new Wedding collection with premium quality"
    },
    {
      image: "https://images.unsplash.com/photo-1475721042966-f829c9b42aab?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Thay thế bằng URL thật
      title: "Wedding Collection",
      description: "Discover our new Wedding collection with premium quality"
    },
    {
      image: "https://images.pexels.com/photos/4427813/pexels-photo-4427813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Thay thế bằng URL thật
      title: "Luxury Fashion Coats",
      description: "Luxurious wool blends and premium fabrics, tailored to perfection for the modern gentleman."
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navigation />

      {/* Thay thế phần Banner cũ bằng Slick Slider */}
      <motion.div className="banner-container" variants={bannerVariants}>
        <Slider {...bannerSliderSettings}>
          {bannerSlides.map((slide, index) => (
            <div key={index} className="banner-slide">
              <motion.img
                src={slide.image}
                className="banner-image"
                alt={slide.title}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
              />
              <motion.div
                className="banner-category"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="banner-title">{slide.title}</h1>
                <div className="banner-description">{slide.description}</div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </motion.div>

      {/* Animated Main Content Section */}
      <motion.div
        className="all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="page-width-sidebar clear">
          <motion.div
            className="side-left"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
          <Sidebar onSelectSubcategory={fetchProductsByCategory} />
          </motion.div>

          <motion.div
            className="side-right"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {loading && <p>Loading products...</p>}
            <strong>{error && <p>No products found!</p>}</strong>
            {!loading && !error && products.length > 0 && (
              <Product products={currentProducts} currentPage={currentPage} productsPerPage={productsPerPage} />
            )}
            {!loading && !error && products.length === 0 && (
              <p>No products found for the selected criteria.</p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      {!error && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
            Next
          </button>
        </div>
      )}

      <Footer />
    </motion.div>
  );
};

export default ProductPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import "./ProductPage.scss";
import Sidebar from "../../layouts/components/sidebar/Sidebar";
import { Footer } from "../../layouts/components/footer/Footer";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { motion } from "framer-motion";

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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7194/api/Product/products/custom-false"
      );
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch products by category ID
  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7194/api/Product/category/${categoryId}`
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navigation />

      {/* Animated Banner Section */}
      <motion.div className="banner-container" variants={bannerVariants}>
        <motion.img
          src="https://owen.vn/media/catalog/category/veston_2.jpg"
          className="banner-image"
          alt="Men's Suit"
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
          <h1 className="banner-title">Men's Suit</h1>
          <div className="banner-description">
            Beautiful men's suits, updated with the latest trend styles, made
            from OWEN's premium materials, giving gentlemen a sophisticated look
          </div>
        </motion.div>
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
            {error && <p>Error loading products: {error}</p>}
            {!loading && !error && products.length > 0 && (
              <Product products={products} />
            )}
            {!loading && !error && products.length === 0 && (
              <p>No products found for the selected criteria.</p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </motion.div>
  );
};

export default ProductPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './ProductPage.scss';
import Sidebar from '../../layouts/components/sidebar/Sidebar';
import { Footer } from '../../layouts/components/footer/Footer';
import { Navigation } from '../../layouts/components/navigation/Navigation';

// ProductItem Component
const ProductItem = ({ product }) => (
  <div className="col-md-4">
    <Link to={`/product-collection/${product.productID}`} className="card">
      <img src={product.imgURL} alt={product.productCode} />
      <h5 className="card-title">{product.productCode}</h5>
      <p className="card-text">Price from: {product.price} $</p>
    </Link>
  </div>
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
  <div>
    <h1>Product Collection</h1>
    <div className="row" style={{ paddingBottom: '50px' }}>
      {products.map((product) => (
        <ProductItem key={product.productID} product={product} />
      ))}
    </div>
  </div>
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
      const response = await axios.get('https://localhost:7194/api/Product/products/custom-false');
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
      const response = await axios.get(`https://localhost:7194/api/Product/category/${categoryId}`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      {/* Banner Section */}
      <div className="banner-container">
        <img src="https://owen.vn/media/catalog/category/veston_2.jpg" className="banner-image" alt="Áo Vest Nam" />
        <div className="banner-category">
          <h1 className="banner-title">Áo Vest Nam</h1>
          <div className="banner-description">
            Áo vest nam đẹp, cập nhật phong cách theo xu hướng mới nhất, được sản xuất từ những chất liệu cao cấp của OWEN mang đến cho các quý ông một phong cách lịch lãm
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="all">
        <div className="page-width-sidebar clear">
          {/* Sidebar on the left */}
          <div className="side-left">
            <Sidebar 
              onSelectSubcategory={fetchProductsByCategory} // Pass fetchProductsByCategory to Sidebar
            />
          </div>

          {/* Product Grid on the right */}
          <div className="side-right">
            {loading && <p>Loading products...</p>}
            {error && <p>Error loading products: {error}</p>}
            {!loading && !error && products.length > 0 && (
              <Product products={products} />
            )}
            {!loading && !error && products.length === 0 && (
              <p>No products found for the selected criteria.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;

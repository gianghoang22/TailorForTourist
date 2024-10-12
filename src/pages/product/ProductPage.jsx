import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import PropTypes from 'prop-types';
import { Sidebar } from '../../layouts/components/sidebar/Sidebar';
import axios from 'axios';
import './ProductPage.scss';

const ProductItem = ({ product }) => {
  return (
    <div className="col-md-4">
      <Link to={`/product/${product.productID}`} className="card"> {/* Sử dụng productID từ product */}
        <div className="card-body">
          <h5 className="card-title">Product Code: {product.productCode}</h5>
          <p className="card-text">Measurement ID: {product.measurementID}</p>
          <p className="card-text">Category ID: {product.categoryID}</p>
          <p className="card-text">Fabric ID: {product.fabricID}</p>
          <p className="card-text">Lining ID: {product.liningID}</p>
          <p className="card-text">Order ID: {product.orderID}</p>
        </div>
      </Link>
    </div>
  );
};


// Cập nhật PropTypes validation
ProductItem.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.number.isRequired,
    productCode: PropTypes.string.isRequired,
    measurementID: PropTypes.number.isRequired,
    categoryID: PropTypes.number.isRequired,
    fabricID: PropTypes.number.isRequired,
    liningID: PropTypes.number.isRequired,
    orderID: PropTypes.number.isRequired,
  }).isRequired,
};
// Product Collection Component
const Product = ({ products }) => {
  return (
    <div>
      <h1>Product Collection</h1>
      <div className="row">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// PropTypes validation for Product
Product.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const ProductPage = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm để gọi API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7244/api/product'); 
        setProducts(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  if (loading) return <p className="loading-message">Loading...</p>; 
  if (error) return <p className="error-message">Error: {error}</p>; 

  return (
    <>
      <div className="header-promotion">
        {/* Header promotion content */}
        <div className="header-promotion">
        <div className="header-promotion__slide slick-initialized slick-slider slick-vertical">
          <div className="slick-list draggable">
            <div className="slick-track">
              <div className="slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false">
                <div>
                  <div className="header-promotion__slide-item">
                    <p>
                      VEST COLLECTION
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="banner-container">
        {/* Banner Section content */}
        <div className="banner-container">
        <img src="https://owen.vn/media/catalog/category/veston_2.jpg" className="banner-image" alt="Áo Vest Nam" />
        <div className="banner-category">
          <h1 className="banner-title">
            Áo Vest Nam
          </h1>
          <div className="banner-description">
            Áo vest nam đẹp, cập nhật phong cách theo xu hướng mới nhất, được sản xuất từ những chất liệu cao cấp của OWEN mang đến cho các quý ông một phong cách lịch lãm
          </div>
        </div>
      </div>
      </div>

      <div className="columns">
        <Sidebar />
        <div className="row-9 main">
          <Product products={products} /> 
        </div>
      </div>
    </>
  )
}

export default ProductPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.scss'; // Import SCSS for styling

const ProductDetailPage = () => {
  const { id } = useParams(); // Get id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://localhost:7244/api/Product/details/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className="product-detail">
      <h1>{product.productCode}</h1>
      <img src={product.imageUrl} alt={product.productCode} className="product-image" /> {/* Assume your API returns image URL */}
      <p>Measurement ID: {product.measurementID}</p>
      <p>Category ID: {product.categoryID}</p>
      <p>Fabric ID: {product.fabricID}</p>
      <p>Lining ID: {product.liningID}</p>
      <p>Order ID: {product.orderID}</p>
      <button className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default ProductDetailPage;

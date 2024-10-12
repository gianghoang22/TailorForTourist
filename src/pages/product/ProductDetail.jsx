import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy productID từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7244/api/product/${id}`); // Gọi API để lấy thông tin sản phẩm
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]); // Chạy lại khi id thay đổi

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Product Detail</h1>
      {product && (
        <div>
          <h2>{product.productCode}</h2>
          <p>Measurement ID: {product.measurementID}</p>
          <p>Category ID: {product.categoryID}</p>
          <p>Fabric ID: {product.fabricID}</p>
          <p>Lining ID: {product.liningID}</p>
          <p>Order ID: {product.orderID}</p>
          {/* Hiển thị thêm thông tin chi tiết nếu cần */}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

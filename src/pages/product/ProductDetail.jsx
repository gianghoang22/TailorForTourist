import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.scss';

// Mock Product Data (Thay thế bằng dữ liệu thực tế từ API của bạn)
const products = [
  {
    id: 1,
    name: "Veston",
    price: 200,
    image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    description: "Stylish and elegant vest suitable for formal occasions.",
  },
  {
    id: 2,
    name: "Polo Shirt",
    price: 150,
    image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    description: "Comfortable polo shirt for casual wear.",
  },
  {
    id: 3,
    name: "Shirts",
    price: 100,
    image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    description: "Classic shirts made from high-quality fabric.",
  },
  // Thêm sản phẩm khác nếu cần
];

const ProductDetail = () => {
  const { productId } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();

  // Tìm sản phẩm dựa trên ID
  const product = products.find(item => item.id === parseInt(productId));

  if (!product) {
    return <div>Product not found</div>; // Hiển thị thông báo nếu không tìm thấy sản phẩm
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate('/products')} className="back-button">Back to Products</button>
      <div className="product-detail__content">
        <img src={product.image} alt={product.name} className="product-detail__image" />
        <h1 className="product-detail__title">{product.name}</h1>
        <p className="product-detail__price">${product.price}</p>
        <p className="product-detail__description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;

// ProductInfoModal.jsx
import React from 'react';
import './ProductInfoModal.scss';

const ProductInfoModal = ({ product, onClose }) => {
  if (!product) return null; // Render nothing if no product is selected

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{product.name}</h2>
        <p><strong>Fabric:</strong> {product.fabric?.optionValue || "Not available"}</p>
        <p><strong>Style:</strong> {product.style?.optionValue || "Not available"}</p>
        <p><strong>Lining:</strong> {product.lining?.optionValue || "Not available"}</p>
        <p><strong>Price:</strong> {product.price} USD</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductInfoModal;

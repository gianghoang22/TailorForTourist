import React from 'react';
import PropTypes from 'prop-types';
import './ProductInfoModal.scss';

const ProductInfoModal = ({ product, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">Close</button>
        <h2>{product.description}</h2> {/* Displaying "SUIT + FabricName" */}
        
        <div className="product-details">
          <div className="fabric-details">
            <h3>Fabric Details</h3>
            <img src={product.fabric?.imageUrl} alt={product.fabric?.name} />
            <p><strong>Name:</strong> {product.fabric?.name || 'N/A'}</p>
            <p><strong>Price:</strong> ${product.fabric?.price.toFixed(2) || 'N/A'}</p>
            <p><strong>Description:</strong> {product.fabric?.description || 'N/A'}</p>
          </div>

          <div className="style-details">
            <h3>Style Details</h3>
            <p><strong>Name:</strong> {product.style?.name || 'N/A'}</p>
            <p><strong>Option Value:</strong> {product.style?.optionValue || 'N/A'}</p>
          </div>

          <div className="lining-details">
            <h3>Lining Details</h3>
            <img src={product.lining?.imageUrl} alt={product.lining?.name} />
            <p><strong>Name:</strong> {product.lining?.name || 'N/A'}</p>
          </div>

          <p><strong>Quantity:</strong> {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
ProductInfoModal.propTypes = {
  product: PropTypes.shape({
    description: PropTypes.string.isRequired,
    fabric: PropTypes.shape({
      name: PropTypes.string,
      price: PropTypes.number,
      description: PropTypes.string,
      imageUrl: PropTypes.string,
    }),
    style: PropTypes.shape({
      name: PropTypes.string,
      optionValue: PropTypes.string,
    }),
    lining: PropTypes.shape({
      name: PropTypes.string,
      imageUrl: PropTypes.string,
    }),
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductInfoModal;
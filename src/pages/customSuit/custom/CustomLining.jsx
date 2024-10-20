import React, { useEffect, useState } from 'react';
import './CustomLining.scss';

const CustomLining = ({ addToCart }) => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);

  useEffect(() => {
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLinings();
  }, []);

  const handleLiningChange = (event) => {
    const liningId = parseInt(event.target.value);
    const lining = linings.find(l => l.liningId === liningId);
    setSelectedLining(lining);
  };

  const handleAddToCart = () => {
    if (selectedLining) {
      // Call the parent function to add to cart
      addToCart({
        id: selectedLining.liningId,
        name: selectedLining.liningName,
        imageUrl: selectedLining.imageUrl,
        type: 'lining'
      });
      alert(`Added ${selectedLining.liningName} to cart!`);
    } else {
      alert('Please select a lining first.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className='custom-lining-container'>
      <h2>Lining Selection</h2>
      <div className='lining-selection'>
        <select onChange={handleLiningChange} defaultValue="">
          <option value="" disabled>Select a lining</option>
          {linings.map((lining) => (
            <option key={lining.liningId} value={lining.liningId}>
              {lining.liningName}
            </option>
          ))}
        </select>
      </div>

      {selectedLining && (
        <div className="lining-details">
          <h3>Details for {selectedLining.liningName}</h3>
          <div>
            <strong>ID:</strong> {selectedLining.liningId}
          </div>
          <div>
            <strong>Name:</strong> {selectedLining.liningName}
          </div>
          <div className="lining-img">
            <img src={selectedLining.imageUrl} alt={selectedLining.liningName} />
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="cart-button">
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      {/* Nút Next */}
      <div className="navigation-button">
        <button onClick={() => { /* Gắn link vào đây */ }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomLining;

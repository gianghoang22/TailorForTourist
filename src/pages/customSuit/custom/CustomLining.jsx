import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtil';  // Import the utility function directly
import './CustomLining.scss';
import lining_icon from '../../../assets/img/iconCustom/icon-accent-vailot.jpg';

const CustomLining = () => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);

  // Fetch lining data on component mount
  useEffect(() => {
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7194/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinings(data);  // Set the linings data
      } catch (error) {
        setError(error.message);  // Set error state
      } finally {
        setLoading(false);  // Loading completed
      }
    };
    fetchLinings();
  }, []);

  // Handle lining selection
  const handleLiningClick = (lining) => {
    setSelectedLining(lining);  // Set the clicked lining as selected
  };

  // Handle adding the selected lining to the cart
  const handleAddToCart = () => {
    if (selectedLining) {
      // Add the selected lining to the cart
      addToCart({
        id: selectedLining.liningId,
        name: selectedLining.liningName,
        imageUrl: selectedLining.imageUrl,
        type: 'lining',
      });
      alert(`${selectedLining.liningName} has been added to the cart!`);
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
      <div className='left-half'>
        <div className='tag-buttons'>
          <li className='active'>
            <a>
              <img src={lining_icon} alt="Internal lining icon" className='tag-icon' />
              Internal Lining
            </a>
          </li>
        </div>

        {/* List of linings */}
        <div className='right-items-lining'>
          <ul className="list-lining">
            {linings.map((lining) => (
              <li
                key={lining.liningId}
                className={`lining-item ${selectedLining && selectedLining.liningId === lining.liningId ? 'selected' : ''}`}
                onClick={() => handleLiningClick(lining)}
              >
                <div className="lining-img">
                  {lining.imageUrl ? <img src={lining.imageUrl} alt={lining.liningName} /> : 'No image available'}
                </div>
                <div className="lining-name">{lining.liningName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Selected lining details */}
      <div className='right-half'>
        {selectedLining && (
          <div className='lining-details'>
            <div className="product-info" id='pd_info'>
              <h1 className="pd-name">CUSTOM <span>SUIT</span></h1>
              <p className='composition set'>{selectedLining.description}</p>
              <p className='price'>{selectedLining.liningName}</p>
              <div className="lining-img">
                {selectedLining.imageUrl ? <img src={selectedLining.imageUrl} alt={selectedLining.liningName} /> : 'No image available'}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}

        {/* Next button */}
        <div className='next-btn'>
          <Link to="/cart">
            <button className='navigation-button'>Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomLining;

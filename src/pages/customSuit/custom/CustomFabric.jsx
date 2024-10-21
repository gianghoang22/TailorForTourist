import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtil';
import './customFabric.scss';

import all_icon from '../../../assets/img/filter/icon-fabricFilter-all.jpg';
import new_icon from '../../../assets/img/filter/icon-fabricFilter-new.jpg';
import premium_icon from '../../../assets/img/filter/icon-fabricFilter-premium.jpg';
import sale_icon from '../../../assets/img/filter/icon-fabricFilter-sale.png';
import search_icon from '../../../assets/img/icon/search.png';

const CustomFabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const tagImage = {
    'All': all_icon,
    'New': new_icon,
    'Premium': premium_icon,
    'Sale': sale_icon,
  };

  const fetchFabrics = async (tag = '') => {
    try {
      const response = await fetch(`https://localhost:7194/api/Fabrics${tag ? `/tag/${tag}` : ''}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFabrics(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setLoading(true);
    fetchFabrics(tag === 'All' ? '' : tag);
  };

  const handleFabricClick = (fabric) => {
    setSelectedFabric(fabric);
  };

  const handleAddToCart = () => {
    if (selectedFabric) {
      addToCart({
        id: selectedFabric.fabricId,
        name: selectedFabric.fabricName,
        price: selectedFabric.price,
        imageUrl: selectedFabric.imageUrl,
        type: 'fabric',
      });
      alert(`${selectedFabric.fabricName} has been added to the cart!`);
    } else {
      alert('Please select a fabric first.');
    }
  };

  // Filter fabrics by search term
  const filteredFabrics = fabrics.filter((fabric) =>
    fabric.fabricName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='custom-fabric-container'>
      <div className='left-half'>
        <div className='tag-buttons'>
          {['All', 'New', 'Premium', 'Sale'].map(tag => (
            <li key={tag} className={selectedTag === tag ? 'active' : ''} onClick={() => handleTagClick(tag)}>
              <a>
              <img src={tagImage[tag]} alt={`${tag} icon`} className='tag-icon' />
              {tag}
                </a>
            </li>
          ))}
        </div>

          {/* right item */}
        <div className='right-items-fabric'>

          {/* Search Box */}
        <div className="search-box">
          <input id='live-search'
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className='icon'>
            <img src={search_icon} alt={search_icon} />
          </span>
        </div>
          
          <ul className="list-fabric">
          {filteredFabrics.length > 0 ? (
            filteredFabrics.map((fabric) => (
              <li key={fabric.fabricId} onClick={() => handleFabricClick(fabric)}>
                <div className="fabric-img">
                  {fabric.imageUrl ? <img src={fabric.imageUrl} alt={fabric.fabricName} /> : 'No image available'}
                </div>
                <div className="fabric-price">
                  {fabric.price} USD
                </div>
                <div className="fabric-name">
                  {fabric.fabricName}
                </div>
              </li>
            ))
          ) : (
            <li>No fabrics match your search.</li>
          )}
          </ul>
          
          
      
        </div>
      </div>

        {/* item detail */}

      <div className='right-half'>
        {selectedFabric && (
          <div className='fabric-details'>
            <div className="product-info" id='pd_info'>
            <h1 className="pd-name">
              CUSTOM 
              <span>SUIT</span>
            </h1>
            <p className='composition set'>{selectedFabric.description}</p>
            <p className='price'>{selectedFabric.price} USD</p>
            <div className="fabric-img">
              {selectedFabric.imageUrl ? <img src={selectedFabric.imageUrl} alt={selectedFabric.fabricName} /> : 'No image available'}
            </div>
            </div>
            {/* add to cart */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}

<div className='next-btn'>
        <Link to="/custom-suits/style">
          <button className='navigation-button'>Go to Style</button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default CustomFabric;
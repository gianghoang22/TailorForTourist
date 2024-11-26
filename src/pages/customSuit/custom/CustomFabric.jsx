import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFabric, setSelectedFabric] = useState(null);
  const navigate = useNavigate();

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
    
    // Lưu fabricId vào localStorage
    localStorage.setItem('selectedFabricID', fabric.fabricID);
  
    addToCart({
      id: fabric.fabricID,
      name: fabric.fabricName,
      price: fabric.price,
      imageUrl: fabric.imageUrl,
      type: 'fabric',
    });
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

        <div className='right-items-fabric'>
          <div className="search-box">
            <input id='live-search'
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className='icon'>
              <img src={search_icon} alt="Search" />
            </span>
          </div>
          
          <ul className="list-fabric">
          {filteredFabrics.length > 0 ? (
            filteredFabrics.map((fabric) => (
              <li key={fabric.fabricID} onClick={() => handleFabricClick(fabric)}>
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

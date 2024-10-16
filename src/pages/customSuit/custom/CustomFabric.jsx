import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './customFabric.scss';

const CustomFabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState(null);

  const fetchFabrics = async (tag = '') => {
    try {
      const response = await fetch(`https://localhost:7244/api/Fabrics${tag ? `/tag/${tag}` : ''}`);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='custom-fabric-container'>
      <div className='left-half'>
        <div className='tag-buttons'>
          {['All', 'New', 'Premium', 'Sale'].map(tag => (
            <button key={tag} className={selectedTag === tag ? 'active' : ''} onClick={() => handleTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
        <ul>
          {fabrics.map((fabric) => (
            <li key={fabric.fabricId} onClick={() => handleFabricClick(fabric)}>
              <div className="fabric-id">
                <span>Fabric ID:</span>
                {fabric.fabricId}
              </div>
              <div className="fabric-name">
                <span>Fabric Name:</span>
                {fabric.fabricName}
              </div>
              <div className="fabric-price">
                <span>Fabric Price:</span>
                {fabric.price}
              </div>
              <div className="fabric-description">
                <span>Fabric Description:</span>
                {fabric.description}
              </div>
              <div className="fabric-img">
                <span>Fabric Image:</span>
                {fabric.imageUrl ? <img src={fabric.imageUrl} alt={fabric.fabricName} /> : 'No image available'}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='right-half'>
        {selectedFabric && (
          <div className='fabric-details'>
            <h3>Details for Fabric ID: {selectedFabric.fabricId}</h3>
            <div><strong>ID:</strong> {selectedFabric.fabricId}</div>
            <div><strong>Name:</strong> {selectedFabric.fabricName}</div>
            <div><strong>Price:</strong> {selectedFabric.price}</div>
            <div><strong>Description:</strong> {selectedFabric.description}</div>
            <div className="fabric-img">
              {selectedFabric.imageUrl ? <img src={selectedFabric.imageUrl} alt={selectedFabric.fabricName} /> : 'No image available'}
            </div>
          </div>
        )}
      </div>
      <div className='navigation-button'>
        <Link to="/custom-suits/style">
          <button>Go to Style</button>
        </Link>
      </div>
    </div>
  );
}

export default CustomFabric;
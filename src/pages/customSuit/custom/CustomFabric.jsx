import React, { useEffect, useState } from 'react';
import './customFabric.scss';

const CustomFabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='sec-product'>
      <div className='tag-buttons'>
        {['All', 'New', 'Premium', 'Sale'].map(tag => (
          <button key={tag} className={selectedTag === tag ? 'active' : ''} onClick={() => handleTagClick(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <ul>
        {fabrics.map((fabric) => (
          <li key={fabric.fabricId}>
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
  );
};

export default CustomFabric;

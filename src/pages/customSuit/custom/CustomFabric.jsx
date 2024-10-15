import React, { useEffect, useState } from 'react';
import './customFabric.scss';

const CustomFabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/Fabrics');
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

    fetchFabrics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='sec-product'>
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

              {/* Add currency symbol or formatting */}
              {fabric.price}
            </div>

            <div className="fabric-description">
              <span>Fabric Description:</span>
              {fabric.description}
            </div>

            <div className="fabic-img">
              <span>Fabric Image:</span>
              <img src={fabric.imageUrl} alt={fabric.fabricName} />
            </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomFabric;

import React, { useEffect, useState } from 'react';
import './CustomLining.scss';

const CustomLining = () => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setLinings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='sec-product'>
      <ul>
        {linings.map((lining) => (
          <li key={lining.id}>
            <div className='lining-id'>
            {lining.liningId}
            </div>

            <div className="lining-name">
            {lining.liningName}
            </div>

            <div className="lining-img">
            <img src={lining.imageUrl} alt={lining.liningName} />

            </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomLining;

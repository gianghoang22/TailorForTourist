import React, { useEffect, useState } from 'react';

const CustomFabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/Fabrics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${respone.status}`);
        }
        const data = await response.json();
        setFabrics(data); // Assuming the response is an array of fabrics
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFabrics();
  }, []); // Empty dependency array to run only on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul>
        {fabrics.map((fabric) => (
          <li key={fabric.fabricId}>
            {fabric.fabricName}
            {fabric.price}
            {fabric.description}
            {fabric.imageUrl}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomFabric;

import React, { useEffect, useState } from 'react';

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
    <div>
      <ul>
        {linings.map((lining, index) => (
          <li key={lining.id || index}>{lining.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomLining;

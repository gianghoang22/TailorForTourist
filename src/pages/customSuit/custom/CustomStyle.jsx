import React, { useEffect, useState } from 'react';

const CustomStyle = () => {
  const [styles, setStyle] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/Style');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStyle(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
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
        {styles.map((style, index) => (
          <li key={style.id || index}>{style.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomStyle;

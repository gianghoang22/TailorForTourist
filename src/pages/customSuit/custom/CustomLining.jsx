import React, { useEffect, useState } from 'react';
import './CustomLining.scss';

const CustomLining = () => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null); // State to track selected lining

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

  const handleLiningChange = (event) => {
    const liningId = parseInt(event.target.value); // Ensure liningId is an integer
    const lining = linings.find(l => l.liningId === liningId);
    setSelectedLining(lining); // Set selected lining based on dropdown selection
  };

  const handleLiningClick = (lining) => {
    setSelectedLining(lining); // Set selected lining based on list item click
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='sec-product'>
      <h2>Lining</h2>

      {/* Dropdown to select lining */}
      <select onChange={handleLiningChange} defaultValue="">
        <option value="" disabled>Select a lining</option>
        {linings.map((lining) => (
          <option key={lining.liningId} value={lining.liningId}>
            {lining.liningName}
          </option>
        ))}
      </select>

      {/* List of linings */}
      {/* <ul>
        {linings.map((lining) => (
          <li key={lining.liningId} onClick={() => handleLiningClick(lining)}>
            {lining.liningName}
          </li>
        ))}
      </ul> */}

      {selectedLining && ( // Conditionally render the selected lining details
        <div className="lining-details">
          <h3>Details for {selectedLining.liningName}</h3>
          <div>
            <strong>ID:</strong> {selectedLining.liningId}
          </div>
          <div>
            <strong>Name:</strong> {selectedLining.liningName}
          </div>
          <div className="lining-img">
            <img src={selectedLining.imageUrl} alt={selectedLining.liningName} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLining;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer';
import './FabricDetail.scss';

const FabricDetailPage = () => {
  const { id } = useParams(); // Get id from URL
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabric = async () => {
      try {
        const response = await axios.get(`https://localhost:7244/api/Fabric/details/${id}`);
        setFabric(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFabric();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!fabric) return <p>No fabric found.</p>;

  return (
    <>
      <Navigation />
      <main id='main-wrap'>
        <div className="fabric-detail-page">
          <h1 className='fabric-name'>{fabric.name}</h1>
          <div className="fabric-info">
            <img src={fabric.imageUrl} alt={fabric.name} />
            <p className="fabric-description">{fabric.description}</p>
            <p className="fabric-price">Price: {fabric.price} USD</p>
            <p className="fabric-composition">Composition: {fabric.composition}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FabricDetailPage;

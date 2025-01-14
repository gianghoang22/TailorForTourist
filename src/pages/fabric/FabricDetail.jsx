import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FabricDetail.scss";

const FabricDetail = () => {
  const { id } = useParams();
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFabric = async () => {
      try {
        const response = await fetch(
          `https://localhost:7194/api/Fabrics/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFabric(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFabric();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fabric) return <div>Fabric not found</div>;

  return (
    <div className="fabric-detail">
      <h1>{fabric.fabricName}</h1>
      <img src={fabric.imageUrl} alt={fabric.fabricName} />
      <p className="price">{fabric.price}</p>
      <p className="description">{fabric.description}</p>
      <button className="back-btn" onClick={handleBackClick}>
        Go Back
      </button>
    </div>
  );
};

export default FabricDetail;

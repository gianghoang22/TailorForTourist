import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Fabric.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";

const Fabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("new");

  useEffect(() => {
    fetchFabric(selectedTag);
  }, [selectedTag]);

  const fetchFabric = async (tag) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Fabrics/tag/${tag}`
      );
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

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setLoading(true);
  };

  const tags = [
    { label: "New", value: "new" },
    { label: "Premium", value: "premium" },
    { label: "Sale", value: "sale" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fabric-collection">
      <header className="header-image animate-header">
        <h1>Luxury Linen Fabrics</h1>
        <p>For Fashion Designers, Modern Dressmakers, and Sewing Enthusiasts</p>
      </header>
      <div className="headline-container">
        <h2 className="headline">Welcome to Our Fabric Collection</h2>
        <p className="subheadline">
          Discover the finest fabrics for your next sewing project
        </p>
      </div>
      <div className="tags">
        {tags.map((tag) => (
          <button key={tag.value} onClick={() => handleTagChange(tag.value)}>
            {tag.label}
          </button>
        ))}
      </div>
      <Section
        title={tags.find((t) => t.value === selectedTag).label}
        fabrics={fabrics}
        isHoverDisabled={true}
      />
      <FeaturedSection
        title="SANDWASHED PURE LINEN"
        subtitle="At Fabric Collection, linen is in our DNA."
        description="Our range of beautiful sandwashed linens are pre-washed to create softness with a relaxed, unique texture finish. This eco-friendly and versatile fabric is perfect for creating bespoke garments, whether dresses, pants, shorts, skirts, jumpsuits, tops, jackets or even some lightweight home decor. Sandwashed linen becomes softer after each wash, so there's no need to iron!"
        imageSrc="https://fabriccollection.com.au/cdn/shop/files/linen-bubblegum-fabric-ella-collection_1800x1800.jpg?v=1690353098"
        buttonText="SHOP NOW"
      />
      <FeaturedSection
        title="PURE PRINTED LINEN"
        subtitle="At Fabric Collection, we love linen!"
        description="Our wide-ranging yet carefully curated, high-quality Linen Collection is hand-picked every season, offering the style-savvy sewist an intriguing palette of colours in every shade you could imagine. Whatever your sewing project, we have an enormous array of linen prints and coordinating plains to match – all available at our beautiful Summer store in Brisbane and online fabric store – ready for quick delivery Australia-wide."
        imageSrc="https://fabriccollection.com.au/cdn/shop/files/printed-linen-fabric-caruso-1_540x.jpg?v=1682633455"
        buttonText="SHOP NOW"
        imageOnRight={true}
      />
    </div>
  );
};

const Section = ({ title, fabrics, isHoverDisabled }) => {
  return (
    <div className={`section animate-section`}>
      <h2>{title}</h2>
      <div className="fabric-grid">
        {fabrics.map((fabric, index) => (
          <FabricItem
            key={index}
            fabric={fabric}
            isHoverDisabled={isHoverDisabled}
          />
        ))}
      </div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  fabrics: PropTypes.arrayOf(
    PropTypes.shape({
      fabricName: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
    })
  ).isRequired,
  isHoverDisabled: PropTypes.bool.isRequired,
};

const FabricItem = ({ fabric, isHoverDisabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClick = () => {
    navigate(`/fabrics/${fabric.fabricId}`); // Navigate to FabricDetailPage with the fabric ID
  };

  return (
    <div
      className="fabric-item"
      onMouseEnter={() => !isHoverDisabled && setIsHovered(true)}
      onMouseLeave={() => !isHoverDisabled && setIsHovered(false)}
      onClick={handleClick} // Add click handler
    >
      <img
        src={isHovered && fabric.imageUrl ? fabric.imageUrl : fabric.imageUrl}
        alt={fabric.fabricName}
      />
      <p>{fabric.fabricName}</p>
      <p className="price">{fabric.price}</p>
    </div>
  );
};

FabricItem.propTypes = {
  fabric: PropTypes.shape({
    fabricName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    fabricId: PropTypes.string.isRequired, // Ensure fabric has an 'id' property
  }).isRequired,
  isHoverDisabled: PropTypes.bool.isRequired,
};

const FeaturedSection = ({
  title,
  subtitle,
  description,
  imageSrc,
  buttonText,
  imageOnRight,
}) => {
  return (
    <div
      className={`featured-section ${imageOnRight ? "image-right" : "image-left"}`}
    >
      <div className="content">
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <p>{description}</p>
        <button>{buttonText}</button>
      </div>
      <div className="image">
        <img src={imageSrc} alt={title} />
      </div>
    </div>
  );
};

FeaturedSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  imageSrc: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  imageOnRight: PropTypes.bool,
};

export default Fabric;

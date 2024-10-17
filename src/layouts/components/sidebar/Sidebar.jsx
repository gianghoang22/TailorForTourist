import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sidebar/Sidebar.scss';

const Sidebar = ({ onSelectSubcategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7244/api/category');
        const categoriesData = response.data;
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getSubcategories = (parentId) => {
    return categories.filter(category => category.categoryParentId === parentId);
  };

  const handleSubcategoryClick = async (subcategoryId) => {
    try {
      const response = await axios.get(`https://localhost:7244/api/category/${subcategoryId}`);
      setSelectedCategoryData(response.data);
      setSelectedCategoryId(subcategoryId);
      onSelectSubcategory(subcategoryId);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const parentCategories = categories.filter(category => category.categoryParentId === null);

  return (
    <div id="nav_menu5" className='widget widget_nav_menu'>
      <div className="menu-widget-container">
        {selectedCategoryData && (
          <div className="selected-category-data">
            <h2>{selectedCategoryData.name}</h2>
            <p>{selectedCategoryData.description}</p>
          </div>
        )}
        <ul id="meu-widget" className="menu">
          {parentCategories.map(category => (
            <li id='menu-item' key={category.categoryId} className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children dropdown">
              <a >{category.name}</a>
              <ul id='menu-widget' className="menu">
                {getSubcategories(category.categoryId).map(subcategory => (
                  <li key={subcategory.categoryId} className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a onClick={() => handleSubcategoryClick(subcategory.categoryId)}>
                      {subcategory.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sidebar/Sidebar.scss';

const Sidebar = ({ onSelectSubcategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from the API
        const response = await axios.get('https://localhost:7194/api/category');
        
        // Debugging: Log the full response
        console.log('API Response:', response);
        
        // Check if response and response.data are valid
        if (response && response.data && Array.isArray(response.data)) {
          setCategories(response.data);  // Set categories if valid
        } else {
          throw new Error('Invalid response format');  // Handle unexpected response format
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);  // Log the error message
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getSubcategories = (parentId) => {
    return Array.isArray(categories) ? categories.filter(category => category.categoryParentId === parentId) : [];
  };

  const handleSubcategoryClick = (subcategoryId) => {
    onSelectSubcategory(subcategoryId); // Notify parent component (ProductPage)
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
        <ul id="meu-widget" className="menu">
          {parentCategories.map(category => (
            <li id='menu-item' key={category.categoryId} className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children dropdown">
              <a>{category.name}</a>
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

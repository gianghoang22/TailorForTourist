import React, { useEffect, useState } from "react";
import axios from "axios";
import "../sidebar/Sidebar.scss";

const Sidebar = ({ onSelectSubcategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null); // Track active subcategory

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://vesttour.xyz/api/category");
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          throw new Error("API returned unexpected format: expected an array");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to fetch categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getSubcategories = (parentId) => {
    return Array.isArray(categories)
      ? categories.filter((category) => category.categoryParentId === parentId)
      : [];
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setActiveSubcategory(subcategoryId); // Set active subcategory on click
    onSelectSubcategory(subcategoryId);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const parentCategories = categories.filter(
    (category) => category.categoryParentId === null
  );

  return (
    <div id="nav_menu5" className="widget widget_nav_menu">
      <div className="menu-widget-container">
        <ul id="menu-widget" className="menu">
          {parentCategories.map((category) => (
            <li
              key={category.categoryId}
              className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-has-children dropdown"
            >
              <a>{category.name}</a>
              <ul className="menu">
                {getSubcategories(category.categoryId).map((subcategory) => (
                  <li
                    key={subcategory.categoryId}
                    className="menu-item menu-item-type-post_type menu-item-object-page"
                  >
                    <a
                      onClick={() =>
                        handleSubcategoryClick(subcategory.categoryId)
                      }
                      className={
                        activeSubcategory === subcategory.categoryId
                          ? "selected"
                          : ""
                      }
                    >
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

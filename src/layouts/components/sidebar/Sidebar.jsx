import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sidebar/Sidebar.scss';
import all_icon from '../../../assets/img/filter/icon-fabricFilter-all.jpg';

export const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentCategories, setParentCategories] = useState({});

  useEffect(() => {
    const fetchCategoriesAndParents = async () => {
      const categoryIds = [1, 2, 3, 4]; // Thay đổi nếu cần thêm hoặc khác ID
      try {
        const categoryResponses = await Promise.all(
          categoryIds.map(id => axios.get(`https://localhost:7244/api/category/${id}`))
        );
  
        const categoriesData = categoryResponses.map(response => response.data);
        setCategories(categoriesData); // Lưu danh mục con
  
        // Lấy CategoryParentID và gọi API để lấy danh mục cha
        const parentCategoryIds = categoriesData.map(cat => cat.CategoryParentID);
        const parentResponses = await Promise.all(
          parentCategoryIds.map(id => axios.get(`https://localhost:7244/api/Category/parent/${id}`))
        );
  
        console.log('Parent Responses:', parentResponses); // Ghi nhật ký phản hồi của danh mục cha
  
        // Lưu thông tin danh mục cha vào một object
        const parentCategoriesData = {};
        parentResponses.forEach(response => {
          const parentCategory = response.data;
          console.log('Parent Category:', parentCategory); // Ghi nhật ký danh mục cha
          parentCategoriesData[parentCategory.CategoryID] = parentCategory.name;
        });
  
        setParentCategories(parentCategoriesData); // Lưu danh mục cha
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchCategoriesAndParents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="side-menu menu-fabric" id='MnFabric'>
      <div className="left-filter">
        <ul className="filter-menu">
          {/* Hiển thị thông tin danh mục con */}
          {categories.map((category) => (
            <li key={category.CategoryID} className="filter-item" data-tog={`e-${category.CategoryID}`}>
              <a href="javascript:void(0);">
                <img src={all_icon} alt={category.name} /> {category.name}
              </a>
            </li>
          ))}
          {/* Hiển thị tên của danh mục cha */}
          {categories.map((category) => (
            parentCategories[category.CategoryParentID] && (
              <li key={category.CategoryParentID} className="filter-item parent-category">
                <a href="javascript:void(0);">
                  <img src={all_icon} alt={parentCategories[category.CategoryParentID]} /> {parentCategories[category.CategoryParentID]}
                </a>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

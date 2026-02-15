import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getCategories as fetchCategoriesApi,
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "../api/categories";

const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (branchId) => {
    if (!branchId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCategoriesApi(branchId);
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      const response = await createCategoryApi(categoryData);
      if (response.success) {
        setCategories((prev) => [...prev, response.category]);
        return response.category;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await deleteCategoryApi(id);
      if (response.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

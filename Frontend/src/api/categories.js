import axios from "axios";

const API_URL = "http://localhost:3000/api/categories";

export const getCategories = async (branchId) => {
  const response = await axios.get(`${API_URL}/${branchId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

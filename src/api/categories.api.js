import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const categoriesApi = axios.create({
  baseURL: `${baseURL}/products/api/categories/`,
});
export const getAllCategories = () => categoriesApi.get("/");

export const getCategory = (id) => categoriesApi(`/${id}/`);

export const addCategory = (category) => categoriesApi.post("/", category);

export const deleteCategory = (id) => categoriesApi.delete(`/${id}/`);

export const updateCategory = (id, category) => categoriesApi.put(`/${id}/`, category);
import axios from "axios";

const categoriesApi = axios.create({
  baseURL: "http://localhost:8000/products/api/categories/",
});

export const getAllCategories = () => categoriesApi.get("/");

export const getCategory = (id) => categoriesApi(`/${id}/`);

export const addCategory = (category) => categoriesApi.post("/", category);

export const deleteCategory = (id) => categoriesApi.delete(`/${id}/`);

export const updateCategory = (id, category) => categoriesApi.put(`/${id}/`, category);
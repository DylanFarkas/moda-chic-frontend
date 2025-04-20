import axios from "axios";

const categoriesApi = axios.create({
  baseURL: "http://localhost:8000/products/api/categories/",
});

export const getAllCategories = () => categoriesApi.get("/");

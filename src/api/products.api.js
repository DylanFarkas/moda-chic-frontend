import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const productsApi = axios.create({
  baseURL: `${baseURL}/products/api/products/`,
});

const sizesApi = axios.create({
  baseURL: `${baseURL}/products/api/sizes/`,
});



export const getAllProducts = () => productsApi.get("/");

export const getProduct = (id) => productsApi.get(`/${id}/`);

export const addProduct = (product) => productsApi.post("/", product);

export const deleteProduct = (id) => productsApi.delete(`/${id}/`);

export const updateProduct = (id, product) => productsApi.put(`/${id}/`, product);

export const getAllSizes = () => sizesApi.get("/");
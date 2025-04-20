import axios from "axios";

const productsApi = axios.create({
    baseURL: "http://localhost:8000/products/api/products/",
});

export const getAllProducts = () => productsApi.get("/");

export const getProduct = (id) => productsApi(`/${id}/`);

export const addProduct = (product) => productsApi.post("/", product);

export const deleteProduct = (id) => productsApi.delete(`/${id}/`);

export const updateProduct = (id, product) => productsApi.put(`/${id}/`, product);
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const ordersApi = axios.create({
    baseURL: `${baseURL}/users/orders/`,
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getAllOrders = () => ordersApi.get("", getAuthHeaders());

export const updateOrderStatus = (id, data) => {
    ordersApi.patch(`${id}/`, data, getAuthHeaders());
}
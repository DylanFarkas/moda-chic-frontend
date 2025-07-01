import axios from "axios";

const ordersApi = axios.create({
    baseURL: "http://localhost:8000/users/orders/",
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
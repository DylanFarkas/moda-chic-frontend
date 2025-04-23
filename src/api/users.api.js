import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:8000/users/',
});

// Registro de usuario
export const registerUser = (userData) => usersApi.post('register/', userData);

// Login de usuario
export const loginUser = async (email, password) => {
  const response = await axios.post("http://localhost:8000/users/login/", {
    email,
    password,
  });
  return response.data;
};

export const getUsers = () => usersApi.get("users/");
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

// Solicitar recuperación de contraseña
export const requestPasswordReset = (email) => {
  return usersApi.post('password-reset/', { email });
};

// Confirmar nueva contraseña
export const confirmPasswordReset = (uidb64, token, newPassword) => {
  return usersApi.post('password-reset-confirm/', {
    uidb64,
    token,
    new_password: newPassword,
  });
};
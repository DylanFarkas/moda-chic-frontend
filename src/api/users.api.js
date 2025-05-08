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

// Agrega el token a las solicitudes que lo necesiten
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWishlist = () => {
  return usersApi.get('wishlist/', getAuthHeaders());
};

// Agregar producto a la wishlist
export const addToWishlist = (productId) => {
  return usersApi.post('wishlist/', { product: productId }, getAuthHeaders());
};

// Eliminar producto de la wishlist (por ID de la entrada de wishlist)
export const removeFromWishlist = (wishlistItemId) => {
  return usersApi.delete(`wishlist/${wishlistItemId}/`, getAuthHeaders());
};

// Obtener carrito del usuario
export const getCart = () => {
  return usersApi.get('cart/', getAuthHeaders());
};

// Agregar producto al carrito
export const addToCart = (productId, quantity, sizeId) => {
  return usersApi.post('cart-items/', {
    product: productId,
    quantity: quantity,
    size: sizeId
  }, getAuthHeaders());
};


// Actualizar cantidad de producto en el carrito
export const updateCartItemQuantity = (cartItemId, quantity) => {
  return usersApi.patch(
    `cart-items/${cartItemId}/`,
    { quantity },
    getAuthHeaders()
  );
};

// Eliminar producto del carrito

export const removeFromCart = (productlistItenId) => {
  return usersApi.delete(`cart-items/${productlistItenId}/`, getAuthHeaders());
};
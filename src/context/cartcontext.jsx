import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Cargar el carrito desde localStorage al inicializar
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Persistir el carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, sizeId = null) => {
    setCartItems(prev => {
      // Verificar si el producto ya existe en el carrito con la misma talla
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === sizeId
      );

      if (existingIndex >= 0) {
        // Actualizar cantidad si ya existe
        return prev.map((item, index) => 
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Agregar nuevo item si no existe
        const sizeName = sizeId 
          ? product.size_stock?.find(s => s.size.id === sizeId)?.size.name 
          : 'Única';
        
        const newItem = {
          ...product,
          quantity,
          selectedSize: sizeId,
          sizeName,
          // Asegurar que tenemos los campos mínimos necesarios
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.main_image || product.image || ''
        };
        
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId, sizeId = null) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.id === productId && item.selectedSize === sizeId)
      )
    );
  };

  const updateQuantity = (productId, newQuantity, sizeId = null) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.selectedSize === sizeId
          ? { ...item, quantity: Math.max(1, newQuantity) } // Mínimo 1
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total de items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular precio total
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  // Verificar si un producto está en el carrito (opcional)
  const isInCart = (productId, sizeId = null) => {
    return cartItems.some(
      item => item.id === productId && item.selectedSize === sizeId
    );
  };

  // Obtener la cantidad de un producto específico (opcional)
  const getProductQuantity = (productId, sizeId = null) => {
    const item = cartItems.find(
      item => item.id === productId && item.selectedSize === sizeId
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        getProductQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
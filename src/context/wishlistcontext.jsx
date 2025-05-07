import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Cargar del backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/users/wishlist/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data);
        }
      } catch (error) {
        console.error("Error al cargar la wishlist", error);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistItems, setWishlistItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

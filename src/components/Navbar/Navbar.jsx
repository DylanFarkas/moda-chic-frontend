import { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaHeart } from "react-icons/fa";
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../../context/cartcontext";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCart, setShowCart] = useState(false); // Nuevo estado para el carrito
  const [showWishlist, setShowWishlist] = useState (false);
  const [wishlistItems, setWishlistItems] = useState ([]);
  const navigate = useNavigate();
  const { cartItems, totalPrice, removeFromCart } = useCart();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
    setShowDropdown(false);

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has cerrado sesión exitosamente.",
      confirmButtonColor: "#d63384",
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="logo" onClick={() => navigate("/")}>Moda Chic</div>
  
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>
  
      <nav className={`nav-categories ${menuOpen ? 'active' : ''}`}>
        <a href="/">Inicio</a>
        <a href="#">Ropa</a>
        <a href="#">Vestidos</a>
        <a href="#">Tops</a>
        <a href="#">Accesorios</a>
  
        <div className="mobile-icons">
          {user ? (
            <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
              <FaUser className="icon" />
              {showDropdown && (
                <div className="dropdown">
                  <p>{user.username || user.email}</p>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <FaUser className="icon" onClick={() => navigate('/login')} />
          )}
  
          <div className="cart-icon-container" onClick={toggleCart}>
            <FaShoppingCart className="icon" />
            {totalItems > 0 && <span className="cart-counter">{totalItems}</span>}
          </div>
  
          <div className="wishlist-icon-container" onClick={() => setShowWishlist(!showWishlist)}>
            <FaHeart className="icon" />
            {wishlistItems.length > 0 && (
              <span className="wishlist-counter">{wishlistItems.length}</span>
            )}
          </div>
        </div>
      </nav>
  
      <div className="nav-actions">
        <div className="search-box">
          <input type="text" placeholder="¿Qué estás buscando?" />
          <button><FaSearch /></button>
        </div>
  
        {user ? (
          <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
            <FaUser className="icon" />
            {showDropdown && (
              <div className="dropdown">
                <p>{user.username || user.email}</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <FaUser className="icon" onClick={() => navigate('/login')} />
        )}
  
        <div className="cart-icon-container" onClick={toggleCart}>
          <FaShoppingCart className="icon" />
          {totalItems > 0 && <span className="cart-counter">{totalItems}</span>}
        </div>
  
        <div className="wishlist-icon-container" onClick={() => setShowWishlist(!showWishlist)}>
          <FaHeart className="icon" />
          {wishlistItems.length > 0 && (
            <span className="wishlist-counter">{wishlistItems.length}</span>
          )}
        </div>
      </div>
  
      {/* Carrito desplegable */}
      <div className={`cart-dropdown ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Tu Carrito ({totalItems})</h3>
          <button onClick={toggleCart} className="close-cart">
            <FaTimes />
          </button>
        </div>
  
        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    {item.sizeName && <p>Talla: {item.sizeName}</p>}
                    <p>${item.price.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="remove-item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <p>Total: <span>${totalPrice.toLocaleString()}</span></p>
              <button
                className="checkout-button"
                onClick={() => {
                  toggleCart();
                  navigate('/checkout');
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
  
      {/* Lista de deseos desplegable */}
      <div className={`cart-dropdown ${showWishlist ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Tu Lista de Deseos ({wishlistItems.length})</h3>
          <button onClick={() => setShowWishlist(false)} className="close-cart">
            <FaTimes />
          </button>
        </div>
  
        {wishlistItems.length === 0 ? (
          <p className="empty-cart">Tu lista de deseos está vacía</p>
        ) : (
          <>
            <div className="cart-items-list">
              {wishlistItems.map(item => (
                <div key={`${item.id}-${item.sizeName || ''}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    {item.sizeName && <p>Talla: {item.sizeName}</p>}
                    <p>${item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = wishlistItems.filter(i => i.id !== item.id || i.sizeName !== item.sizeName);
                      setWishlistItems(updated);
                    }}
                    className="remove-item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <button
                className="checkout-button"
                onClick={() => {
                  setShowWishlist(false);
                  navigate('/wishlist');
                }}
              >
                Ver Lista Completa
              </button>
            </div>
          </>
        )}
      </div>
  
      {/* Overlays */}
      {showCart && <div className="cart-overlay" onClick={toggleCart} />}
      {showWishlist && <div className="cart-overlay" onClick={() => setShowWishlist(false)} />}
    </header>
  );
};

export default Navbar;
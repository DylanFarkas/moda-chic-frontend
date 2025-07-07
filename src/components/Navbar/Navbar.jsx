import { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaHeart } from "react-icons/fa";
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "../../context/wishlistcontext";
import Swal from "sweetalert2";
import { removeFromCart, removeFromWishlist } from "../../api/users.api";
import { useCart } from "../../context/cartcontext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const { wishlistItems, setWishlistItems } = useWishlist();
  const navigate = useNavigate();
  const { cartItems = [], totalPrice, setCartItems } = useCart();
  const cart = cartItems[0];

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
      window.location.href = "/login";
    }, 2000);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const totalItems = cartItems[0]?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="navbar">
      <div className="logo-container">
        <div className="logo" onClick={() => navigate("/")}>MODA CHIC</div>
        <div className="logo-subtitle">ELEGANCIA CONTEMPORÁNEA</div>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`nav-categories ${menuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <a href="/">INICIO</a>
          <a href="#">ROPA</a>
          <a href="#">VESTIDOS</a>
          <a href="#">TOPS</a>
          <a href="#">ACCESORIOS</a>
        </div>

        <div className="mobile-icons">
          <div className="search-box mobile-search">
            <input type="text" placeholder="Buscar..." />
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
      </nav>

      <div className="nav-actions">
        <div className="search-box">
          <input type="text" placeholder="Buscar..." />
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

      <div className={`cart-dropdown ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Tu Carrito ({totalItems})</h3>
          <button onClick={toggleCart} className="close-cart">
            <FaTimes />
          </button>
        </div>

        {(!cartItems || cartItems.length === 0) ? (
          <p className="empty-cart">Tu carrito está vacío</p>
        ) : (
          <>
            {cart && cart.items && cart.items.length > 0 ? (
              <div className="cart-items-list">
                {cart.items.map(item => (
                  <div key={`${item.product}-${item.size}`} className="cart-item">
                    <img src={item.product_image} alt="producto" className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.product_name}</h4>
                      <p>Talla: {item.size_name}</p>
                      <p>${item.product_price} x {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCartItems(prev => {
                          const updated = [...prev];
                          if (updated[0]?.items) {
                            updated[0].items = updated[0].items.filter(p => p.id !== item.id);
                          }
                          return updated;
                        });
                        removeFromCart(item.id);
                      }}
                      className="remove-item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-cart">Tu carrito está vacío</p>
            )}

            {/* Mostrar total y botón solo si hay productos */}
            {cart.items && cart.items.length > 0 && (
              <div className="cart-total">
                <p>Total: <span>${cart.total_price ? cart.total_price.toLocaleString() : 'N/A'}</span></p>
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
            )}
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
                <div key={item.id} className="cart-item">
                  <img src={item.product_image} alt={item.product_name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.product_name}</h4>
                    <p>${item.product_price}</p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromWishlist(item.id).then(() => {
                        setWishlistItems(prev => prev.filter(p => p.id !== item.id));
                      });
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

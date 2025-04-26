import { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaSearch, FaBars } from "react-icons/fa";
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    // Eliminar datos del usuario y redirigir
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

    // Redirigir tras un pequeño delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

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

        {/* Íconos móviles */}
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
          <FaShoppingCart className="icon" />
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

        <FaShoppingCart className="icon" />
      </div>
    </header>
  );
};

export default Navbar;

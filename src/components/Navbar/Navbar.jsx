import { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaSearch, FaBars } from "react-icons/fa";
import '../Navbar/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase/config"; // Asegúrate de importar auth
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Detectar usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowDropdown(false);
    setShowLogoutModal(true);
  
    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/");
    }, 2000); 
  };

  return (
    <header className="navbar">
      <div className="logo">Moda Chic</div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

      <nav className={`nav-categories ${menuOpen ? 'active' : ''}`}>
        <a href="/">Inicio</a>
        <a href="#">Ropa</a>
        <a href="#">Vestidos</a>
        <a href="#">Tops</a>
        <a href="#">Accesorios</a>
      </nav>

      <div className="nav-actions">
        <div className="search-box">
          <input type="text" placeholder="¿Qué estás buscando?" />
          <button><FaSearch /></button>
        </div>

        {/* Si el usuario está logueado */}
        {user ? (
          <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
            <FaUser className="icon" />
            <span className="user-name">{user.displayName || user.email}</span>
            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <FaUser className="icon" onClick={() => navigate('/login')} />
        )}

        <FaShoppingCart className="icon" />

        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Sesión cerrada con éxito ✅</h3>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

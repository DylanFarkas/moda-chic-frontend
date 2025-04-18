import { useState } from "react";
import { FaShoppingCart, FaUser, FaSearch, FaBars } from "react-icons/fa";
import '../Navbar/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

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
        <FaUser className="icon" onClick={() => navigate('/login')}/>
        <FaShoppingCart className="icon" />
      </div>
    </header>
  );
};

export default Navbar;
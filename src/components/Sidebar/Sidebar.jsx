import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaCog, FaUser } from "react-icons/fa";
import './Sidebar.css';

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="brand" onClick={() => navigate('/admin')}>Moda Chic</h2>
      <nav>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/products')}><FaBox className="sidebar-icons"/> <span>Productos</span></li>
          <li onClick={() => navigate('/users')}><FaUsers className="sidebar-icons" /> <span>Usuarios</span></li>
          <li onClick={() => navigate('/orders')}><FaShoppingCart className="sidebar-icons" /> <span>Pedidos</span></li>
          <li onClick={() => navigate('/statistics')}><FaChartBar className="sidebar-icons" /> <span>Estadísticas</span></li>
          <li><FaCog className="sidebar-icons" /> <span>Configuración</span></li>
        </ul>
      </nav>

      <div className="cuenta-section">
        <p className="cuenta-title"><FaUser className="sidebar-icons" /> Cuenta</p>
        <p className="cuenta-email">{userEmail}</p>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
};

export default Sidebar;

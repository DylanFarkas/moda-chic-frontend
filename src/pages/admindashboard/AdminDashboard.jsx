import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import "./AdminDashboard.css";

const AdminDashboard = () => {
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
    <div className="admin-container">
      <aside className="sidebar">
        <h2>MODA CHIC</h2>
        <ul className="sidebar-menu">
        
          <li>📦 Productos</li>
          <li>👥 Usuarios</li>
          <li>🛒 Pedidos</li>
          <li>📊 Estadísticas</li>
          <li>⚙️ Configuración</li>
          <li className="cuenta-section">
            <p className="cuenta-title">👤 Cuenta</p>
            <p className="cuenta-email">{userEmail}</p>
            <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
          </li>
        </ul>
      </aside>

      <main className="admin-content">
        <h1>Bienvenido, Administrador 👑</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;

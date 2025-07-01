import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaUser,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css";

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'confirm-logout-admin',
        cancelButton: 'cancel-logout-admin',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión exitosamente.",
            confirmButtonColor: "#993f6b",
            customClass: {
              confirmButton: 'confirm-logout-admin-success',
            }
          }).then(() => {
            navigate("/");
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión.",
            confirmButtonColor: "#dc3545",
          });
        }
      }
    });
  };

  return (
    <aside className="sidebar">
      <h2 className="brand-title" onClick={() => navigate("/admin")}>
        Moda Chic
      </h2>
      <nav>
        <ul className="sidebar-menu">
          <li className={location.pathname === "/products" ? "active" : ""} onClick={() => navigate("/products")}>
            <FaBox className="sidebar-icons" /> <span>Productos</span>
          </li>
          <li className={location.pathname === "/categories" ? "active" : ""} onClick={() => navigate("/categories")}>
            <BiSolidCategory className="sidebar-icons" /> <span>Categorías</span>
          </li>
          <li className={location.pathname === "/orders" ? "active" : ""} onClick={() => navigate("/orders")}>
            <FaShoppingCart className="sidebar-icons" /> <span>Pedidos</span>
          </li>
          <li className={location.pathname === "/statistics" ? "active" : ""} onClick={() => navigate("/statistics")}>
            <FaChartBar className="sidebar-icons" /> <span>Estadísticas</span>
          </li>
          <li className={location.pathname === "/users" ? "active" : ""} onClick={() => navigate("/users")}>
            <FaUsers className="sidebar-icons" /> <span>Usuarios</span>
          </li>
          <li>
            <FaCog className="sidebar-icons" /> <span>Configuración</span>
          </li>
        </ul>
      </nav>

      <div className="cuenta-section">
        <p className="cuenta-title">
          <FaUser className="sidebar-icons" /> Cuenta
        </p>
        <p className="cuenta-email">{userEmail}</p>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
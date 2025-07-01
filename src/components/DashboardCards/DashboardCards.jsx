import { useEffect, useState } from "react";
import { FaChartLine, FaLayerGroup, FaUsers, FaBoxOpen, FaBolt, FaBox, FaList, FaCog, FaHistory } from "react-icons/fa";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api";
import { getUsers } from "../../api/users.api";
import { getAllOrders } from "../../api/orders.api"; // 👈 importar
import { useNavigate } from "react-router-dom";

import './DashboardCards.css';

const DashboardCards = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]); // 👈 nuevos pedidos recientes
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getUsers(),
          getAllOrders(),
        ]);

        setTotalProducts(productsRes.data.length);
        setTotalCategories(categoriesRes.data.length);
        setTotalUsers(usersRes.data.length);

        // Ordenar por fecha descendente y tomar los 5 más recientes
        const sortedOrders = ordersRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setRecentOrders(sortedOrders);

      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-grid">

      {/* Estadísticas */}
      <div className="dashboard-card stats-card">
        <div className="card-header">
          <FaChartLine className="card-icon" />
          <h3>Estadísticas Generales</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-circle"><FaLayerGroup /></div>
            <div className="stat-info">
              <span className="stat-label">Categorías</span>
              <span className="stat-value">{totalCategories}</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-circle"><FaUsers /></div>
            <div className="stat-info">
              <span className="stat-label">Clientes</span>
              <span className="stat-value">{totalUsers}</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-circle"><FaBoxOpen /></div>
            <div className="stat-info">
              <span className="stat-label">Productos</span>
              <span className="stat-value">{totalProducts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="dashboard-card actions-card">
        <div className="card-header">
          <FaBolt className="card-icon" />
          <h3>Acciones Rápidas</h3>
        </div>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/products?new=true')}>
            <FaBox />
            <span>Nuevo Producto</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/orders')}>
            <FaList />
            <span>Ver Pedidos</span>
          </button>
          <button className="action-btn">
            <FaChartLine />
            <span>Ventas</span>
          </button>
          <button className="action-btn">
            <FaCog />
            <span>Configuración</span>
          </button>
        </div>
      </div>

      {/* Registros recientes */}
      <div className="dashboard-card recent-card">
        <div className="card-header">
          <FaHistory className="card-icon" />
          <h3>Últimas Compras</h3>
        </div>
        <div className="recent-list">
          {recentOrders.length === 0 ? (
            <p className="empty-text">No hay pedidos recientes</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="recent-item">
                <span className="recent-name">Pedido #{order.id}</span>
                <span className="recent-responsible">por {order.email}</span>
                <span className="recent-date">{formatDate(order.created_at)}</span>
                <span className={`recent-status status-${order.status}`}>
                  {order.status === "pending" && "Pendiente"}
                  {order.status === "paid" && "Pagado"}
                  {order.status === "shipped" && "Enviado"}
                  {order.status === "delivered" && "Entregado"}
                  {order.status === "cancelled" && "Cancelado"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardCards;
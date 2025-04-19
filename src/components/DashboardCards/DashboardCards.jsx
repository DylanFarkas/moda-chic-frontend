import { FaChartLine, FaLayerGroup, FaUsers, FaBoxOpen, FaBolt, FaUserPlus, FaList, FaCog, FaHistory } from "react-icons/fa";
import './DashboardCards.css';

const DashboardCards = () => {
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
              <span className="stat-value">12</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-circle"><FaUsers /></div>
            <div className="stat-info">
              <span className="stat-label">Clientes</span>
              <span className="stat-value">158</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-circle"><FaBoxOpen /></div>
            <div className="stat-info">
              <span className="stat-label">Productos</span>
              <span className="stat-value">320</span>
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
          <button className="action-btn">
            <FaUserPlus />
            <span>Nuevo Producto</span>
          </button>
          <button className="action-btn">
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
          <div className="recent-item">
            <span className="recent-name">Pedido #00123</span>
            <span className="recent-responsible">por camila@email.com</span>
            <span className="recent-date">18 abr 2025</span>
          </div>
          <div className="recent-item">
            <span className="recent-name">Pedido #00124</span>
            <span className="recent-responsible">por andrea@email.com</span>
            <span className="recent-date">19 abr 2025</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardCards;

import { useEffect, useState } from "react";
import { FaChartLine, FaLayerGroup, FaUsers, FaBoxOpen, FaBolt, FaBox, FaList, FaCog, FaHistory } from "react-icons/fa";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api";
import { useNavigate } from "react-router-dom";

import './DashboardCards.css';

const DashboardCards = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);

        setTotalProducts(productsRes.data.length);
        setTotalCategories(categoriesRes.data.length);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

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
              <span className="stat-value">Falta</span>
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
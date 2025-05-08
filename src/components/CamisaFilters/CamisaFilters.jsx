import { useEffect, useState } from "react";
import { getAllSizes } from "../../api/products.api";
import "./CamisaFilters.css";

const CamisaFilters = ({ onFilterChange }) => {
  const [sizes, setSizes] = useState([]);
  const [filters, setFilters] = useState({
    size: "",
    color: "",
    priceRange: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const priceRanges = [
    { label: "Menos de $50.000", value: "0-50000" },
    { label: "$50.000 - $100.000", value: "50000-100000" },
    { label: "Más de $100.000", value: "100000-9999999" },
  ];

  const colors = [
    { name: "Negro", code: "#000000" },
    { name: "Blanco", code: "#FFFFFF" },
    { name: "Rojo", code: "#FF0000" },
    { name: "Azul", code: "#0000FF" },
  ];

  useEffect(() => {
    async function loadSizes() {
      try {
        const res = await getAllSizes();
        setSizes(res.data);
      } catch (err) {
        console.error("Error cargando tallas:", err);
      }
    }
    loadSizes();
  }, []);

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({ size: "", color: "", priceRange: "" });
    onFilterChange({ size: "", color: "", priceRange: "" });
  };

  return (
    <div className="filters-container">
      <button className="toggle-btn" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Filtrar por</h3>
            <button className="clear-btn" onClick={handleResetFilters}>
              Quitar Filtro
            </button>
          </div>

          <div className="filter-group">
            <label>Talla:</label>
            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            >
              <option value="">Todas</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Color:</label>
            <div className="color-options">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className={`color-circle ${filters.color === color.code ? "selected" : ""}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setFilters({ ...filters, color: color.code })}
                />
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Rangos de precio:</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            >
              <option value="">Todos</option>
              {priceRanges.map((range, index) => (
                <option key={index} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <button className="apply-btn" onClick={handleApplyFilters}>
            APLICAR FILTROS
          </button>
        </div>
      )}
    </div>
  );
};

export default CamisaFilters;

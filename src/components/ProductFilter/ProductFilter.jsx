import { useEffect, useState } from "react";
import { getAllSizes } from "../../api/products.api";
import { FaFilter, FaTimes } from "react-icons/fa";
import "./ProductFilter.css";

const ProductFilters = ({ onFilterChange }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadSizes() {
      try {
        const res = await getAllSizes();
        setSizes(res.data);
      } catch (error) {
        console.error("Error loading sizes", error);
      }
    }
    loadSizes();
  }, []);

  const handleSizeToggle = (sizeId) => {
    const updated = selectedSizes.includes(sizeId)
      ? selectedSizes.filter(id => id !== sizeId)
      : [...selectedSizes, sizeId];

    setSelectedSizes(updated);
    onFilterChange({ sizes: updated, priceRange });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...priceRange, [name]: parseInt(value) };
    setPriceRange(newRange);
    onFilterChange({ sizes: selectedSizes, priceRange: newRange });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price).replace('COP', '$');
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setPriceRange({ min: 0, max: 200000 });
    onFilterChange({ sizes: [], priceRange: { min: 0, max: 200000 } });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <button className="floating-filters-btn" onClick={toggleFilters}>
        <FaFilter />
      </button>

      <div className="filters-dropdown-container">
        {/* Overlay para cerrar al hacer clic fuera */}
        {showFilters && <div className="filters-overlay" onClick={() => setShowFilters(false)} />}
        {/* Dropdown de filtros */}
        <div className={`filters-dropdown ${showFilters ? 'open' : ''}`}>

          <div className="filters-header">

            <h3>Filtros</h3>
            <button onClick={toggleFilters} className="close-filters">
              <FaTimes />
            </button>
          </div>

          <div className="filters-content">
            <div className="filter-group">
              <div className="filter-group-header">
                <h4 className="filter-title">Tallas</h4>
                {selectedSizes.length > 0 && (
                  <button
                    className="clear-filter-btn"
                    onClick={() => {
                      setSelectedSizes([]);
                      onFilterChange({ sizes: [], priceRange });
                    }}
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    className={`size-option ${selectedSizes.includes(size.id) ? 'selected' : ''}`}
                    onClick={() => handleSizeToggle(size.id)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-header">
                <h4 className="filter-title">Rango de Precio</h4>
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setPriceRange({ min: 0, max: 200000 });
                    onFilterChange({ sizes: selectedSizes, priceRange: { min: 0, max: 200000 } });
                  }}
                >
                  Limpiar
                </button>
              </div>
              <div className="price-range-container">
                <div className="price-inputs">
                  <div className="price-input">
                    <label>Mín</label>
                    <input
                      type="number"
                      name="min"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                      min="0"
                      max={priceRange.max - 10000}
                    />
                  </div>
                  <div className="price-input">
                    <label>Máx</label>
                    <input
                      type="number"
                      name="max"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                      min={priceRange.min + 10000}
                      max="200000"
                    />
                  </div>
                </div>
                <div className="price-slider-container">
                  <div className="slider-track"></div>
                  <input
                    type="range"
                    name="min"
                    min="0"
                    max="200000"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    step="5000"
                    className="price-slider min-slider"
                  />
                  <input
                    type="range"
                    name="max"
                    min="0"
                    max="200000"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    step="5000"
                    className="price-slider max-slider"
                  />
                </div>
                <div className="price-labels">
                  <span>{formatPrice(priceRange.min)}</span>
                  <span>{formatPrice(priceRange.max)}</span>
                </div>
              </div>
            </div>

            <button
              className="reset-filters-btn"
              onClick={resetFilters}
            >
              Reiniciar Filtros
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
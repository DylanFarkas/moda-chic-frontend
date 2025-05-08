// src/components/ProductFilters/ProductFilters.jsx
import { useEffect, useState } from "react";
import "./ProductFilter.css";
import { getAllSizes } from "../../api/products.api";

const ProductFilters = ({ onFilterChange }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 }); // Ajusta estos valores según tu rango de precios.

  useEffect(() => {
    async function loadSizes() {
      try {
        const res = await getAllSizes();
        setSizes(res.data);
      } catch (error) {
        console.error("Error al cargar tallas", error);
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
    const value = e.target.value;
    const newRange = { ...priceRange, max: value };
    setPriceRange(newRange);
    onFilterChange({ sizes: selectedSizes, priceRange: newRange });
  };

  return (
    <div className="product-filters">
      <div className="filter-group">
        <h4 className="filter-title">Tallas</h4>
        <div className="size-options">
          {sizes.map(size => (
            <label key={size.id} className="size-option">
              <input
                type="checkbox"
                value={size.id}
                checked={selectedSizes.includes(size.id)}
                onChange={() => handleSizeToggle(size.id)}
              />
              {size.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">Precio</h4>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="200000"
            value={priceRange.max}
            onChange={handlePriceChange}
            step="5000"
            className="price-slider"
          />
          <p className="price-label">Hasta: ${priceRange.max}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

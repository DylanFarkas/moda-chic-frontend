import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import ProductCards from "../../../components/ProductCards/ProductCards";
import ProductFilters from "../../../components/ProductFilter/ProductFilter";
import "./Pantalones.css";

const PantalonesPage = () => {
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pantalones-container">
      <Navbar />
      <section className="products-p-section">
        <h2 className="section-p-title">Pantalones</h2>
        <div className="products-p-content">
          <div className="filters-container">
            <ProductFilters onFilterChange={setFilters} />
          </div>
          <div className="products-container">
            <ProductCards fixedCategory="pantalones" filters={filters} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PantalonesPage;
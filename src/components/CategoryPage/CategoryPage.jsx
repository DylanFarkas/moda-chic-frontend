// src/pages/CategoryPage/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ProductFilters from "../ProductFilter/ProductFilter";
import ProductCards from "../ProductCards/ProductCards";
import "./CategoryPage.css";
import Footer from "../Footer/footer";

const CategoryPage = () => {
  const { categoryName } = useParams(); // <- nombre de la categoría desde la URL
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="category-container">
      <Navbar />
      <section className="products-category-section">
        <h2 className="section-category-title">{categoryName}</h2>
        <div className="products-category-content">
          <ProductFilters onFilterChange={setFilters} />
          <div className="products-page-container">
            <ProductCards fixedCategory={categoryName} filters={filters} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CategoryPage;
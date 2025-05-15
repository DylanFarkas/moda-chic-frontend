import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel/Carousel";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/footer";
import ProductCards from "../../components/ProductCards/ProductCards";
import { getAllCategories } from "../../api/categories.api";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const res = await getAllCategories();
      setCategories(res.data);
    }
    loadCategories();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <Carousel />

      <section className="products-section">
        <h2 className="section-title">Nuestra Colección</h2>
        <div className="category-icons">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-item"
              onClick={() => navigate(`/categoria/${category.name.toLowerCase()}`)}
            >
              <img
                src={`/icons/${category.name.toLowerCase()}-icon.png`}
                alt={category.name}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/icons/default-icon.png";
                }}
              />
              <span>{category.name}</span>
            </div>
          ))}
        </div>
        <ProductCards />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
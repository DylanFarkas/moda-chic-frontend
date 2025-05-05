import { useNavigate } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/footer";
import ProductCards from "../../components/ProductCards/ProductCards";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />
      <Carousel />

      <section className="products-section">
        <h2 className="section-title"> Nuestra Colección</h2>
        <div className="category-icons">
          <div
            className="category-item"
            onClick={() => navigate("/pantalon-page?categoria=pantalones")}
          >
            <img src="/icons/pantalon-icon.png" alt="Pantalones" />
            <span>Pantalones</span>
          </div>
          <div
            className="category-item"
            onClick={() => navigate("/camisa-page?categoria=camisas")}
          >
            <img src="/icons/camisa-icon.png" alt="Camisas" />
            <span>Camisas</span>
          </div>
        </div>
        <ProductCards />
      </section>
      <Footer/>
    </div>
  );
};

export default Home;

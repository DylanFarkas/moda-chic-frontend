import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import Navbar from '../../components/Navbar/Navbar';
import ProductCards from '../../components/ProductCards/ProductCards';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />
      <Carousel />

      <section className='products-section'>
        <h2 className="section-title"> Nuestra Colección</h2>
        <div className="buttons">
          <button onClick={() => navigate('/pantalon-page?categoria=pantalones')} className='button-category'>
            Pantalones
          </button>
          <button onClick={() => navigate('/camisa-page?categoria=camisas')} className='button-category'>
            Camisas
          </button>

        </div>
        <ProductCards />
      </section>
    </div>
  );
};

export default Home;
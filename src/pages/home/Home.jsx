import Carousel from '../../components/Carousel/Carousel';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css'


const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Carousel />

      <section className='products-section'>
        <h2 className="section-title"> Nuestra Colección</h2>
      </section>


    </div>
  );
};

export default Home;
import Navbar from "../../../components/Navbar/Navbar";
import ProductCards from "../../../components/ProductCards/ProductCards";

const PantalonesPage = () => {
    return (
        <div className="home-container">
            <Navbar />
            <section className='products-section'>
                <h2 className="section-title">Pantalones</h2>
                <ProductCards fixedCategory="pantalones" />
            </section>
        </div>
    );
};

export default PantalonesPage;

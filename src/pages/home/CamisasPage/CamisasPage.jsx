import Navbar from "../../../components/Navbar/Navbar";
import ProductCards from "../../../components/ProductCards/ProductCards";

const CamisasPage = () => {
    return (
        <div className="home-container">
            <Navbar />
            <section className='products-section'>
                <h2 className="section-title">Camisas</h2>
                <ProductCards fixedCategory="camisas" />
            </section>
        </div>
    );
};

export default CamisasPage;

import ProductsTable from "../../../components/ProductsTable/ProductsTable";
import Sidebar from "../../../components/Sidebar/Sidebar"
import './Products.css'

const Products = () => {
    return (
        <div className="products-container">
            <Sidebar />
           <div className="products-content">
            <h1 className="products-title"> Productos </h1>
                <ProductsTable />
           </div>
        </div>

    );
};

export default Products;
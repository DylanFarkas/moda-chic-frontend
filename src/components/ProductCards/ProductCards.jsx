import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/products.api";
import './ProductCards.css';

const ProductCards = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function loadProducts() {
            const res = await getAllProducts();
            setProducts(res.data);
            console.log(res);
        }
        loadProducts();
    }, []);

    return (
        <div className="product-cards-container">
            <div className="cards-wrapper">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.main_image} alt={product.name} className="product-image" />
                        <div className="product-details">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-price">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCards;
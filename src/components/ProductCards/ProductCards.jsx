import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api";
import './ProductCards.css';

const ProductCards = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function loadData() {
            const resProducts = await getAllProducts();
            const resCategories = await getAllCategories();

            const params = new URLSearchParams(location.search);
            const categoryParam = params.get("categoria");

            setProducts(resProducts.data);
            setCategories(resCategories.data);

            if (categoryParam) {
                const filtered = resProducts.data.filter(
                    product => product.category_name?.name.toLowerCase() === categoryParam.toLowerCase()
                );
                setFilteredProducts(filtered);
                setSelectedCategory(categoryParam);
            } else {
                setFilteredProducts(resProducts.data);
            }
        }

        loadData();
    }, [location.search]);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="product-cards-container">
            <div className="cards-wrapper">
                {filteredProducts.map((product) => (
                    <div 
                        key={product.id} 
                        className="product-card" 
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img src={product.main_image || product.image} alt={product.name} className="product-image" />
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

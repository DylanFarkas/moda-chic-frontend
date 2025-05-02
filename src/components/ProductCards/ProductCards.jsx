import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api"; // Importa las categorías
import './ProductCards.css';

const ProductCards = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        async function loadData() {
            const resProducts = await getAllProducts();
            const resCategories = await getAllCategories();
            setProducts(resProducts.data);
            setFilteredProducts(resProducts.data);
            setCategories(resCategories.data);
        }
        loadData();
    }, []);

    useEffect(() => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category_name?.name === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, products]);

    return (
        <div className="product-cards-container">
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="cards-wrapper">
                {filteredProducts.map((product) => (
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

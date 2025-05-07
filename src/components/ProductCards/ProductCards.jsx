import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api";
import './ProductCards.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../api/users.api";
import { useWishlist } from "../../context/wishlistcontext";

const ProductCards = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlistItems, setWishlistItems } = useWishlist();


    useEffect(() => {
        async function loadData() {
            const resProducts = await getAllProducts();
            const resCategories = await getAllCategories();

            setProducts(resProducts.data);
            setCategories(resCategories.data);

            // Wishlist
            try {
                const resWishlist = await getWishlist();
                setWishlistItems(resWishlist.data);
            } catch (error) {
                console.error("No autenticado o error al obtener wishlist", error);
            }

            const params = new URLSearchParams(location.search);
            const categoryParam = params.get("categoria");

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

    const toggleWishlist = async (productId) => {
        const existing = wishlistItems.find(item => item.product === productId);
        try {
            if (existing) {
                await removeFromWishlist(existing.id);
                setWishlistItems(prev => prev.filter(item => item.id !== existing.id));
            } else {
                const res = await addToWishlist(productId);
                setWishlistItems(prev => [...prev, res.data]);
            }
        } catch (error) {
            console.error("Error al actualizar la wishlist", error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product === productId);
    };


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
                    >
                        <div className="wishlist-icon" onClick={(e) => {
                            e.stopPropagation(); // evita que se dispare el onClick de la card
                            toggleWishlist(product.id);
                        }}>
                            {isInWishlist(product.id) ? (
                                <FaHeart color="red" />
                            ) : (
                                <FaRegHeart color="gray" />
                            )}
                        </div>
                        <div onClick={() => handleProductClick(product.id)}>
                            <img src={product.main_image || product.image} alt={product.name} className="product-image" />
                            <div className="product-details">
                                <h2 className="product-name">{product.name}</h2>
                                <p className="product-price">${product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCards;

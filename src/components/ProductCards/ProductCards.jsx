import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProducts } from "../../api/products.api";
import { getAllCategories } from "../../api/categories.api";
import './ProductCards.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../api/users.api";
import { useWishlist } from "../../context/wishlistcontext";
import Swal from "sweetalert2";

const ProductCards = ({ fixedCategory, filters }) => {
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
            console.log("Respuestas de productos:", resProducts.data);

    
            // Wishlist
            try {
                const resWishlist = await getWishlist();
                setWishlistItems(resWishlist.data);
            } catch (error) {
                console.error("No autenticado o error al obtener wishlist", error);
            }
    
            let filtered = resProducts.data;
    
            const categoryParam = fixedCategory ||
                new URLSearchParams(location.search).get("categoria");
    
            if (categoryParam) {
                filtered = filtered.filter(product =>
                    product.category_name?.name.toLowerCase() === categoryParam.toLowerCase()
                );
                setSelectedCategory(categoryParam);
            }
    
            // Aplica filtros de tallas y precios
            if (filters) {
                console.log("filters.sizes:", filters.sizes);  // Agregar este log para ver las tallas seleccionadas
    
                if (filters.sizes && filters.sizes.length > 0) {
                    filtered = filtered.filter(product =>
                        product.size_stock?.some(sizeStock =>
                            filters.sizes.includes(sizeStock.size.id)
                        )
                    );
                }
                
    
                const min = parseFloat(filters.priceRange?.min);
                const max = parseFloat(filters.priceRange?.max);
    
                if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
                if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);
            }
    
            setFilteredProducts(filtered);
        }
    
        loadData();
    }, [location.search, fixedCategory, filters]);
    

    const toggleWishlist = async (productId) => {
        if (!localStorage.getItem("access_token")) {
            Swal.fire({
                icon: "warning",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para usar la lista de deseos",
                confirmButtonColor: "#993f6b",
                customClass: {
                    confirmButton: 'ok-error-add-product',
                }
            });
            return;
        }

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

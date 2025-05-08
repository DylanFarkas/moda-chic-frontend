import { useEffect, useState } from 'react';
import { getProduct } from "../../api/products.api";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import "./productdetail.css";
import { addToCart, getCart } from '../../api/users.api';
import { useCart } from '../../context/cartcontext';
import Swal from "sweetalert2";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
        setMainImage(res.data.main_image || res.data.image);

        // Seleccionar la primera talla disponible por defecto
        if (res.data.size_stock?.length > 0) {
          setSelectedSize(res.data.size_stock[0].size.id);
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
      }
    }
    loadProduct();
  }, [id]);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleAddToCart = async () => {
    if (!product || (product.size_stock?.length > 0 && !selectedSize)) return;

    try {
      await addToCart(product.id, quantity, selectedSize);

      // Mostrar notificación
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto se ha añadido al carrito",
        confirmButtonColor: "#d63384",
        timer: 2000,
        showConfirmButton: false
      });

      // Recargar el carrito
      const updatedCart = await getCart();
      setCartItems(updatedCart.data);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el mismo producto y la misma talla al carrito",
        confirmButtonColor: "#993f6b",
        customClass: {
          confirmButton: 'ok-error-add-product',
        }
      });
    }
  };

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  if (!product) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />

      <div className="product-detail-container">
        <div className="product-gallery">
          <img src={mainImage} alt={product.name} className="product-main-image" />

          <div className="thumbnail-container">
            {product.main_image && (
              <img
                src={product.main_image}
                alt="Miniatura principal"
                className={`thumbnail ${mainImage === product.main_image ? 'active' : ''}`}
                onClick={() => setMainImage(product.main_image)}
              />
            )}

            {product.image && product.image !== product.main_image && (
              <img
                src={product.image}
                alt="Miniatura secundaria"
                className={`thumbnail ${mainImage === product.image ? 'active' : ''}`}
                onClick={() => setMainImage(product.image)}
              />
            )}

            {product.additional_images?.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`Vista adicional ${index + 1}`}
                className={`thumbnail ${mainImage === img.image ? 'active' : ''}`}
                onClick={() => setMainImage(img.image)}
              />
            ))}
          </div>
        </div>

        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price.toLocaleString()}</p>

          <div className="product-options">
            {product.size_stock?.length > 0 && (
              <div className="product-size">
                <label>Talla:</label>
                <select
                  value={selectedSize || ''}
                  onChange={(e) => setSelectedSize(Number(e.target.value))}
                >
                  {product.size_stock.map((item) => (
                    <option
                      key={item.size.id}
                      value={item.size.id}
                      disabled={item.stock <= 0}
                    >
                      {item.size.name} {item.stock <= 0 ? '(Agotado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="option">
              <label>Color:</label>
              <div className="color-options">
                {product.colors?.map((color, index) => (
                  <span
                    key={index}
                    className="color-circle"
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="option">
              <label><b>Cantidad</b></label>
              <div className="quantity-input">
                <button className="decrement-button" onClick={decrement}>-</button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  className="quantity-field"
                  readOnly
                />
                <button className="increment-button" onClick={increment}>+</button>
              </div>
            </div>
          </div>

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={product.size_stock?.length > 0 && !selectedSize}
          >
            AGREGAR AL CARRITO
          </button>

          <ul className="product-extra-info">
            <li>📦 Envío gratis a partir de $100.000</li>
            <li>💳 Pago en línea, pago seguro</li>
            <li>🔁 Devoluciones fáciles</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;

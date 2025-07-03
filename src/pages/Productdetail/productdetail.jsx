import { useEffect, useState } from 'react';
import { getProduct } from "../../api/products.api";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import { FaBox, FaCreditCard } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { addToCart, getCart } from '../../api/users.api';
import { useCart } from '../../context/cartcontext';
import Swal from "sweetalert2";
import "./productdetail.css";
import StarRating from '../../components/StarRating/StarRating';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { cartItems, setCartItems } = useCart();
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
        setMainImage(res.data.main_image || res.data.image);

        if (res.data.size_stock?.length > 0) {
          setSelectedSize(res.data.size_stock[0].size.id);
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
      }
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(http://localhost:8000/users/reviews/?product=${id});
        const data = await res.json();

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Respuesta inesperada de /reviews:", data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error cargando reseñas:", error);
        setReviews([]);
      }
    }

    if (id) {
      loadReviews();
    }
  }, [id]);


  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access_token');
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito",
        confirmButtonColor: "#993f6b",
        customClass: {
          confirmButton: 'ok-error-add-product',
        }
      });
      return;
    }

    if (!product || (product.size_stock?.length > 0 && !selectedSize)) return;

    try {
      await addToCart(product.id, quantity, selectedSize);

      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto se ha añadido al carrito",
        confirmButtonColor: "#d63384",
        timer: 2000,
        showConfirmButton: false
      });

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {

      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Inicia sesión para dejar una reseña",
        confirmButtonColor: "#993f6b",
        customClass: {
          confirmButton: 'ok-error-add-product',
        }
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/users/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${token}
        },
        body: JSON.stringify({
          product: product.id,
          rating: userReview.rating,
          comment: userReview.comment
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Detalles del error:", errorData);
        throw new Error('Error enviando reseña');
      }

      Swal.fire({
        title: "¡Gracias!",
        text: "Tu reseña ha sido enviada",
        icon: "success",
        confirmButtonColor: "#303030"
      }).then(() => {
        window.location.reload();
      });

      setUserReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error("Error enviando reseña:", error);
      Swal.fire("Error", "No se pudo enviar tu reseña", "error");
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
                className={thumbnail ${mainImage === product.main_image ? 'active' : ''}}
                onClick={() => setMainImage(product.main_image)}
              />
            )}

            {product.image && product.image !== product.main_image && (
              <img
                src={product.image}
                alt="Miniatura secundaria"
                className={thumbnail ${mainImage === product.image ? 'active' : ''}}
                onClick={() => setMainImage(product.image)}
              />
            )}

            {product.additional_images?.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={Vista adicional ${index + 1}}
                className={thumbnail ${mainImage === img.image ? 'active' : ''}}
                onClick={() => setMainImage(img.image)}
              />
            ))}
          </div>
        </div>

        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>

          {product.average_rating > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StarRating rating={product.average_rating} />
              <span style={{ fontSize: '14px', color: '#555' }}>
                {product.average_rating} / 5
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '14px', color: '#999' }}>Sin calificaciones aún</div>
          )}

          <p className="product-detail-price">${product.price.toLocaleString()}</p>

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

          <div className="review-section">
            <h3>Califica este producto</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: 'pointer',
                      fontSize: '24px',
                      color: star <= userReview.rating ? '#ffc107' : '#ccc'
                    }}
                    onClick={() => setUserReview({ ...userReview, rating: star })}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                placeholder="Escribe tu comentario..."
                value={userReview.comment}
                onChange={(e) =>
                  setUserReview({ ...userReview, comment: e.target.value })
                }
                required
                style={{ width: '100%', height: '100px', marginTop: '10px', borderRadius: '8px', padding: '10px' }}
              />
              <button type="submit" className="add-to-cart-button" style={{ marginTop: '10px' }}>
                Enviar reseña
              </button>
            </form>
            <div className="reviews-list">
              <div
                className="accordion-header"
                onClick={() => setShowReviews((prev) => !prev)}
              >
                <h3>Reseñas de clientes</h3>
                <span className="accordion-icon">
                  {showReviews ? '▲' : '▼'}
                </span>
              </div>

              {showReviews && (
                <div className="accordion-content">
                  {reviews.length === 0 ? (
                    <p style={{ color: '#777' }}>Aún no hay reseñas.</p>
                  ) : (
                    <>
                      {currentReviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="rating-display">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#ccc' }}>★</span>
                            ))}
                          </div>
                          <p style={{ fontStyle: 'italic', marginTop: '4px' }}>"{review.comment}"</p>
                          <p className="review-meta">
                            {new Date(review.created_at).toLocaleDateString()} por <b>{review.user_name}</b>
                          </p>
                        </div>
                      ))}

                      {totalPages > 1 && (
                        <div className="pagination-controls">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              className={page-button ${currentPage === i + 1 ? 'active' : ''}}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <ul className="product-extra-info">
            <li><FaBox /> Envío gratis a partir de $100.000</li>
            <li><FaCreditCard /> Pago en línea, pago seguro</li>
            <li><TfiReload /> Devoluciones fáciles</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
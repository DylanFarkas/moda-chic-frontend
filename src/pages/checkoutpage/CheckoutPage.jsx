import React, { useState } from 'react';
import './CheckoutPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import { useCart } from "../../context/cartcontext";
import { createOrder } from "../../api/users.api";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const { cartItems = [], setCartItems } = useCart();
  const cart = cartItems[0] || { items: [] };

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async () => {
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de confirmar el pedido.',
        confirmButtonColor: '#aaa',
      });
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        ...formData,
        items: cart.items.map(item => ({
          product: item.product_id || item.product,
          size: item.size_id || item.size,
          quantity: item.quantity
        }))
      };

      await createOrder(orderPayload);
      setCartItems([]);

      await Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado!',
        text: 'Tu pedido ha sido enviado correctamente.',
        confirmButtonColor: '#d63384',
        timer: 1500,
        showConfirmButton: false,
      });

      const total = cart.items.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);

      const mensaje =
        'Hola, quiero confirmar el siguiente pedido:\n\n' +
        '*Nombre:* ' + formData.nombre + '\n' +
        '*Email:* ' + formData.email + '\n' +
        '*Teléfono:* ' + formData.telefono + '\n' +
        '*Dirección:* ' + formData.direccion + '\n\n' +
        '*Productos:*\n' +
        cart.items.map(item =>
          `• ${item.product_name} (Talla: ${item.size_name}) x${item.quantity} - $${item.product_price?.toLocaleString() || 0}`
        ).join('\n') +
        '\n\n💵 *Total:* $' + total.toLocaleString() +
        '\n\n✅ Gracias.';

      const mensajeCodificado = encodeURIComponent(mensaje);
      const numeroTienda = "573128601430";
      const urlWhatsApp = `https://wa.me/${numeroTienda}?text=${mensajeCodificado}`;

      window.open(urlWhatsApp, '_blank');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar el pedido. Intenta nuevamente.',
        confirmButtonColor: '#d63384',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-container">
        <h2 className="checkout-title">FINALIZA TU COMPRA</h2>

        <div className="checkout-grid">
          <div className="checkout-form">
            <h3>Datos para el envío</h3>

            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <FiMapPin className="input-icon" />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección de entrega"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            <button onClick={handleOrderSubmit} disabled={loading}>
              {loading ? "Procesando pedido..." : "Confirmar Pedido"}
            </button>
          </div>

          <div className="checkout-cart">
            <h3>Resumen del pedido</h3>
            {cart.items.length > 0 ? (
              <>
                {cart.items.map((item, idx) => (
                  <div key={idx} className="checkout-item">
                    <img src={item.product_image} alt={item.product_name} />
                    <div>
                      <p className="item-name">{item.product_name}</p>
                      <p className="item-detail">Talla: {item.size_name}</p>
                      <p className="item-detail">Cantidad: {item.quantity}</p>
                      <p className="item-price">
                        ${item.product_price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="checkout-total">
                  <span>Total:</span>
                  <strong>
                    ${cart.items
                      .reduce((acc, item) => acc + (item.product_price * item.quantity), 0)
                      .toLocaleString()}
                  </strong>
                </div>
              </>
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
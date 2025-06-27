import React, { useState } from 'react';
import './checkout.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import { useCart } from "../../context/cartcontext";
import { createOrder } from "../../api/users.api";

const CheckoutPage = () => {
  const { cartItems = [], setCartItems } = useCart();
  const cart = cartItems[0] || { items: [] };

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async () => {
    try {
      const orderPayload = {
        ...formData,
        items: cart.items.map(item => ({
          product: item.product_id || item.product,
          size: item.size_id || item.size,
          quantity: item.quantity
        }))
      };

      await createOrder(orderPayload);

      // 🔴 Vaciar el carrito después del pedido
      setCartItems([]);

      alert('Pedido realizado con éxito');

      // Construir mensaje de WhatsApp
      const mensaje = `
Hola, quiero confirmar el siguiente pedido:

👤 *Nombre:* ${formData.nombre}
📧 *Email:* ${formData.email}
📞 *Teléfono:* ${formData.telefono}
📍 *Dirección:* ${formData.direccion}

🛒 *Productos:*
${cart.items.map(item => (
  `• ${item.product_name} (Talla: ${item.size_name}) x${item.quantity} - $${item.product_price?.toLocaleString() || 0}`
)).join('\n')}

✅ Gracias.
      `;

      const mensajeCodificado = encodeURIComponent(mensaje);
      const numeroTienda = "573128601430"; // Reemplaza con tu número de WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroTienda}?text=${mensajeCodificado}`;

      window.open(urlWhatsApp, '_blank');

    } catch (error) {
      console.error(error);
      console.error(error.response?.data);
      alert('Error al realizar el pedido');
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-container">
        <h2 className="checkout-title">Finalizar Compra</h2>

        <div className="checkout-section">
          <div className="checkout-cart">
            <h3>Resumen del pedido</h3>
            {cart && cart.items && cart.items.length > 0 ? (
              cart.items.map((item, idx) => (
                <div key={idx} className="checkout-item">
                  <img src={item.product_image} alt={item.product_name} />
                  <div>
                    <p><strong>{item.product_name}</strong></p>
                    <p>Talla: {item.size_name}</p>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio: ${item.product_price?.toLocaleString() || "0"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>

          <div className="checkout-form">
            <h3>Tus datos</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección de entrega"
              value={formData.direccion}
              onChange={handleInputChange}
            />
            <button onClick={handleOrderSubmit}>Confirmar pedido</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;

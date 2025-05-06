import "./footer.css";

const Footer = () => {
  return (
    <footer className="modachic-footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>INFORMACIÓN</h4>
          <ul>
            <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">PQRS</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>AYUDA</h4>
          <ul>
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Rastrea tu pedido</a></li>
            <li><a href="#">Cambios y devoluciones</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>SÍGUENOS</h4>
          <div className="social-icons">
          <a href="#"><img src="src/assets/images/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="src/assets/images/instagram.png" alt="Instagram" /></a>
          <a href="#"><img src="src/assets/images/whatsapp.png" alt="WhatsApp" /></a>
          </div>
        </div>

        
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Moda Chic Colombia - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;

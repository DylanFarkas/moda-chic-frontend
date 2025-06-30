import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="modachic-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">Quiénes somos</a>
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Ayuda</a>
        </div>

        <div className="footer-socials">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Moda Chic Colombia</p>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase/config";
import logo from "../../assets/images/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

const SITE_KEY = "6LeY7wErAAAAAPNbS-Pip7-ABlTYDtfTSp44nV0F";

const Login = () => {
  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);

  const handleGoogleLogin = async () => {
    if (!captchaValido) {
      alert("Por favor, verifica el reCAPTCHA");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario autenticado:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  };

  const onChangeCaptcha = (value) => {
    console.log("reCAPTCHA completado:", value);
    setCaptchaValido(true);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Login</h2>
          <form className="login-form">
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar Sesión</button>
          </form>

          <button onClick={handleGoogleLogin} className="google-login-btn">
            Iniciar sesión con Google
          </button>

          {/* Contenedor del CAPTCHA */}
          <div className="recaptcha-container">
            <ReCAPTCHA sitekey={SITE_KEY} onChange={onChangeCaptcha} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

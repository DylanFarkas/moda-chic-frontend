import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import { loginUser } from "../../api/users.api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const SITE_KEY = "6LeY7wErAAAAAPNbS-Pip7-ABlTYDtfTSp44nV0F";

const Login = () => {
  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login.js
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaValido) {
      alert("Por favor, verifica el reCAPTCHA");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const data = await loginUser(email, password);
      console.log("Respuesta del backend:", data);

      // Guardar datos del usuario y token en localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access);

      // Redirección según tipo de usuario
      if (data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
      alert("Credenciales incorrectas");
    }
  };


  const onChangeCaptcha = (value) => {
    setCaptchaValido(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="return-btn-container">
        <button onClick={() => navigate("/")} className="return-btn">
          ⬅ Volver
        </button>
      </div>

      <div className="login-container">
        <div className="login-left">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <div className="login-right">
          <div className="login-box">
            <h2>Inicia Sesión</h2>

            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-input-login-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="password-input-login"
                />
                <span className="eye-icon-login" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit">Iniciar Sesión</button>
              <p className="no-account-text"> ¿Aún no tienes cuenta?
                <a className="register-link" onClick={() => navigate('/register')}> Registrate </a>
              </p>
            </form>

            <div className="recaptcha-container">
              <ReCAPTCHA sitekey={SITE_KEY} onChange={onChangeCaptcha} />
            </div>
            <div className="forgot-password">
              <a onClick={() => navigate("/forgot-password")} className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

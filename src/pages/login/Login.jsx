import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo.png";
import { loginUser } from "../../api/users.api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);
      console.log("Respuesta del backend:", data);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access);

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
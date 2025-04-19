import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "../../assets/images/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

const SITE_KEY = "6LeY7wErAAAAAPNbS-Pip7-ABlTYDtfTSp44nV0F";

const Login = () => {
  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👉 Login con email y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!captchaValido) {
      alert("Por favor, verifica el reCAPTCHA");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Redirige dependiendo del correo
      if (user.email === "admin@modachic.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Credenciales incorrectas");
    }
  };

  // 👉 Login con Google
  const handleGoogleLogin = async () => {
    if (!captchaValido) {
      alert("Por favor, verifica el reCAPTCHA");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === "admin@modachic.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error en la autenticación con Google:", error.message);
    }
  };

  const onChangeCaptcha = (value) => {
    setCaptchaValido(true);
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
            <h2>Login</h2>

            {/* ✅ Formulario de login por correo */}
            <form className="login-form" onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Iniciar Sesión</button>
            </form>

            <button onClick={handleGoogleLogin} className="google-login-btn">
              Iniciar sesión con Google
            </button>

            <div className="recaptcha-container">
              <ReCAPTCHA sitekey={SITE_KEY} onChange={onChangeCaptcha} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

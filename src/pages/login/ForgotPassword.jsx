import { useState } from "react";
import { requestPasswordReset } from "../../api/users.api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      alert("Revisa tu correo para restablecer tu contraseña.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al solicitar recuperación.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar instrucciones</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

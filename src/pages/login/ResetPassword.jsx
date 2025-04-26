import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../api/users.api";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(uidb64, token, newPassword);
      alert("¡Contraseña actualizada! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar contraseña.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;

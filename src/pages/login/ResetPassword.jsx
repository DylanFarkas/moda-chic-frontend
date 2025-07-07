import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../api/users.api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseña
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres y un caracter especial.");
      return;
    }

    try {
      await confirmPasswordReset(uidb64, token, newPassword);
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Ahora puedes iniciar sesión",
        confirmButtonColor: "#6F4559",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al cambiar contraseña",
        confirmButtonColor: "#6F4559",
      });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Restablecer contraseña</h2>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="input-reset-password-container">
            <input
              className="input password-input-reset"
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
            <span
              className="eye-icon-reset"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMessage && <p className="reset-error-message">{errorMessage}</p>}

          <button type="submit">Actualizar contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

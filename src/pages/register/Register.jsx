import React, { useState } from 'react';
import { registerUser } from '../../api/users.api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from "../../assets/images/logo.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setMessage("La contraseña debe tener al menos 6 caracteres y un caracter especial.");
      return;
    }

    try {
      await registerUser(formData);

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente.',
        confirmButtonText: 'Iniciar sesión',
        confirmButtonColor: '#6F4559',
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      setMessage("Error al registrarse.");
    }
  };

  return (
    <>
      <div className="return-btn-register-container">
        <button onClick={() => navigate('/')} className="return-register-btn">⬅ Volver</button>
      </div>

      <div className="register-container">
        <div className="register-left">
          <img src={logo} alt="Logo" className="register-logo" />
        </div>

        <div className="register-right">
          <div className="register-box">
            <h2> Crear Cuenta </h2>

            <form className="register-form" onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} className="input" required />
              <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} className="input" required />

              <div className="password-input-register-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  onChange={handleChange}
                  className="input password-input-register"
                  required
                />
                <span className="eye-icon-register" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit"> Registrarse </button>
              {message && <p className="register-error-message">{message}</p>}
              <p className="account-login">
                ¿Ya tienes Cuenta?
                <a className="login-link" onClick={() => navigate('/login')}> Iniciar Sesión </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
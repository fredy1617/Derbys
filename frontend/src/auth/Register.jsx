import React, {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const { register, error, successMessage, clearErrorsAndMessages } = useAuth();
  const navigate = useNavigate();


  const handleGoToLogin = () => {
    clearErrorsAndMessages(); // Limpia errores antes de navegar
    navigate('/login'); // Navega a la página de inicio de sesión
  };

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrorsAndMessages(); // Limpia los errores antes de registrar
    try {
      await register(formData);
    } catch (error) {
      console.error('Error durante el registro', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-yellow-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-6">
          {/* Logo */}
          <a href="/">
            <img className="mx-auto w-24 h-14" src="/img/LogoDerby.png" alt="Logo" />
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-warning-600">Nuevo Usuario</h2>
        {error && (
          <div className="mt-4 text-red-500 font-bold text-center">
            {Object.keys(error).map((key) => (
              <p key={key}>{error[key][0]}</p>
            ))}
          </div>
        )}
        {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brown-600 font-semibold mb-2" htmlFor="name">*Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChangeInputs}
              className="w-full px-3 py-2 border rounded-lg text-brown-800"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-brown-600 font-semibold mb-2" htmlFor="lastname">*Apellidos</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChangeInputs}
              className="w-full px-3 py-2 border rounded-lg text-brown-800"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-brown-600 font-semibold mb-2" htmlFor="email">*Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChangeInputs}
              className="w-full px-3 py-2 border rounded-lg text-brown-800"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-brown-600 font-semibold mb-2" htmlFor="password">*Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChangeInputs}
              className="w-full px-3 py-2 border rounded-lg text-brown-800"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-brown-600 font-semibold mb-2" htmlFor="password_confirmation">*Confirmar Contraseña</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChangeInputs}
              className="w-full px-3 py-2 border rounded-lg text-brown-800"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 font-bold text-warning-900 p-2 rounded">
            Registrarse
          </button>
        </form>
        <p className="text-base text-[#adadad] mt-5 text-center">
            Ya eres miembro? 
            <button
              onClick={handleGoToLogin}
              className="ml-4 font-bold text-warning-600 hover:underline"
            >
              Iniciar sesión
            </button>
        </p>
      </div>
    </div>
  );
};

export default Register;

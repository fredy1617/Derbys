import React, {  useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importar useAuth
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearErrorsAndMessages } = useAuth();
  const navigate = useNavigate();

  const handleGoToRegister = () => {
    clearErrorsAndMessages(); // Limpia errores antes de navegar
    navigate('/register'); // Navega a la página de inicio de sesión
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrorsAndMessages(); // Limpia los errores antes de iniciar sesión
    try {
      await login(email, password); // Intenta iniciar sesión
      navigate('/home'); // Redirige a la página principal
    } catch (error) {
      // El error ya se maneja en AuthContext, no es necesario volver a manejarlo aquí
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

        <h2 className="text-2xl font-bold mb-6 text-warning-600 text-center">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 font-bold text-center">
            {error.includes('Email') && <p className="text-red-500">Email not found</p>}
            {error.includes('password') && <p className="text-red-500">Invalid password</p>}
            {!error.includes('Email') && !error.includes('password') && <p className="text-red-500">{error}</p>}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 p-2 w-full border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 p-2 w-full border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 font-bold text-warning-900 p-2 rounded">
            Login
          </button>
        </form>
        <p className="text-base text-[#adadad] mt-5 text-center">
            No eres miembro todavía? 
            <button
              onClick={handleGoToRegister}
              className="ml-4 font-bold text-warning-600 hover:underline"
            >
              Registarse
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('session/TOKEN API');
    if (token) {
      axios.get('/user', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setCurrentUser(response.data);
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('session/TOKEN API');
          navigate('/login');
        });
    }
  }, [navigate]);



  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      setCurrentUser(response.data.user);
      localStorage.setItem('session/TOKEN API', response.data.token); // Guarda el token
      setUser(response.data.user); // Actualiza el estado del usuario
      setError(null); // Limpia los errores
      navigate("/home"); // Redirige a la página de inicio
    } catch (error) {
      setCurrentUser(null);
      if (error.response) {
        setError(error.response.data.message); // Establece el mensaje de error
      } else {
        setError('An unexpected error occurred');
      }
      throw error; // Lanza el error para manejarlo en el componente
    }
  };
  

  const register = async (data) => {
    try {
      const response = await axios.post("/register", data);
      setSuccessMessage('Registro exitoso');
      navigate("/login"); // Redirige al login solo si el registro es exitoso
    } catch (e) {
      if (e.response && e.response.status === 422) {
        setError(e.response.data);
      } else {
        setError({ general: ['Error inesperado'] });
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('session/TOKEN API')}` }
      });
      setUser(null);
      setCurrentUser(null);
      localStorage.removeItem('session/TOKEN API'); // Elimina el token
      navigate('/login'); // Redirige al login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };  

  const clearErrorsAndMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, currentUser, error, successMessage, clearErrorsAndMessages }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

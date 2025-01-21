// src/App.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateDerbyForm from './pages/CreateDerbyForm';
import Derbys from './pages/Derbys';
import DetailsDerby from './pages/DetailsDerby';
import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './layouts/Navbar';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './layouts/LaddunnPage';
import Users from './pages/Users';

const ProtectedRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/home" /> : <LandingPage />} />
      <Route path="/login" element={currentUser ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/home" /> : <Register />} />
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/create" element={<ProtectedRoute element={<CreateDerbyForm />} />} />
      <Route path="/listDerbys" element={<ProtectedRoute element={<Derbys />} />} />
      <Route path="/detailsDerby/:id" element={<ProtectedRoute element={<DetailsDerby />} />} />
      <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
    </Routes>
  );
};

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App bg-slate-100 min-h-full h-full">
      {currentUser && <Navbar />}
      <AppRoutes />
    </div>
  );
}

export default App;

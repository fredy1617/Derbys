import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <a href="/" className="flex items-center">
                  <img className="mx-auto w-24 h-14 md:ml-10" src="/img/LogoDerby.png" alt=""/>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigate('/login')}
                className="text-gray-800 font-bold hover:text-yellow-500"
              >
                Inicio de Sesión
              </button>
              <button
                onClick={() => handleNavigate('/register')}
                className="text-gray-800 font-bold hover:text-yellow-500"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-2">
        <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
          {/* Sección LOGO */}
          <img src='/img/LogoDerby.png' alt="Logo" className="mx-auto w-48 h-30 md:w-96 md:h-60" />
          {/* Sección "Quiénes Somos" */}
          <section id="quienes-somos" className="my-12">
            <h2 className="text-3xl font-bold text-center text-brown-600 mb-6">¿Quiénes Somos?</h2>
            <p className="text-lg text-justific">
              Somos una empresa nueva y estamos desarrollando un sistema innovador pensado especialmente para ti. 
              Con nuestro sistema, podrás gestionar y organizar tus cotejos de peleas de gallos de manera sencilla 
              y eficiente. Solo necesitas una laptop con acceso a internet.
            </p>
            <p className="text-lg text-justific mt-3">
              Con nuestra plataforma, tendrás la libertad de crear y administrar tus derbys a tu gusto, 
              facilitando todo el proceso y asegurando una experiencia sin complicaciones.
            </p>
          </section>

          {/* Sección "Cómo Funciona" */}
          <section id="como-funciona" className="my-12">
            <h2 className="text-3xl font-bold text-center text-brown-600 mb-6">¿Cómo Funciona?</h2>
            <ol className="text-lg list-decimal list-inside">
              <li>
                Paso 1: Creas tu derby especificando la tolerancia y el número de gallos. 
                Aquí puedes poner los gallos que quieras, aunque lo más común es 3.
              </li>
              <li className="mt-3">
                Paso 2: Registras los partidos, pudiendo añadir todos los partidos que desees. 
                El sistema te pedirá el número de gallos que colocaste en tu derby.
              </li>
              <li className="mt-3">
                Paso 3: Generas el rol de enfrentamientos de manera automática con un click.
              </li>
              <li className="mt-3">
                Paso 4: Podrás descargar un PDF con las peleas, registrar si hay un ganador 
                y generar una tabla de posiciones.
              </li>
            </ol>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          &copy; {new Date().getFullYear()} Derbys A&J. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

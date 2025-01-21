import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext'; // Importar useAuth
import { useDispatch, useSelector } from 'react-redux';
import { updateDerbys } from '../store';

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const dispatch = useDispatch();
  const notify_derbys = useSelector((state) => state.notify_derbys); 

  useEffect(() => {
    if (user) {
      dispatch(updateDerbys(user.derbys)); 
    }
  }, [user, dispatch]);
  
  return (
    <nav className="bg-black text-gold">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <a href="/home" className="flex items-center">
            <img className="mx-auto w-24 h-14 md:ml-10" src="/img/LogoDerby.png" alt=""/>
        </a>

        {/* Opciones de navegación */}
        <ul className="md:flex space-x-4 hidden">
          {user.rol == 'Administrador' && (
            <li>
              <Link to="/users" className="hover:underline text-white flex items-center mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round"  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <span>Usuarios</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/create" className="hover:underline text-white flex items-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Nuevo Derby</span>
            </Link>
          </li>
          <li>
            <Link to="/listDerbys" className="hover:underline text-white flex items-center mt-3 mr-3 ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <span>Mis Derbys</span>
            </Link>
          </li>
          <li>
          {user ? (
                <>          
                <Menu as="div" className="relative inline-block text-left">
                  <div> 
                    <Menu.Button className="inline-flex w-full justify-center rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <span
                        className={`absolute -top-1 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                          notify_derbys < 1 ? 'bg-red-600' : 'bg-green-600'
                        }`}
                      >
                        {notify_derbys}
                      </span>
                      <img src={user.avatar? user.avatar : '/img/avatar.png'} className="w-10 rounded-full shadow-lg" alt="Avatar" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-11 ml-1 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd" />
                      </svg>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                              <img src={user.avatar? user.avatar : '/img/avatar.png'} className="w-7 rounded-full shadow-lg flex " alt="Avatar" />                            
                              <span>{user?.name}</span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} font-bold ${notify_derbys < 1 ? 'text-red-600' : 'text-green-600'} flex justify-between w-full px-4 text-sm leading-5 text-right`}>
                              <span className="ml-auto">Derbys disponibles: {notify_derbys}</span>
                            </a>
                          )}
                        </Menu.Item>                       
                        <hr></hr>                        
                        <Menu.Item>
                          {({ active }) => (
                            <a href="#" onClick={logout} className={`${ active ? 'bg-gray-100 text-gray-900' : 'text-gray-700' } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                              </svg>
                              Cerrar sesión                      
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="block rounded py-2 pr-4 pl-3 text-white" aria-current="page" >
                      Iniciar sesión
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="block rounded py-2 pr-4 pl-3 text-white" aria-current="page" >
                      Registrar
                    </Link>
                  </li>
                </>
              )}
          </li>         
        </ul>
        {/* Menú desplegable para dispositivos móviles */}
        <div className="md:hidden flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div> 
                <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <span
                        className={`absolute -top-1 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                          notify_derbys < 1 ? 'bg-red-600' : 'bg-green-600'
                        }`}
                      >
                        {notify_derbys}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95" >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button" 
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                            <path fillRule="evenodd" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" clipRule="evenodd" />
                          </svg>
                          <span>{user?.firstname} {user?.lastname}</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} font-bold ${notify_derbys < 1 ? 'text-red-600' : 'text-green-600'} flex justify-between w-full px-4 text-sm leading-5 text-right`}>
                          <span className="ml-auto">Derbys disponibles: {notify_derbys}</span>
                        </a>
                      )}
                    </Menu.Item>   
                    <hr></hr>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/create"
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Nuevo Derby
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link 
                          to="/listDerbys" 
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                          </svg>
                          Mis Derbys                                                    
                        </Link>
                      )}
                    </Menu.Item>
                    <hr></hr>
                    
                    <Menu.Item>
                          {({ active }) => (
                            <a href="#" onClick={logout} className={`${ active ? 'bg-gray-100 text-gray-900' : 'text-gray-700' } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                              </svg>
                              Cerrar sesión                      
                            </a>
                          )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react'
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
        const response = await axios.get(`/users`);
        setUsers(response.data);
        } catch (e) {
        console.log(e);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
          value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    ); 

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(`/users/${id}`, { active: newStatus });
            alert(response.data.message);
            fetchData(); // Refrescar la lista de usuarios
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="mx-auto container p-8">
          <h1 className="text-3xl font-bold text-warning-900">Usuarios</h1>
          <div className="mb-3">
            <div className="mb-4 flex w-full flex-wrap items-stretch">
              <input
                type="search" value={searchTerm} onChange={handleSearchChange}
                className="mt-6 ml-6 px-5 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full md:w-96 pl-10 "
                placeholder="Buscar (N°, Nombre, Email, Rol)" aria-label="Search" aria-describedby="button-addon2" />
              <span
                className="input-group-text flex items-center whitespace-nowrap rounded px-5 py-2.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                id="basic-addon2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-6 h-6 w-6">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-5">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead
                      className="border-b bg-neutral-400 font-medium dark:border-neutral-500 dark:text-neutral-800">
                      <tr>
                        <th scope="col" className="px-6 py-4">N°</th>
                        <th scope="col" className="px-6 py-4">Nombre</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Rol</th>
                        <th scope="col" className="px-6 py-4 text-blue-700">Derbys</th>
                        <th scope="col" className="px-6 py-4">Estatus</th>
                        <th scope="col" className="px-6 py-4">Realizar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b bg-white dark:border-neutral-500 dark:bg-neutral-600">
                          <td className="whitespace-nowrap px-6 py-2">{user.id}</td>
                          <td className="whitespace-nowrap px-6 py-2" style={{ whiteSpace: 'pre-wrap' }}>{user.name+' '+user.lastname}</td>
                          <td className="whitespace-nowrap px-6 py-2" style={{ whiteSpace: 'pre-wrap' }}>{user.email}</td>
                          <td className="whitespace-nowrap px-6 py-2">{user.rol}</td>
                          <td className={`whitespace-nowrap px-6 py-2 font-bold ${user.derbys < 1 ? 'text-red-600' : 'text-green-600'}`} style={{ whiteSpace: 'pre-wrap' }}>
                            Disponibles: {user.derbys}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2">
                            <button className={`font-bold py-2 px-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-600'} hover:text-white`}
                                onClick={() => updateStatus(user.id, !user.active)}>
                                {user.active ? 'ON' : 'OFF'}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-2">
                            <Link to={`/payments/${user.id}`} className='btn bg-warning-700 hover:bg-warning-800 text-white font-bold py-2 px-2 rounded-md flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                </svg>
                                Pagos
                            </Link>
                          </td>
                        </tr>        
                      ))}                     
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>       
        </div>      
      );
}

export default Users
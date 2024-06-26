import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Groups = ({ onClose, derbyId  }) => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [derbyMatches, setDerbyMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchMatches(); // Agregar esta llamada para obtener los partidos del derby
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`/matches/${derbyId}`);
      setDerbyMatches(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`/groups/${derbyId}`);
      setGroups(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddGroup = async () => {
    console.log('AQIO');
    try {
      const response = await axios.post('/groups', { name: groupName, derby_id: derbyId, matches: selectedMatches });
      fetchGroups();
      setGroupName('');
      setSelectedMatches([]);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditGroup = async () => {
    try {
      const response = await axios.put(`/groups/${selectedGroup.id}`, { name: groupName, matches: selectedMatches });
      const updatedGroups = groups.map(group => (group.id === selectedGroup.id ? response.data : group));
      setGroups(updatedGroups);
      setSelectedGroup(null);
      setGroupName('');
      setSelectedMatches([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMatchChange = (e, matchId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedMatches([...selectedMatches, matchId]);
    } else {
      setSelectedMatches(selectedMatches.filter(id => id !== matchId));
    }
  };

  return (
    <div className="modal">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-3/4"> 
          <span className="close absolute top-2 right-2 text-gray-600 cursor-pointer" onClick={onClose}>&times;</span>
          <h2 className="text-xl font-bold mb-4">Grupos</h2>
          <ul>
            {groups.map(group => (
              <li key={group.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                <span>{group.name}</span>
                <div className="space-x-2">
                  <button onClick={() => setSelectedGroup(group)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDeleteGroup(group.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddGroup} className="mt-4">
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Nombre del grupo"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <div className="flex flex-col space-y-2">
                <label className="font-semibold">Selecciona los partidos:</label>
                {derbyMatches.map(match => (
                    <div key={match.id} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`match-${match.id}`}
                        value={match.id}
                        checked={selectedMatches.includes(match.id)}
                        onChange={(e) => handleMatchChange(e, match.id)}
                        className="mr-2"
                    />
                    <label htmlFor={`match-${match.id}`}>{match.name}</label>
                    </div>
                ))}
            </div>
            <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
          </form>
          <div className="flex flex-col container mb-10">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light border border-gray-300">
                      <thead className="bg-neutral-400 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200">
                        <tr>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">N°</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Grupo</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Partidos</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map((group, index) => (
                          <tr key={group.id} className="bg-white dark:bg-neutral-700">
                            <td className="px-6 py-4 font-bold border-b border-gray-300">{index + 1}</td>
                            <td className="px-6 py-4 font-bold border-b border-gray-300">{group.name}</td>
                            <td className="px-6 py-4 border-b border-gray-300">
                              <ul>
                                {group.matches ? (
                                  group.matches.map((match, index) => (
                                    <li key={index}><b><b>{match.name}</b></b></li>
                                  ))
                                ) : (
                                  <li>No hay partidos registrados para este grupo</li>
                                )}
                              </ul>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-300">
                              <button onClick={() => handleEditClick(group)} className="bg-neutral-900 hover:bg-neutral-700  font-bold text-white rounded p-2 mr-2">Editar</button>
                              <Link onClick={() => deletegroup(group.id)} className='btn bg-red-600 hover:bg-red-800 text-white font-bold p-2.5 mr-2 rounded'>Borrar</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          <button onClick={onClose} className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default Groups;

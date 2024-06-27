import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link, useParams } from 'react-router-dom';

const DetailsDerby = () => {
  const [derbyDetails, setDerbyDetails] = useState({});
  const [rounds, setRound] = useState([]);
  const [matches, setMatches] = useState([]);
  const { id } = useParams();
  const [newMatchData, setNewMatch] = useState({ derby_id: id, roosters: [] });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editedMatchData, setEditedMatchData] = useState({ name: '', roosters: [] });
  // Estado para controlar la visibilidad del modal de Grupos
  const [modalVisible, setModalVisible] = useState(false);
  // Nuevo estado y funciones para la edición de grupos
  const [editModalGroup, setEditModalGroup] = useState(false);
  const [editedGroupData, setEditedGroupData] = useState({ name: '', matches: [] });
  
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedMatches, setSelectedMatches] = useState([]);


  useEffect(() => {
    fetchDerbyDetails();
    fetchGroups();
    fetchMatches();
    fetchRol();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`/groups/${id}`);
      setGroups(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRol = async () => {
    try {
      const response = await axios.get(`/roles/${id}`);      
      setRound(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDerbyDetails = async () => {
    try {
      const response = await axios.get(`/derbys/${id}`);
      setDerbyDetails(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`/matches/${id}`);
      setMatches(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    addMatch(newMatchData);
  };

  const addMatch = async (newMatchData) => {
    try {
      await axios.post("/matches", newMatchData);
      fetchMatches();
      setNewMatch({ derby_id: id, name: '', roosters: [] }); // Reset the form
    } catch (e) {
      if (e.response && e.response.status === 400) {
        alert(e.response.data.error);
      }else{
        alert('Error al registrar el partido');
      }  
    }
  };

  const handleRoosterChange = (index, field, value) => {
    const updatedRoosters = [...newMatchData.roosters];
    updatedRoosters[index] = { ...updatedRoosters[index], [field]: value, name: `Gallo N°${index + 1}` };
    setNewMatch({ ...newMatchData, roosters: updatedRoosters });
  };

  const handleGenerateRounds = async (id) => {
    const answer = window.confirm(`
      ¡ADVERTENCIA!

      ¿Estás seguro de crear las rondas (Enfrentamientos)?
      
      Si ya hay una ronda creada anteriormente, se borrarán las 
      peleas (Enfrentamientos) y se crearán unas nuevas.
    `);
    if (answer) {
      try {
        const response = await axios.post('/roles', {id: id});
        alert (response.data.message);
        fetchRol();
      } catch (e) {
        alert('Error al generar el rol'); 
      }
    }
  };

  const handleGenerateMatchsPDF = async (id) => {
    try {
      const response = await axios.get(`/generate-pdf-matches/${id}`, {
         responseType: 'blob',
      });
      const pdfUrl = URL.createObjectURL(response.data);
      alert("Imprimiendo PDF de los partidos . . .");
      window.open(pdfUrl, '_blank');
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const handleGenerateRolPDF = async (id) => {
    try {
      const response = await axios.get(`/generate-pdf-rol/${id}`, {
         responseType: 'blob',
      });
      const pdfUrl = URL.createObjectURL(response.data);
      alert("Imprimiendo PDF del Rol (enfrentamientos) . . .");
      window.open(pdfUrl, '_blank');
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setEditedMatchData({ ...match });
    setEditModalVisible(true);
  };
  
  const handleCloseModalEditMatch = () => {
    setEditedMatchData({ ...selectedMatch });
    setEditModalVisible(false);
  };

  const handleModalGroupClick = () => {
    fetchGroups();
    setModalVisible(true);
  };
  
  const handleCloseModalGroup = () => {
    setModalVisible(false);
  };

  const handleEditMatch = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`/matches/${editedMatchData.id}`, editedMatchData );
        fetchMatches(); // Refrescar la lista de partidos
        setEditModalVisible(false);
    } catch (error) {
        console.error(error);
        alert('Error al editar la el partido');
    }
  };

  const deleteMatch = async (id_match) => {
    const answer = window.confirm(`¿Desea eliminar el partido de la lista?`);
    if (answer) {
      try {
        const response = await axios.delete(`/matches/${id_match}`);
        alert(response.data.message);
        fetchMatches();
      } catch (error) {
        console.error(error);
      }
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

  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/groups', { name: groupName, derby_id: id, matches: selectedMatches });
      fetchGroups();
      setGroupName('');
      setSelectedMatches([]);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        alert(e.response.data.error);
      }else{
        alert('Error al registar el grupo');
      } 
    }  
  };

  // Función para abrir el modal de edición de grupos
  const handleEditGroupClick = (group) => {
    setEditedGroupData({ ...group });
    setEditModalGroup(true);
  };

  // Función para cerrar el modal de edición de grupos
  const handleCloseModalEditGroup = () => {
    setEditedGroupData({ name: '', matches: [] });
    setEditModalGroup(false);
  };

  // Función para actualizar la información del grupo editado
  const handleEditGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/groups/${editedGroupData.id}`, editedGroupData);
      fetchGroups(); // Refrescar la lista de grupos
      handleCloseModalEditGroup(); // Cerrar el modal de edición
    } catch (e) {
      if (e.response && e.response.status === 400) {
        alert(e.response.data.error);
      }else{
        alert('Error al editar el grupo');
      }       
    }
  };

  const deleteGroup = async (id_group) => {
    const answer = window.confirm(`¿Desea eliminar el grupo de la lista?`);
    if (answer) {
      try {
        const response = await axios.delete(`/groups/${id_group}`);
        alert(response.data.message);
        fetchGroups(); // Llama a fetchGroups
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!derbyDetails) return <div>Loading...</div>;

  return (
    <div className="mx-auto container p-8">
      <h1 className="text-3xl font-bold text-warning-900">Detalles del Derby: {derbyDetails.name}</h1>
      <div className="rounded-lg bg-neutral-100 p-8 text-neutral-800 shadow-lg dark:bg-neutral-600 dark:text-neutral-200 dark:shadow-black/30"> 
        <div className="flex flex-wrap">
          <div className= 'flex w-full md:w-1/3 text-xl font-semibold md:mb-4'>Fecha:  {derbyDetails.date}</div>
          <div className= 'flex w-full md:w-1/3 font-semibold md:mb-4'>Entrada: ${derbyDetails.money} MXN</div>
          <hr className='flex w-full md:mb-4'></hr>
          <div className= 'flex w-full md:w-1/4 font-semibold'>N° Gallos: {derbyDetails.no_roosters} Gallos</div>
          <div className= 'flex w-full md:w-1/4 font-semibold'>Tolerancia: {derbyDetails.tolerance}g</div>
          <div className= 'flex w-full md:w-1/4 font-semibold'>Peso Min: {derbyDetails.min_weight}g</div>
          <div className= 'flex w-full md:w-1/4 font-semibold'>Peso Max: {derbyDetails.max_weight}g</div>
        </div>    
      </div>    
      {
        // =============   MENU DE TABS ===============
      }
      <div className='w-full md:w-auto'>
        <ul className="mb-2 flex list-none  border-b-0 pl-0 flex-row"
            role="tablist" data-te-nav-ref>
            <li role="presentation" className="flex-grow w-1/2 md:basis-0 text-center">
            <a href="#tabs-matches"
                className="my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-7 pt-4 pb-3.5 text-xs font-medium uppercase leading-tight text-neutral-600 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                data-te-toggle="pill" data-te-target="#tabs-matches" data-te-nav-active role="tab" aria-controls="tabs-matches" aria-selected="true">
                <b>PARTIDOS</b>
            </a>
            </li>
            <li role="presentation"  className="flex-grow w-1/2 md:basis-0 text-center">
            <a href="#tabs-f-05-05"
                className="focus:border-transparen my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-7 pt-4 pb-3.5 text-xs font-medium uppercase leading-tight text-neutral-600 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                data-te-toggle="pill" data-te-target="#tabs-f-05-05" role="tab" aria-controls="tabs-f-05-05" aria-selected="false">
                <b>ROL</b>
            </a>
            </li>
        </ul>
      </div>
      <div className="mb-6 w-full">
        {

          //    =============== CONTENIDO TAB DE MATCHES =================
        }
        <div className="hidden opacity-0 opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
          id="tabs-matches" role="tabpanel" aria-labelledby="tabs-matches-tab" data-te-tab-active>
          <h1 className="text-xl font-bold text-warning-900 mb-4">Agregar un partido:</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newMatchData.name || ''}
                name='name'
                onChange={(event) => setNewMatch({ ...newMatchData, name: event.target.value })}
                placeholder="Nombre del Partido"
                className="w-full md:w-1/3 border-2 border-gray-300 p-2 mr-5 rounded-md"
                required
              />
              <div className="flex flex-wrap">
                {[...Array(derbyDetails.no_roosters)].map((_, index) => (
                  <div key={index} className="w-full md:w-1/3 p-2">
                    <label htmlFor={`rooster-ring-${index}`} className="block mb-1 font-bold">Gallo N°{index + 1}</label>
                    <input
                      type="text"
                      id={`rooster-ring-${index}`}
                      onChange={(event) => handleRoosterChange(index, 'ring', event.target.value)}
                      placeholder="Anillo del Gallo"
                      className="w-full border-2 border-gray-300 p-2 rounded-md"
                      value={newMatchData.roosters[index]?.ring || ''}
                      required
                    />
                    <label htmlFor={`rooster-weight-${index}`} className="block mt-2 mb-1">Peso del Gallo (ej: 2300g)</label>
                    <input
                      type="number"
                      id={`rooster-weight-${index}`}
                      onChange={(event) => handleRoosterChange(index, 'weight', event.target.value)}
                      placeholder="Peso del Gallo"
                      className="w-full border-2 border-gray-300 p-2 rounded-md"
                      value={newMatchData.roosters[index]?.weight || ''}
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 justify-items-stretch">
                <div className="justify-self-end flex justify-center items-center px-4 py-2 ">            
                  <button type="submit" className="btn bg-neutral-900 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded flex-end">Agregar Partido  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold">Partidos:</h2>
            <div className="grid grid-cols-1 justify-items-stretch">
                <div className="justify-self-end flex justify-center items-center px-4 py-2 "> 
                  <button onClick={handleModalGroupClick} className="bg-yellow-600 hover:bg-yellow-800 text-white rounded p-2 mr-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    Grupos
                  </button>
                  <button onClick={() => handleGenerateRounds(id)} className="bg-blue-500 hover:bg-blue-700 text-white rounded p-2 mr-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    Generar Rol
                  </button>
                  <button onClick={() => handleGenerateMatchsPDF(id)} className="bg-gray-500 hover:bg-gray-700 text-white rounded p-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Descargar PDF
                  </button>
                </div>
            </div>
            <div className="flex flex-col container mb-10">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light border border-gray-300">
                      <thead className="bg-neutral-400 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200">
                        <tr>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">N°</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Partido</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Gallos</th>
                          <th scope="col" className="px-6 py-4 border-b border-gray-300">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map((match, index) => (
                          <tr key={match.id} className="bg-white dark:bg-neutral-700">
                            <td className="px-6 py-4 font-bold border-b border-gray-300">{index + 1}</td>
                            <td className="px-6 py-4 font-bold border-b border-gray-300">{match.name}</td>
                            <td className="px-6 py-4 border-b border-gray-300">
                              <ul>
                                {match.roosters ? (
                                  match.roosters.map((rooster, index) => (
                                    <li key={index}><b><b>{rooster.name}</b></b> - Anillo: {rooster.ring}, Peso: {rooster.weight}</li>
                                  ))
                                ) : (
                                  <li>No hay gallos registrados para este partido</li>
                                )}
                              </ul>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-300">
                              <button onClick={() => handleEditClick(match)} className="bg-neutral-900 hover:bg-neutral-700  font-bold text-white rounded p-2 mr-2">Editar</button>
                              <Link onClick={() => deleteMatch(match.id)} className='btn bg-red-600 hover:bg-red-800 text-white font-bold p-2.5 mr-2 rounded'>Borrar</Link>
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
        </div>
        {
          //   =============== CONTENIDO TAB DE ROLE ==============
        }
        <div className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
          id="tabs-f-05-05" role="tabpanel" aria-labelledby="tabs-f-05-05-tab">
          <h1 className='text-2xl text-sky-900'><b>ROL (ENFRENTAMIENTOS):</b></h1>
          <div className="grid grid-cols-1 justify-items-stretch">
            <div className="justify-self-end flex justify-center items-center px-2 py-2 ">
              <button onClick={() => handleGenerateRolPDF(id)} className="bg-gray-800 hover:bg-gray-700 text-white rounded p-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Descargar PDF
              </button>
            </div>
          </div>
          <h1 className='text-sm text-yellow-800'><b>NOTA: Si en la ultima ronda existe una pelea subrayada en azul y los partidos, anillos y pesos son iguales eso significa que es una pelea con un gallo extra</b></h1>
          {/* Ciclo para generar rondas según derby.no_rooster */}
          {Array.from({ length: derbyDetails.no_roosters }).map((_, index) => (
            <div key={index}>
              <h3 className='mt-5 text-xl '><b>RONDA N° {index + 1} </b></h3>
              <div className="flex flex-col container mb-10">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-left text-sm font-light border border-gray-300">
                        <thead className="bg-neutral-400 dark:bg-neutral-600 dark:text-neutral-200">
                          <tr>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '5%' }}>N°</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '10%' }}>Peso</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '10%' }}>Anillo</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300 w-25 bg-green-400" style={{ width: '25%' }}>Nombre Partido Verde</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '5%' }}></th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300 w-25 bg-red-400" style={{ width: '25%' }}>Nombre Partido Rojo</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '10%' }}>Peso</th>
                            <th scope="col" className="px-6 py-4 border-b border-gray-300" style={{ width: '10%' }}>Anillo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rounds.filter(round => round.ronda === index + 1).map((round, i) => (
                            <tr key={round.id} className={`border-b bg-white dark:border-neutral-500 ${round.gallo2.ring === round.gallo1.ring ? 'bg-blue-200' : ''}`}>
                              <td className="whitespace-nowrap px-6 py-2">{i + 1}</td>
                              <td className="whitespace-nowrap px-6 py-2">{round.gallo1.weight}g</td>
                              <td className="whitespace-nowrap px-6 py-2">{round.gallo1.ring}</td>
                              <td className="whitespace-nowrap px-6 py-2 font-bold text-green-700 text-right"  style={{ whiteSpace: 'pre-wrap' }}>{round.gallo1.match_name}</td>
                              <td className="whitespace-nowrap px-6 py-2 font-bold">VS</td>
                              <td className="whitespace-nowrap px-6 py-2 font-bold text-red-600"  style={{ whiteSpace: 'pre-wrap' }}>{round.gallo2.match_name}</td>
                              <td className="whitespace-nowrap px-6 py-2">{round.gallo2.weight}g</td>
                              <td className="whitespace-nowrap px-6 py-2">{round.gallo2.ring}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Aquí termina el ciclo */}


        </div>
      </div>
      {editModalVisible && selectedMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Editar Partido: {selectedMatch.name}</h2>
            <hr />
            <form className="mt-4" onSubmit={handleEditMatch}>
              <div className="mb-4">
                <label className="block text-l font-semibold mb-1" htmlFor="match_name">Nombre del Partido:</label>
                <input
                  type="text"
                  id="match_name"
                  value={editedMatchData.name}
                  onChange={(e) => setEditedMatchData({ ...editedMatchData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-wrap">
                {editedMatchData.roosters.map((rooster, index) => (
                  <div key={index} className="w-full md:w-1/3 p-2">
                    <label htmlFor={`rooster-ring-${index}`} className="block mb-1 font-bold">Gallo N°{index + 1}</label>
                    <input
                      type="text"
                      id={`rooster-ring-${index}`}
                      value={rooster.ring}
                      onChange={(event) => {
                        const updatedRoosters = [...editedMatchData.roosters];
                        updatedRoosters[index].ring = event.target.value;
                        setEditedMatchData({ ...editedMatchData, roosters: updatedRoosters });
                      }}
                      placeholder="Anillo del Gallo"
                      className="w-full border-2 border-gray-300 p-2 rounded-md"
                      required
                    />
                    <label htmlFor={`rooster-weight-${index}`} className="block mt-2 mb-1">Peso del Gallo (ej: 2300g)</label>
                    <input
                      type="number"
                      id={`rooster-weight-${index}`}
                      value={rooster.weight}
                      onChange={(event) => {
                        const updatedRoosters = [...editedMatchData.roosters];
                        updatedRoosters[index].weight = event.target.value;
                        setEditedMatchData({ ...editedMatchData, roosters: updatedRoosters });
                      }}
                      placeholder="Peso del Gallo"
                      className="w-full border-2 border-gray-300 p-2 rounded-md"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModalEditMatch}
                  className="mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-bold rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Grupos */}
      {modalVisible && (
        <div className="modal">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4"> 
            <span className="close absolute top-2 right-2 text-gray-600 cursor-pointer" onClick={handleCloseModalGroup}>&times;</span>
            <h2 className="text-xl font-bold mb-4">Grupos</h2>
            <form onSubmit={handleAddGroup} className="mt-4">
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Nombre del grupo"
                className="border border-gray-300 rounded px-3 py-2 w-full md:1/2"
                required
              />
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">Selecciona los partidos:</label>
                <div className="flex  items-center">
                  {matches.map(match => (
                    <div key={match.id} className="flex items-center w-full md:1/4">
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
              </div>
              <div className="grid grid-cols-1 justify-items-stretch">
                <div className="justify-self-end flex justify-center items-center px-4 py-2 ">            
                  <button type="submit" className="btn bg-neutral-900 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded flex-end">Agregar Grupo  </button>
                </div>
              </div>
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
                                <button onClick={() => handleEditGroupClick(group)} className="bg-neutral-900 hover:bg-neutral-700  font-bold text-white rounded p-2 mr-2">Editar</button>
                                <Link onClick={() => deleteGroup(group.id)} className='btn bg-red-600 hover:bg-red-800 text-white font-bold p-2.5 mr-2 rounded'>Borrar</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 justify-items-stretch">
                <div className="justify-self-end flex justify-center items-center px-4 py-2 ">            
                  <button onClick={handleCloseModalGroup} className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded flex font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Cerrar
                  </button>
                </div>
              </div>            
          </div>
        </div>
      </div>
      )}
      {editModalGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Editar Grupo: {editedGroupData.name}</h2>
            <hr />
            <form className="mt-4" onSubmit={handleEditGroup}>
              <div className="mb-4">
                <label className="block text-l font-semibold mb-1" htmlFor="group_name">Nombre del Grupo:</label>
                <input
                  type="text"
                  id="group_name"
                  value={editedGroupData.name}
                  onChange={(e) => setEditedGroupData({ ...editedGroupData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">Selecciona los partidos:</label>
                <div className="flex  items-center">
                  {matches.map(match => {
                      const isChecked = editedGroupData.matches.some(item => item.id === match.id);
                      return (
                          <div key={match.id} className="flex items-center w-full md:1/4">
                              <input
                                  type="checkbox"
                                  id={`match-${match.id}`}
                                  value={match.id}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const updatedMatches = e.target.checked
                                      ? [...editedGroupData.matches, { id: match.id, pivot: { group_id: editedGroupData.id, match_id: match.id } }]
                                      : editedGroupData.matches.filter(item => item.id !== match.id);
                                    setEditedGroupData({ ...editedGroupData, matches: updatedMatches });
                                  }}
                                  className="mr-2"
                              />
                              <label htmlFor={`match-${match.id}`}>{match.name}</label>
                          </div>
                      );
                  })}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModalEditGroup}
                  className="mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-bold rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsDerby;

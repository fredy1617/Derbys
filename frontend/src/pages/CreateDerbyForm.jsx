import axios from '../api/axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CreateDerbyForm = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
  const day = String(today.getDate()).padStart(2, '0');
  
  const navigate = useNavigate();
    
  const initialDate = `${year}-${month}-${day}`;
    
  const [formData, setFormData] = useState({
    name: `Derby-${initialDate}`,
    date: initialDate,
    money: '',
    no_roosters: '3',
    tolerance: '100',
    min_weight: '1900',
    max_weight: '2500',
  });

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createDerby(formData);
  };

  const createDerby = async (formData) => {
    try {
      const response = await axios.post("/derbys", formData);
      alert (response.data.message);
      navigate('/listDerbys');
    } catch (e) {
      // Puedes manejar el error aquí si es necesario
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Crear Derby</h1>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-wrap'>
          {[
            { name: 'name', label: 'Nombre', type: 'text', value: formData.name },
            { name: 'date', label: 'Fecha', type: 'date', value: formData.date },
            { name: 'money', label: 'Entrada (MXN)', type: 'text', value: formData.money },
            { name: 'no_roosters', label: 'N° Gallos', type: 'number', value: formData.no_roosters },
            { name: 'tolerance', label: 'Tolerancia (g)', type: 'number', value: formData.tolerance },
            { name: 'min_weight', label: 'Peso Min. (g)', type: 'number', value: formData.min_weight },
            { name: 'max_weight', label: 'Peso Max (g)', type: 'number', value: formData.max_weight },
          ].map((field) => (
            <div key={field.name} className="w-full md:w-1/3">
              <label htmlFor={field.name} className="block text-gray-700 font-bold mb-2">{field.label}:</label>                 
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={handleChangeForm}
                  className="w-full md:w-10/12 border-2 border-gray-300 p-2 mr-5 rounded-md"
                  required
                />
            </div>
            ))} 
        </div>
        <div className="grid grid-cols-1 justify-items-stretch mt-4">
          <div className="justify-self-end flex justify-center items-center px-4 py-2 mt-4">  
              <button type="submit" className="btn bg-neutral-900 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded flex-end">Crear Derby  </button>
          </div>
        </div> 
      </form>
    </div>
  );
  
}

export default CreateDerbyForm
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Derbys = () => {
  const [tabContent, setTabContent] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/derbys`);
      setTabContent(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mx-auto container p-8">
      <h1 className="text-3xl font-bold text-warning-900 mb-4">Derbys:</h1>
      <div className="-m-1 flex flex-wrap md:-m-2">
        {tabContent.map(item => (
          <div key={item.id} className="flex w-1/4 flex-wrap">
            <div className="w-full p-1">
              <div className="flex justify-center">
                <div className="block max-w-sm rounded-lg bg-white shadow-lg dark:bg-neutral-700 px-6 py-4">
                  <Link to={`/detaillsUnit/${item.id}`} data-te-toggle="tooltip" title="Click para ver detalles">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-warning-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                      </svg>
                      <h5 className="text-xl font-medium leading-tight text-neutral-900 dark:text-neutral-50 mt-2">
                        {item.name}
                      </h5>
                      <p className="text-s text-neutral-700 dark:text-neutral-200">
                        Rondas: {item.no_roosters} <br />
                        Tolerancia: {item.tolerance} gramos <br />
                        Entrada: ${item.money}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Derbys;

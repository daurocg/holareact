import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectionScreen({ onModuleSelect }) {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta');
      setModules(result.data);
    }

    fetchData();
  }, []);

  const handleChange = event => {
    const selectedModule = modules.find(module => module.modulo === event.target.value);
    onModuleSelect(selectedModule);
  };

  return (
    <select onChange={handleChange}>
      <option value="">--Por favor selecciona--</option>
      {modules.map((module, index) => <option key={index} value={module.modulo}>{module.modulo}</option>)}
    </select>
  );
}
console.log(typeof onModuleSelect); // esto también debería imprimir 'function'

export default SelectionScreen;

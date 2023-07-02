import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SelectionScreen() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta');
      setModules(result.data);
    }

    fetchData();
  }, []);

  return (
    <select>
      <option value="">--Por favor selecciona--</option>
      {modules.map((module, index) => <option key={index} value={module.modulo}>{module.modulo}</option>)}
    </select>
  );
}

export default SelectionScreen;

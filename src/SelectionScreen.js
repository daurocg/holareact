import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

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
if (modules.length === 0) {
  return <p>Cargando...</p>;
}

return (
  <div className="form-group">
    <label>Por favor selecciona un módulo:</label>
    <select className="form-control" onChange={handleChange}>
      <option value="">--Por favor selecciona--</option>
      {modules.map((module, index) => <option key={index} value={module.modulo}>{module.modulo}</option>)}
    </select>
  </div>
);
}

export default SelectionScreen;

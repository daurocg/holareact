import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import { useTranslation } from 'react-i18next'; // Importa useTranslation


function SelectionScreen({ onModuleSelect,language  }) {
  const [modules, setModules] = useState([]);
  const { t } = useTranslation(); // Obtén la función de traducción

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta?languaje=${language}`);
      setModules(result.data);
    }

    fetchData();
  }, [language]);

  const handleChange = event => {
    const selectedModule = modules.find(module => module.modulo === event.target.value);
    onModuleSelect(selectedModule);
  };
if (modules.length === 0) {
  return <p>{t('loading')}</p>; // Usa la función de traducción
}

return (
  <div className="form-group">
      <label>{t('pleaseSelectModule')}</label>
    <select className="form-control" onChange={handleChange}>
    <option value="">{t('pleaseSelect')}</option>
      {modules.map((module, index) => <option key={index} value={module.modulo} >{module.modulo} ( {module.preguntas} preguntas )</option>)}
    </select>
  </div>
);
}

export default SelectionScreen;

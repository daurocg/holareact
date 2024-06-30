import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

function SelectionScreen({ onModuleSelect, language }) {
  const [modules, setModules] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta?languaje=${language}`);
      // Ordena los módulos por nombre antes de establecerlos en el estado
      const sortedModules = result.data.sort((a, b) => {
        if (a.modulo < b.modulo) return -1;
        if (a.modulo > b.modulo) return 1;
        return 0;
      });
      setModules(sortedModules);
    }

    fetchData();
  }, [language]);

  const handleChange = event => {
    const selectedModule = modules.find(module => module.modulo === event.target.value);
    onModuleSelect(selectedModule);
  };

  if (modules.length === 0) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div className="form-group">
      <label>{t('pleaseSelectModule')}</label>
      <select className="form-control" onChange={handleChange}>
        <option value="">{t('pleaseSelect')}</option>
        {modules.map((module, index) => (
          <option key={index} value={module.modulo}>
            {module.modulo} ({module.preguntas} {t('questions')})
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectionScreen;

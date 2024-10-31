import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

function SelectionScreen({ onModuleSelect, language }) {
  const [modules, setModules] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectionType, setSelectionType] = useState('module'); // Estado para definir si se selecciona un módulo o un examen
  const { t } = useTranslation();

  useEffect(() => {
    const fetchModules = async () => {
      const result = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta?languaje=${language}`);
      // Ordena los módulos por nombre antes de establecerlos en el estado
      const sortedModules = result.data.sort((a, b) => {
        if (a.modulo < b.modulo) return -1;
        if (a.modulo > b.modulo) return 1;
        return 0;
      });
      setModules(sortedModules);
    };

    const fetchExams = async () => {
      const result = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getExamen?`);
      setExams(result.data);
    };

    fetchModules();
    fetchExams();
  }, [language]);

  const handleSelectionChange = (event) => {
    setSelectionType(event.target.value);
  };

  const handleChange = (event) => {
    if (selectionType === 'module') {
      const selectedModule = modules.find(module => module.modulo === event.target.value);
      if (selectedModule) {
        onModuleSelect(selectedModule);
      }
    } else if (selectionType === 'exam') {
      const selectedExam = exams.find(exam => exam.nombre === event.target.value);
      if (selectedExam) {
        // Pasamos el id del examen seleccionado en lugar de solo el nombre
        onModuleSelect({ ...selectedExam, id: selectedExam.id });
      }
    }
  };

  if (modules.length === 0 && exams.length === 0) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div className="form-group">
      <label>{t('pleaseSelectType')}</label>
      <select className="form-control mb-3" onChange={handleSelectionChange} value={selectionType}>
        <option value="module">{t('module')}</option>
        <option value="exam">{t('exam')}</option>
      </select>

      {selectionType === 'module' && (
        <>
          <label>{t('pleaseSelectModule')}</label>
          <select className="form-control" onChange={handleChange}>
            <option value="">{t('pleaseSelect')}</option>
            {modules.map((module, index) => (
              <option key={index} value={module.modulo}>
                {module.modulo} ({module.preguntas} {t('questions')})
              </option>
            ))}
          </select>
        </>
      )}

      {selectionType === 'exam' && (
        <>
          <label>{t('pleaseSelectExam')}</label>
          <select className="form-control" onChange={handleChange}>
            <option value="">{t('pleaseSelect')}</option>
            {exams.map((exam, index) => (
              <option key={index} value={exam.nombre}>
                {exam.nombre}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export default SelectionScreen;
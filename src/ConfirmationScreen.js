import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.css';

function ConfirmationScreen({ module, onConfirm,language,reset }) {
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const { t } = useTranslation();


  const handleInputChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const handleButtonClick = () => {
    // Llamada a la API
    fetch(`https://quizzfuntionscertifications.azurewebsites.net/api/getlista_preguntas?modulo=${encodeURIComponent(module.modulo)}&inicio=${selectedQuestion}&cantidad=20&languaje=${language}`)
      .then(response => response.json())
      .then(data => {
        // Cuando obtenga la respuesta de la API, pasamos los datos a la función onConfirm
        onConfirm(data);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <div className="text-center">
      <div className="card-body">
        <h5 className="card-title">{t('title')} {module.modulo}</h5>
        <p className="card-text">{t('questionsInModule')} {module.preguntas} {t('questions')}.</p>
        <p className="card-text">{t('selectQuestion')}:</p>
        <input type="number" className="form-control" min="1" max={module.preguntas} value={selectedQuestion} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <div className="mt-3">
          <button className="btn btn-primary m-2" onClick={handleButtonClick}>{t('begin')}</button>
          <button className="btn btn-secondary m-2" onClick={reset}>{t('back')}</button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmationScreen;

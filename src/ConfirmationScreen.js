import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.css';

function ConfirmationScreen({ module, onConfirm, language, reset }) {
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [quantity, setQuantity] = useState(10); // Nuevo estado para la cantidad de preguntas
  const [isRandom, setIsRandom] = useState(false); // Nuevo estado para el modo aleatorio
  const { t } = useTranslation();

  const handleInputChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleRandomToggle = () => {
    setIsRandom(!isRandom);
  };

  const handleButtonClick = () => {
    // Construcción dinámica del endpoint dependiendo de si es modo aleatorio o no
    const endpoint = isRandom 
      ? `https://quizzfuntionscertifications.azurewebsites.net/api/getlista_preguntas?modulo=${encodeURIComponent(module.modulo)}&cantidad=${quantity}&languaje=${language}&short=1`
      : `https://quizzfuntionscertifications.azurewebsites.net/api/getlista_preguntas?modulo=${encodeURIComponent(module.modulo)}&inicio=${selectedQuestion}&cantidad=${quantity}&languaje=${language}&short=0`;

    // Llamada a la API
    fetch(endpoint)
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

        {/* Checkbox para el modo aleatorio */}
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="randomMode" checked={isRandom} onChange={handleRandomToggle} />
          <label className="form-check-label" htmlFor="randomMode">{t('randomMode')}</label>
        </div>

        {/* Input condicional para elegir la pregunta de inicio si no está en modo aleatorio */}
        {!isRandom && (
          <>
            <p className="card-text">{t('selectQuestion')}:</p>
            <input type="number" className="form-control" min="1" max={module.preguntas} value={selectedQuestion} onChange={handleInputChange} onKeyDown={handleKeyDown} />
          </>
        )}
        
        {/* Input para definir la cantidad de preguntas en la prueba */}
        <p className="card-text mt-3">{t('selectQuantity')}:</p>
        <input type="number" className="form-control" min="1" max={module.preguntas} value={quantity} onChange={handleQuantityChange} onKeyDown={handleKeyDown} />

        <div className="mt-3">
          <button className="btn btn-primary m-2" onClick={handleButtonClick}>{t('begin')}</button>
          <button className="btn btn-secondary m-2" onClick={reset}>{t('back')}</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationScreen;
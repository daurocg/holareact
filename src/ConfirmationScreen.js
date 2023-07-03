import React, { useState } from 'react';

function ConfirmationScreen({ module, onConfirm }) {
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const handleInputChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const handleButtonClick = () => {
    // Llamada a la API
    fetch(`https://quizzfuntionscertifications.azurewebsites.net/api/getlista_preguntas?modulo=${encodeURIComponent(module.modulo)}&inicio=${selectedQuestion}&cantidad=3`)
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
    <div>
      <p>Has seleccionado el módulo {module.modulo} que tiene {module.preguntas} preguntas.</p>
      <p>Selecciona la pregunta para empezar:</p>
      <input type="number" min="1" max={module.preguntas} value={selectedQuestion} onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <button onClick={handleButtonClick}>Comenzar</button>
    </div>
  );
}

export default ConfirmationScreen;

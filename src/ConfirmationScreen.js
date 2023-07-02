import React, { useState } from 'react';

function ConfirmationScreen({ module }) {
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const handleInputChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const handleButtonClick = () => {
    console.log(`Comenzar con la pregunta ${selectedQuestion}`);
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

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

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
    <div className="text-center">
      <div className="card-body">
        <h5 className="card-title">Has seleccionado el módulo {module.modulo}</h5>
        <p className="card-text">Este módulo tiene {module.preguntas} preguntas.</p>
        <p className="card-text">Selecciona la pregunta para empezar:</p>
        <input type="number" className="form-control" min="1" max={module.preguntas} value={selectedQuestion} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <button className="btn btn-primary mt-3" onClick={handleButtonClick}>Comenzar</button>
      </div>
    </div>
  );
}

export default ConfirmationScreen;

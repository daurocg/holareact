// QuestionScreen.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

function QuestionScreen({ questionData, fetchQuestions, maxQuestionCount, reset ,questionStart}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correction, setCorrection] = useState(null);
  const [localquestionIndex, setLocalquestionIndex] = useState(questionStart);

  const question = questionData[currentQuestionIndex];

  const handleAnswerClick = async (answerId) => {
    const response = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getcorrecion_pregunta?id_pregunta=${question.pregunta[0].id_pregunta}&id_respuesta=${answerId}`);
    setCorrection(response.data);
  };
  
  const handleNextClick =async  () => {
    setCorrection(null);
    if (currentQuestionIndex + 1 < questionData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLocalquestionIndex(localquestionIndex + 1);

    } else if (questionData.length < maxQuestionCount) {
      await fetchQuestions();
      setCurrentQuestionIndex(0);
      setLocalquestionIndex(localquestionIndex + 1);

    } else {
      reset();
    }
  };

  // Comprobar si estamos en la última pregunta
  const isLastQuestion = localquestionIndex === maxQuestionCount;

  return (  
    <div className="container my-3">  {/* Agregamos un contenedor con margen */}
      <h2 className="my-3">{question.pregunta[0].orden}: {question.pregunta[0].descripcion_pregunta}</h2>
      <div className="list-group">
        {question.respuestas.map((respuesta, index) => (
          <button key={index} className="list-group-item list-group-item-action" onClick={() => handleAnswerClick(respuesta.id)}>{respuesta.descripcion}</button>
        ))}
      </div>
      {correction && <div className="alert alert-info mt-3">{correction}</div>}
      <div className="mt-3">
        {!isLastQuestion && <button className="btn btn-primary mr-2" onClick={handleNextClick}>Siguiente</button>}
        <button className="btn btn-secondary" onClick={reset}>Inicio</button>
      </div>
    </div>
  );
}

export default QuestionScreen;

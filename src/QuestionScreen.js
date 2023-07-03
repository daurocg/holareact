// QuestionScreen.js
import React, { useState } from 'react';
import axios from 'axios';

function QuestionScreen({ questionData, fetchQuestions, maxQuestionCount, reset ,questionStart}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correction, setCorrection] = useState(null);
  const [localquestionIndex, setLocalquestionIndex] = useState(questionStart);

  const question = questionData[currentQuestionIndex];

  const handleAnswerClick = async (answerId) => {
    const response = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getcorrecion_pregunta?id_pregunta=${question.pregunta[0].id_pregunta}&id_respuesta=${answerId}`);
    setCorrection(response.data);
  };
  
  const handleNextClick = () => {
    setCorrection(null);
    if (currentQuestionIndex + 1 < questionData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLocalquestionIndex(localquestionIndex + 1);

    } else if (questionData.length < maxQuestionCount) {
      fetchQuestions();
      setCurrentQuestionIndex(0);
      setLocalquestionIndex(localquestionIndex + 1);

    } else {
      reset();
    }
  };

  // Comprobar si estamos en la última pregunta
  const isLastQuestion = localquestionIndex === maxQuestionCount;
  console.log('localquestionIndex:', localquestionIndex);
  console.log('maxQuestionCount:', maxQuestionCount);
  console.log('isLastQuestion:', isLastQuestion);

  return (  
    <div>
      <h2>{question.pregunta[0].orden}: {question.pregunta[0].descripcion_pregunta}</h2>
      {question.respuestas.map((respuesta, index) => (
        <button key={index} onClick={() => handleAnswerClick(respuesta.id)}>{respuesta.descripcion}</button>
      ))}
      {correction && <p>{correction}</p>}
      {!isLastQuestion && <button onClick={handleNextClick}>Siguiente</button>}
      <button onClick={reset}>Inicio</button>
    </div>
  );
}

export default QuestionScreen;

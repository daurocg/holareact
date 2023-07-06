
// App.js
import React, { useState } from 'react';
import axios from 'axios';
import SelectionScreen from './SelectionScreen';
import ConfirmationScreen from './ConfirmationScreen';
import QuestionScreen from './QuestionScreen';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [questionStart, setQuestionStart] = useState(1);
  const [maxQuestionCount, setMaxQuestionCount] = useState(0);

  const fetchQuestions = async () => {
    setQuestionStart(prevQuestionStart => prevQuestionStart + 3);
    const nextQuestionStart = questionStart + 20;
    const response = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getlista_preguntas?modulo=${selectedModule.modulo}&inicio=${nextQuestionStart}&cantidad=20`);
    setQuestionData(response.data);
  };
  

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setMaxQuestionCount(module.preguntas);

  };

  const handleConfirmation = (data) => {
    setQuestionData(data);
    setQuestionStart(data[0].pregunta[0].orden);
 
     
    
  };

  const reset = () => {
    setSelectedModule(null);
    setQuestionData(null);
    setQuestionStart(null);
    setMaxQuestionCount(null);
  };


  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Quizz Certificaciones</h1>
      {questionData ? 
        <QuestionScreen questionData={questionData} fetchQuestions={fetchQuestions} maxQuestionCount={maxQuestionCount}  reset={reset} questionStart={questionStart}/> :
        selectedModule ?
          <ConfirmationScreen module={selectedModule} onConfirm={handleConfirmation} /> :
          <SelectionScreen onModuleSelect={handleModuleSelect} />
      }
    </div>
  );
}

export default App;

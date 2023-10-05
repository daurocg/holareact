
// App.js
import React, { useState } from 'react';
import axios from 'axios';
import SelectionScreen from './SelectionScreen';
import ConfirmationScreen from './ConfirmationScreen';
import QuestionScreen from './QuestionScreen';
import AddQuestionScreen from './AddQuestionScreen';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/esp/translation.json';
import { useTranslation } from 'react-i18next';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      esp: {
        translation: esTranslations
      }
    },
    lng: 'esp', // El idioma que desees por defecto
    fallbackLng: 'esp',
    interpolation: {
      escapeValue: false
    }
  });


function App() {
  const [language, setLanguage] = useState("esp");
  const [IAlanguage, setIALanguage] = useState("esp");

  const { t } = useTranslation();
  const [selectedModule, setSelectedModule] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [questionStart, setQuestionStart] = useState(1);
  const [maxQuestionCount, setMaxQuestionCount] = useState(0);
  const [isAddQuestionScreenActive, setIsAddQuestionScreenActive] = useState(false);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
        // Actualiza el valor del estado language
        setLanguage(event.target.value);
  };

  const handleHelpLanguageChange = (event) => {
    setIALanguage(event.target.value);
    };

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
    setIsAddQuestionScreenActive(false)
    setSelectedModule(null);
    setQuestionData(null);
    setQuestionStart(null);
    setMaxQuestionCount(null);
  };

  return (
    <div className="App">
    <div className="container mt-4" style={{ paddingBottom: '100px' }}>
      <h1 className="text-center mb-4">Quizz Certificaciones</h1>
      
      {isAddQuestionScreenActive ? (
        <AddQuestionScreen reset={reset} />
      ) : questionData ? (
        <QuestionScreen questionData={questionData} fetchQuestions={fetchQuestions} maxQuestionCount={maxQuestionCount}  reset={reset} questionStart={questionStart} language={language} IAlanguage={IAlanguage} />
      ) : selectedModule ? (
        <ConfirmationScreen module={selectedModule} onConfirm={handleConfirmation} language={language} reset={reset} />
      ) : (
        <>
          <SelectionScreen onModuleSelect={handleModuleSelect} language={language} />
          <button className="btn btn-primary m-2" onClick={() => setIsAddQuestionScreenActive(true)}>
            Añadir preguntas
          </button>
        </>
      )}
      
    </div>
    {/* Agregamos los selectores de idioma en la parte inferior de la página */}
    {(!questionData && !selectedModule) &&
    <div style={{ position: 'fixed', bottom: '0', width: '100%', padding: '10px', background: '#f5f5f5' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>{t('languageSelector')}:</label>
        <select onChange={handleLanguageChange} value={language}>
          <option value="esp">ESP</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        <label style={{ marginRight: '10px' }}>{t('helpLanguageSelector')}:</label>
        <select onChange={handleHelpLanguageChange}value={IAlanguage} >
          <option value="esp">ESP</option>
          <option value="en">EN</option>
        </select>
      </div>
    </div>
    }
  </div>
  );



}

export default App;

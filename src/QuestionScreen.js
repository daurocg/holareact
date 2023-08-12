import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import './QuestionScreen.css';
import { useTranslation } from 'react-i18next';

function QuestionScreen({ questionData, fetchQuestions, maxQuestionCount, reset ,questionStart,language,IAlanguage}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [corrections, setCorrections] = useState({});
  const [localquestionIndex, setLocalquestionIndex] = useState(questionStart);
  const [loadingQuestions, setLoadingQuestions] = useState({});  // Cambio aquí: ahora es un objeto
  // NUEVO ESTADO
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [selectedAnswersIndex, setSelectedAnswersIndex] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [helpPanelVisible, setHelpPanelVisible] = useState(false);

  const question = questionData[currentQuestionIndex];
  const { t } = useTranslation();


  const handleHelpClick = () => {
    setHelpPanelVisible(!helpPanelVisible); // Cambia el estado del panel de ayuda cada vez que se hace clic en el botón
  };



  const handleAnswerClick = async (answerId, index) => {
    setAnsweredQuestions(prev => ({ ...prev, [currentQuestionIndex]: true }));
    setSelectedAnswersIndex(prev => ({ ...prev, [currentQuestionIndex]: index }));  // Guardar el índice de la respuesta seleccionada
  
    // Comprueba si la respuesta es correcta
    const answerIsCorrect = question.respuestas[index].respuesta_correcta;
  
    if (answerIsCorrect) {
      // Si la respuesta es correcta, establecemos la corrección de inmediato y evitamos hacer la llamada a la API
      setCorrections(prevState => ({ ...prevState, [currentQuestionIndex]: t('Respuesta correcta') }));
    } else {
      // Si la respuesta es incorrecta, mostramos el mensaje de carga y hacemos la llamada a la API
      setCorrections(prevState => ({ ...prevState, [currentQuestionIndex]: t('Respuesta incorrecta') }));
      setLoadingQuestions(prev => ({ ...prev, [currentQuestionIndex]: true }));  // Establecemos el valor de la pregunta actual en true
  
      try {
        const response = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getcorrecion_pregunta?id_pregunta=${question.pregunta[0].id_pregunta}&id_respuesta=${answerId}&language=${IAlanguage}`)
        setCorrections(prevState => ({ ...prevState, [currentQuestionIndex]: response.data.respuesta }));
        setErrorMessage(null);  // Limpiar el mensaje de error si la llamada a la API fue exitosa
      } catch (error) {
        setErrorMessage('Falló la conexión con el backend. ¿Reintentar?');
      } finally {
        setLoadingQuestions(prev => ({ ...prev, [currentQuestionIndex]: false }));  // Establecemos el valor de la pregunta actual en false
      }
    }
  };
  
  
  
  const handleNextClick = async () => {
    if (currentQuestionIndex + 1 < questionData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLocalquestionIndex(localquestionIndex + 1);
    } else if (questionData.length < maxQuestionCount) {
      await fetchQuestions();
      setCurrentQuestionIndex(0);
      setLocalquestionIndex(localquestionIndex + 1);
    }  
  };

  const handlePrevClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setLocalquestionIndex(localquestionIndex - 1);
    }
  };
  const recallOpenAI = async () => {
    // Comprueba si la pregunta actual ha sido respondida antes de intentar hacer la llamada a la API
    if (answeredQuestions[currentQuestionIndex]) {
      setLoadingQuestions(prev => ({ ...prev, [currentQuestionIndex]: true }));  // Establecemos el valor de la pregunta actual en true
  
      try {
        const answerId = question.respuestas[selectedAnswersIndex[currentQuestionIndex]].id;
        const response = await axios.get(`https://quizzfuntionscertifications.azurewebsites.net/api/getcorrecion_pregunta`, {
          params: {
            id_pregunta: question.pregunta[0].id_pregunta,
            id_respuesta: answerId,
            language: IAlanguage
          }
        });
  
        const { respuesta } = response.data;
        setCorrections(prevState => ({ ...prevState, [currentQuestionIndex]: respuesta }));
        setErrorMessage(null);  // Limpiar el mensaje de error si la llamada a la API fue exitosa
      } catch (error) {
        setErrorMessage('Falló la conexión con el backend. ¿Reintentar?');
      } finally {
        setLoadingQuestions(prev => ({ ...prev, [currentQuestionIndex]: false }));  // Establecemos el valor de la pregunta actual en false
      }
    }
  };
  //const helpQuestions = async () => {


  
  // Comprobar si estamos en la última pregunta
  const isLastQuestion = localquestionIndex === maxQuestionCount;

  // Comprobar si estamos en la primera pregunta
  const isFirstQuestion = localquestionIndex === 1;

  return (
    <div className="container my-3">
    <div className="row">
            <div className="mt-3">
              <button className="btn btn-primary m-2" onClick={handlePrevClick} disabled={loadingQuestions[currentQuestionIndex] || isFirstQuestion}>{t('buttons.previous')}</button>
              <button className="btn btn-primary m-2" onClick={handleNextClick} disabled={loadingQuestions[currentQuestionIndex] || isLastQuestion}>{t('buttons.next')}</button>
              <button className="btn btn-secondary m-2" onClick={reset}>{t('buttons.reset')}</button>
              <button className="btn btn-warning m-2" onClick={recallOpenAI} disabled={loadingQuestions[currentQuestionIndex]|| !corrections[currentQuestionIndex] || corrections[currentQuestionIndex].length === 0 }>{t('buttons.recallOpenAI')}</button>
              <button className="btn btn-warning m-2" onClick={handleHelpClick} disabled={loadingQuestions[currentQuestionIndex]} >{t('buttons.helpWithQuestion')}</button>
                {/* <button className="btn btn-warning m-2" onClick={helpresp} disabled={loadingQuestions[currentQuestionIndex] }>Ayuda con respuestas</button> */}
            </div>
      <div className={helpPanelVisible ? "col-md-8" : "col-md-12"}>
        <div className="mt-3">
          <div className="container my-3">
            <h4 className="my-3">{question.pregunta[0].orden}: {question.pregunta[0].descripcion_pregunta}</h4>
            <div className="list-group">
              {question.respuestas.map((respuesta, index) => (
                <button 
                  key={index} 
                  className={`
                    list-group-item 
                    list-group-item-action 
                    ${answeredQuestions[currentQuestionIndex] && selectedAnswersIndex[currentQuestionIndex] === index && (respuesta.respuesta_correcta ? 'bg-success-soft' : 'bg-danger-soft')}
                    ${answeredQuestions[currentQuestionIndex] && selectedAnswersIndex[currentQuestionIndex] !== index && respuesta.respuesta_correcta ? 'blink' : ''}
                  `} 


                  onClick={() => handleAnswerClick(respuesta.id, index)} 
                  disabled={answeredQuestions[currentQuestionIndex] || loadingQuestions[currentQuestionIndex]}  // Deshabilita el botón si la pregunta ya ha sido respondida o está cargando
                >
                  {respuesta.descripcion}
                </button>
              ))}
            </div>
        
            {corrections[currentQuestionIndex] && <div className="alert alert-info mt-3">{corrections[currentQuestionIndex]}</div>}
            {loadingQuestions[currentQuestionIndex] && 
              <div className="alert alert-warning mt-3">
                <img src="https://media.tenor.com/0JK1fHxqYGEAAAAi/loading.gif" alt="Loading..." style={{ width: '30px', marginRight: '10px' }} />  {t('alerts.loading')}
              </div>}
              
              {errorMessage && <div className="alert alert-danger mt-1">{errorMessage}  {errorMessage && <button className="btn btn-warning" onClick={recallOpenAI}>Reintentar</button>}</div>}
            
          </div>
        </div>
      </div>
      {helpPanelVisible && 

        <div className="alert col m-3"style={{border: '1px solid #cce5ff', backgroundColor: '#e2f3ff', padding: '10px',margin: '25px'}}>
            {t('alerts.comingSoon')}
        </div>
        }

    </div>
  </div>
);

  
}

export default QuestionScreen;

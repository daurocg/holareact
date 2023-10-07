

  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useTranslation } from 'react-i18next';
import './AddQuestionScreen.css';

function AddQuestionScreen({ reset }) {

  const { t } = useTranslation();

  const [modules, setModules] = useState([]);
  const [moduleSelected, setModuleSelected] = useState("");
  const [language, setLanguage] = useState("esp");
  const [questionText, setQuestionText] = useState("");

  const [newModule, setNewModule] = useState("");  // 1. Estado para el input de nuevo módulo
  const [useNewModuleInput, setUseNewModuleInput] = useState(false);  // 2. Estado para determinar si se quiere usar el input de nuevo módulo

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [error, setError] = useState(null);
  const [editableSQL, setEditableSQL] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      const result = await axios(`https://quizzfuntionscertifications.azurewebsites.net/api/getmodulosnumpregunta?languaje=${language}`);
      setModules(result.data);
    };

    fetchModules();
  }, [language]);
  
  const executeSQL = async () => {
    try {
      const formattedSQL = formatSQL(editableSQL);
      
      // const url = `https://quizzfuntionscertifications.azurewebsites.net/api/insertdb_preguntas_resp?respuesta=dauro`;
      const url = 'https://quizzfuntionscertifications.azurewebsites.net/api/insertdb_preguntas_resp';
  
       const response =    await      axios.post(url, { respuesta: formattedSQL });

       alert( response.data.status);
      // const response = await axios.post('https://quizzfuntionscertifications.azurewebsites.net/api/insertdb_preguntas_resp', {
      //   respuesta: formattedSQL
      //   //modulo: 'azdauro' ,
      //   //lenguaje: 'ESP' ,  //formattedSQL
      //   //texto: 'hola'
      // });
      

      // if (response.data.status === 'success') {
        
      // } else {
      //   alert('Error al ejecutar SQL 1: ' + response.data.message);
      // }
  
    } catch (error) {
      alert('Error al ejecutar SQL 2: ' + (error.response ? error.response.data : error.message) );
    }
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const finalModule = useNewModuleInput ? newModule : moduleSelected;
      const url = `https://quizzfuntionscertifications.azurewebsites.net/api/GetSqlPregunta?modulo=${finalModule}&lenguaje=${language}&texto=${questionText}`;
  
      const response = await axios.post(url);
      // const response = await axios.post('https://quizzfuntionscertifications.azurewebsites.net/api/GetSqlPregunta?', {
      //   //respuesta: formattedSQL
      //   modulo: finalModule ,
      //   lenguaje: language , 
      //   texto: questionText
      // });
      // Usar la respuesta directamente
      setResponseMessage(response.data.respuesta || response.data.message || response.data);
      setEditableSQL(response.data.respuesta || response.data.message || response.data);

      
      setQuestionText('');
  
    } catch (error) {
      // Manejar el error proporcionado por Axios
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Ha ocurrido un error al enviar los datos.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
};

function RenderSQL({ sql, onSQLChange }) {
  const [localSQL, setLocalSQL] = useState(sql);
  
  useEffect(() => {
    setLocalSQL(sql);
  }, [sql]);

  const handleLocalChange = (e) => {
    setLocalSQL(e.target.value);
  };

  const handleBlur = () => {
    onSQLChange(localSQL);
  };

  return (
    <textarea 
      className="sql-textarea"
      value={localSQL}
      onChange={handleLocalChange}
      onBlur={handleBlur}
      style={{
        overflowX: 'hidden',
        whiteSpace: 'pre-wrap',
        fontSize: '10px'  // Ajusta el tamaño del texto aquí
      }}
    />
);


}



function formatSQL(sqlString) {
  // Reemplaza saltos de línea y espacios innecesarios
  return sqlString.replace(/\s+/g, ' ').trim();
}



  
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body text-center">
          <h2 className="card-title">{t('addQuestion')}</h2>
  
          {/* Seleccionar Módulo */}
          <div className="form-group">
            <label>{t('selectModule')}</label>
            {useNewModuleInput ? (
              // Input para nuevo módulo
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del nuevo módulo"
                value={newModule}
                onChange={(e) => setNewModule(e.target.value)}
              />
            ) : (
              // ComboBox para módulos existentes
              <select className="form-control" value={moduleSelected} onChange={(e) => setModuleSelected(e.target.value)}>
                <option value="">{t('pleaseSelect')}</option>
                {modules.map((module, index) => 
                  <option key={index} value={module.modulo}>
                    {module.modulo}
                  </option>
                )}
              </select>
            )}
          </div>
          <button className="btn btn-link" onClick={() => setUseNewModuleInput(!useNewModuleInput)}>
            {useNewModuleInput ? t('useExistingModule') : t('useNewModule')}
          </button>

          {/* Seleccionar Idioma */}
          <div className="form-group">
            <label>{t('selectLanguage')}</label>
            <select className="form-control" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="esp">ESP</option>
              <option value="en">EN</option>
            </select>
          </div>
  
          {/* Campo de texto para la pregunta */}
          <div className="form-group">
            <label>{t('questionText')}</label>
            <textarea className="form-control" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Escribe la pregunta y las respuestas aquí..."></textarea>
          </div>
  
          {/* Botones de acción */}
          <div className="mt-3">
            <button className="btn btn-primary m-2" onClick={handleSubmit}>{t('add')}</button>
            <button className="btn btn-secondary m-2" onClick={reset}>{t('back')}</button>
            <button className="btn btn-success m-2" onClick={executeSQL}>Ejecutar SQL</button>

          </div>
          {loading && 
            <div className="alert alert-warning mt-3">
              <img src="https://media.tenor.com/0JK1fHxqYGEAAAAi/loading.gif" alt="Loading..." style={{ width: '30px', marginRight: '10px' }} />  
              {t('alerts.loading')}
            </div>
          }

{responseMessage && 
  <div className="alert alert-info mt-3 no-horizontal-scroll">
    <RenderSQL sql={editableSQL} onSQLChange={setEditableSQL} />
  </div>
}


          {error && <div className="alert alert-danger mt-3">{error}</div>}

        </div>
      </div>
    </div>
  );
  
}

export default AddQuestionScreen;

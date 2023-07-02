import React, { useState } from 'react';
import SelectionScreen from './SelectionScreen';
import ConfirmationScreen from './ConfirmationScreen';

function App() {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="App">
      <h1>Hola Mundo (  version react XD  )</h1>
      {selectedModule
        ? <ConfirmationScreen module={selectedModule} />
        : <SelectionScreen onModuleSelect={setSelectedModule} />
      }
    </div>
  );
}

export default App;

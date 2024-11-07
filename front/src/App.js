import React from 'react';
import Home from './Pages/Home';
import GoogleAuth from './Login/GoogleAuth';
import AdicionarDesafio from './DataManipulation/AdicionarDesafio';

function App() {

  return (
    <div>
      <AdicionarDesafio />
      <Home />
    </div>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Home/Home.jsx';
import Cadastro from '../Cadastro/Cadastro.jsx'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  );
}

export default App;
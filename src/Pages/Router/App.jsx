import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Home/Home.jsx';
import Cadastro from '../Cadastro/Cadastro.jsx'; 
import Login from '../Login/Login.jsx';
import PainelAdm from '../painelAdm/painelAdm.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/AdmPannel" element={<PainelAdm />} />
    </Routes>
  );
}

export default App;
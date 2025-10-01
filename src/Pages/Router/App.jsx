import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Home/Home.jsx';
import Login from '../Login/Login.jsx';
import PainelAdm from '../painelAdm/painelAdm.jsx';
import Create from '../CreateItem/Create.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/AdmPannel" element={<PainelAdm />} />
      <Route path="/AdmPannel/create" element={<Create />} />
    </Routes>
  );
}

export default App;
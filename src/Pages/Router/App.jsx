import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Home/Home.jsx';
import Login from '../Login/Login.jsx';
import PainelAdm from '../PainelAdm/PainelAdm.jsx';
import Create from '../CreateItem/Create.jsx';
import DeleteItem from '../DeleteItem/DeleteItem.jsx';
import EditItem from '../EditItem/EditItem.jsx';
import Main from '../Main/Main.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/AdmPannel" element={<PainelAdm />} />
      <Route path="/AdmPannel/create" element={<Create />} />
      <Route path="/AdmPannel/delete" element={<DeleteItem />} />
      <Route path="/AdmPannel/EditItem" element={<EditItem />} />
      <Route path="/Main" element={<Main />} />
    </Routes>
  );
}

export default App;
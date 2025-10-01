import './PainelAdm.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';

function PainelAdm() {
  const [imoveis, setImoveis] = useState([]);
   
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; 
    } 
  }, []);

 
  async function listaImoveis() {
    try {
      const response = await fetch('http://localhost:8800/imoveis/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setImoveis(data); 
      } else {
        console.error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  }


  useEffect(() => {
    listaImoveis();
  }, []);

  

  return (
    <div className='painelAdm'>
      <Sidebar/>
      <div className='main'>
        <h1>Imóveis disponíveis!</h1>
        {imoveis.map((imovel, index) => (
          <div key={index} className="imovel">
            <h2>{imovel.descricao}</h2>
            <p>Bairro: {imovel.bairro}</p>
            <p>Cidade: {imovel.cidade}</p>
            <p>Estado: {imovel.estado}</p>
            <p>Tipo: {imovel.tipo}</p>
            <p>Quartos: {imovel.quartos}</p>
            <p>Banheiros: {imovel.banheiros}</p>
            <p>Vagas na garagem: {imovel.vagas_garagem}</p>
            <p>Área total: {imovel.area_total} m²</p>
            <p>Valor: {imovel.valor}</p>
          </div>
        ))}
    </div>
    </div>
  )
}

export default PainelAdm;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Components/Alert/Alert';
import AnuncioCard from '../../Components/AnuncioCard/AnuncioCard';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './PainelAdm.css';

function PainelAdm() {
  const [imoveis, setImoveis] = useState([]);
  const navigate = useNavigate();
   
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



  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:8800/imoveis/delete/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
            if (response.ok) {
            const deletedImovel = await response.json();
            setImoveis(prevImoveis => prevImoveis.filter(imovel => imovel.id !== deletedImovel.id));
            await Alert(response.message,'Sucesso!','success')


      } else {
        console.error('Erro na resposta do servidor');
        await Alert(response.message,'Erro!','error')
    }
      } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      await Alert(error,'imóvel não foi enviado para itens excluidos!','Erro!','error')
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
          <div key={index} className="imovelhome">
            <div>
              <p>{imovel.id}</p>
              <AnuncioCard imovel={imovel} onButtonClick={() => {}}/>
            </div>
            <div className='containerBotoes'>
              <div className='botoes'>
                <button className='edita' onClick={() => navigate('/AdmPannel/EditItem',{state: { id: imovel.id }})}>Editar</button>
                <button className='excluir' onClick={() => handleDelete(imovel.id)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
    </div>
    </div>
  )
}

export default PainelAdm;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import Alert from '../../Components/Alert/Alert';
import AnuncioCard from '../../Components/AnuncioCard/AnuncioCard';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './PainelAdm.css';
import jwt_decode from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;




function PainelAdm() {
  const [imoveis, setImoveis] = useState([]);
  const navigate = useNavigate();

   
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    Alert("Você não está logado",'Erro!','error')
    navigate("/login");
    return;
  }

  try {
    const decoded = jwt_decode(token);
    

    
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      Alert("Seu login expirou!",'Alerta!','alert')
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

  
    if (decoded.type !== "adm") {
      Alert("Seu usuário não tem permissões necessárias!",'Erro!','error')
      navigate("/login");
      return;
    }

     Alert('Acesso permitido!','Sucesso!','success')
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    navigate("/login");
  }
}, []);

 
  async function listaImoveis() {
    try {
      const response = await fetch(`${API_URL}/imoveis/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        
        const data = await response.json();
        setImoveis(data); 
        console.log(data)
      } else {
        console.error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  }



  async function handleDelete(id) {
    try {
      const response = await fetch(`${API_URL}/imoveis/delete/${id}`, {
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
        {imoveis.map((imovel, index) => (
          <div key={index} className="imovelhome">
            <div>

              <h2>{imovel.descricao}</h2>
              
              <AnuncioCard imovel={imovel}/>

            </div>
            <div className='containerBotoes'>
              <div className='botoes'>
                <button className='edita' onClick={() => navigate('/AdmPannel/EditItem',{state: { id: imovel.id }})}><FontAwesomeIcon icon={faEdit} /></button>
                <button className='excluir' onClick={() => handleDelete(imovel.id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
          </div>
        ))}
    </div>
    </div>
  )
}

export default PainelAdm;


import Sidebar from '../../Components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import './DeleteItem.css';
function DeleteItem() {
    const [imoveis, setImoveis] = useState([]);


  async function listaImoveis() {
    try {
      const response = await fetch('http://localhost:8800/imoveis/listInatives', {
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

    async function handleReactivate(id) {
    try {
      const response = await fetch(`http://localhost:8800/imoveis/reactivate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
            if (response.ok) {
            const reactivatedImovel = await response.json();
            setImoveis(prevImoveis => prevImoveis.filter(imovel => imovel.id !== reactivatedImovel.id));

      } else {
        console.error('Erro na resposta do servidor');
        }
      } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  }

  async function handleDeletePerm(id) {
    try {
      const response = await fetch(`http://localhost:8800/imoveis/deletePerm/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
      });
            if (response.ok) {
            const deletedPermImovel = await response.json();
            setImoveis(prevImoveis => prevImoveis.filter(imovel => imovel.id !== deletedPermImovel.id));
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
        <div>
            <Sidebar/>
            <div className='main'>
                <h1>Imóveis excluidos!</h1>
                {imoveis.map((imovel, index) => (
                <div key={index} className="imovel">
                    <div>
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
                    <div className='containerBotoes'>
                            <div className='botoes'>
                                <button className='restaurar' onClick={() => handleReactivate(imovel.id)}>Restaurar</button>
                                <button className='editar'>Editar</button>
                                <button className='excluirPerm' onClick={() => handleDeletePerm(imovel.id)}>Excluir permanentemente</button>
                            </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default DeleteItem;
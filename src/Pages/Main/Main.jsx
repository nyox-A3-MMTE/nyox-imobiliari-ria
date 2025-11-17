import "./Main.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../Components/Alert/Alert';
import AnuncioCard from '../../Components/AnuncioCard/AnuncioCard';
import Header from '../../Components/Header/Header';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Filtro from '../../Components/Filtro/Filtro';

function Main() {
  const [imoveis, setImoveis] = useState([]);
  const [user, setUser] = useState('Sign In/Up');

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser('Sign In/Up');
        return;
      }
  
      try {
        const decoded = jwt_decode(token);
        const now = Math.floor(Date.now() / 1000);
  
        if (decoded.exp && decoded.exp < now) {
          Alert("Seu login expirou!", 'Alerta!', 'alert');
          localStorage.removeItem("token");
          return;
        }
  
        if (decoded.type === "adm") {
          setUser(`${decoded.type} - ${decoded.email}`);
        } else if (decoded.type === "visit") {
          setUser(decoded.nome);
        }
  
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        navigate("/login");
      }
    }, []);

  function ver_detalhes(id) {
    const div = document.getElementById(id);
    if (!div) {
      console.error(`Elemento com id "${id}" não encontrado`);
      return;
    }

    const style = window.getComputedStyle(div);
    const width = parseFloat(style.width);

    div.style.width = width + 480 + "px";
  }

  function menos_detalhes(id) {
    const div = document.getElementById(id);
    if (!div) {
      console.error(`Elemento com id "${id}" não encontrado`);
      return;
    }

    const style = window.getComputedStyle(div);
    const width = parseFloat(style.width);

    div.style.width = width - 480 + "px";
  }

  async function listaImoveis() {
    try {
      const response = await fetch('http://localhost:8800/imoveis/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="Main">
      <Header user= {user} />
      <Filtro></Filtro>
      <div className="imoveis">
        {imoveis.map((imovel, index) => (
          <div
            key={index}
            className="imovelhome"
            id={`imovelhome-${index}`}
          >
            <div>
              <h2>{imovel.descricao}</h2>
              <AnuncioCard
                imovel={imovel}
                onButtonClick={() => ver_detalhes(`imovelhome-${index}`)}
              />
            </div>

            <div className="detalhes">
              <p>Bairro: {imovel.bairro}.</p>
              <p>Cidade: {imovel.cidade}.</p>
              <p>Estado: {imovel.estado}.</p>
              <p>Tipo: {imovel.tipo}.</p>
              <p>Quartos: {imovel.quartos}.</p>
              <p>Banheiros: {imovel.banheiros}.</p>
              <p>Vagas na garagem: {imovel.vagas_garagem}.</p>
              <p>Área total: {imovel.area_total} m².</p>
              <p>Valor: {imovel.valor}.</p>
              <button className="mostrar-menos" onClick={()=> menos_detalhes(`imovelhome-${index}`)}> <FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;

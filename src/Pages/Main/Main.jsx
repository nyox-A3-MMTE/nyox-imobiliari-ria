import "./Main.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../Components/Alert/Alert';
import AnuncioCard from '../../Components/AnuncioCard/AnuncioCard';
import Header from '../../Components/Header/Header';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
const API_URL = import.meta.env.VITE_API_URL;

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

  async function listaImoveis() {
    try {
      const response = await fetch(`${API_URL}/imoveis/list`, {
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
      <div className="imoveis">
        {imoveis.map((imovel, index) => (
          <div
            key={index}
            className="imovelhome"
            id={`imovelhome-${index}`}
          >
            <AnuncioCard
              imovel={imovel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;

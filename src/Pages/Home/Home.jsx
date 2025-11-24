import './Home.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../Components/Alert/Alert';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function Home() {
  const [user, setUser] = useState('Sign In/Up'); 
  const navigate = useNavigate();

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
        navigate("/login");
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

  return (
    <div className='home-container'>
      <header>
        <img src={logo} alt="Logo" />
        <li>
          <a href="/Main">Imóveis</a>
          <a href="/">Sobre nós</a>
          <a href="/docs">Documentação</a>
          <a className='cadastrar' href="/login">
            <FontAwesomeIcon icon={faUser} size="lg" /> {user}
          </a>
        </li>
      </header>
      <div className='content'>
        <h1>
          Seu imóvel, sua história, nossa missão <span className='ponto'>.</span>
        </h1>
        <p>
          Na Nyox Imóveis, ajudamos você a encontrar o imóvel ideal com transparência e facilidade.
          Com anos de experiência e um time de especialistas, garantimos uma negociação segura e personalizada.
          Explore nossas opções e comece hoje mesmo uma nova etapa da sua vida!
        </p>
        <a id='imoveis' href="/Main">Ver Imóveis</a>
      </div>
    </div>
  );
}

export default Home;

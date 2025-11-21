import { FaBath, FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import AnuncioCard from "../../Components/AnuncioCard/AnuncioCard";
import Carrossel from "../../Components/Carrossel/Carrossel";
import Header from "../../Components/Header/Header";
import MapView from "../../Components/MapView/MapView";
import "./AnuncioPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Alert from "../../Components/Alert/Alert";
const API_URL = import.meta.env.VITE_API_URL;

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function AnuncioPage() {

  const {id} = useParams();
  const [imovel, setImovel] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getImovel = async () => {
      try {
        const res = await fetch(`${API_URL}/imoveis/listforid/${parseInt(id)}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
        }
        });

        const data = await res.json();

        if (res.ok) {
          setImovel(data[0]);
        } else {
          await Alert("Erro ao carregar imovel", 'Erro!', 'error');
          navigate("/Main");
        }
      } catch (error) {
        await Alert('Erro ao conectar ao servidor:', 'Erro!', 'error');
        navigate("/Main");
      }
    };

    getImovel();
  }, [id]);
  
  if(!imovel) return <p>Carregando...</p>
  
  return (
    <>
      <Header />

      <main className="anuncio-page container">
        <section className="anuncio-grid">
          <div className="anuncio-media">
            
            {imovel && (
              <Carrossel imagens={imovel.imagens} className="carrossel_page" />
            )}
          </div>

          <aside className="anuncio-details">
            <h2>Localização aproximada</h2>
            <div className="mapa-desktop">
              <MapView imovel={imovel} />
            </div>
          </aside>

          <div>
            <h1 className="anuncio-title">{imovel.descricao}</h1>

            <div className="anuncio-meta">
              <div className="anuncio-price">{formatPrice(imovel.valor)}</div>
              <div className="anuncio-badge">{imovel.modalidade?.toUpperCase()}</div>
            </div>

            <div className="anuncio-address">
              {imovel.endereco} — {imovel.bairro} — {imovel.cidade}/{imovel.estado} — CEP: {imovel.cep}
            </div>

            <ul className="anuncio-features">
              <li><FaRulerCombined /> {imovel.area_total} m²</li>
              <li><FaBed /> {imovel.quartos}</li>
              <li><FaBath /> {imovel.banheiros}</li>
              <li><FaCar /> {imovel.vagas_garagem}</li>
            </ul>

            <h4>Mais sobre este imóvel</h4>
            <p className="anuncio-desc">{imovel.descricao}</p>
          </div>
          
        </section>

        <section className="sugestoes">
          <h2>Algumas opções que você pode gostar</h2>
          <div className="sugestoes-grid">
            <AnuncioCard imovel={imovel} onButtonClick={() => {}} />
            <AnuncioCard imovel={imovel} onButtonClick={() => {}} />
            <AnuncioCard imovel={imovel} onButtonClick={() => {}} />
          </div>
        </section>
      </main>
    </>
  );
}

export default AnuncioPage;
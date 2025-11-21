import { FaBath, FaBed, FaCar, FaRulerCombined } from 'react-icons/fa';
import Carrossel  from '../Carrossel/Carrossel';
import './AnuncioCard.css';
import { useNavigate } from 'react-router-dom';


const AnuncioCard = ({
  imovel,
}) => {
    const navigate = useNavigate();

    return (
    <div className="anuncio-card">
      <div className="anuncio-card__conteudo">
        
        <Carrossel imagens={imovel.imagens} className={"anuncio-card__imagem"}/>

        <h3 className="anuncio-card__descricao">{`${imovel.tipo} ${imovel.descricao}`}</h3>

         <ul className="anuncio-card__caracteristicas">
          <li><FaRulerCombined /> {imovel.area_total} m²</li>
          <li><FaBed /> {imovel.quartos}</li>
          <li><FaBath /> {imovel.banheiros}</li>
          <li><FaCar /> {imovel.vagas_garagem}</li>
        </ul>

        <p className="anuncio-card__valor">R$ {imovel.valor}</p>
        <p className="anuncio-card__localizacao">
          Localização: {imovel.bairro ? `${imovel.bairro}, ` : ''}{imovel.cidade} - {imovel.estado}
        </p>

        <button className="anuncio-card__button" onClick={() => navigate(`/AnuncioPage/${imovel.id}`)}>
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default AnuncioCard;
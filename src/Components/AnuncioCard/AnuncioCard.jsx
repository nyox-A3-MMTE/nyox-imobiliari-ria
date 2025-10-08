import { FaBath, FaBed, FaCar, FaRulerCombined } from 'react-icons/fa';
import './AnuncioCard.css';


const AnuncioCard = ({
  descricao,
  tipo,
  bairro,
  cidade,
  estado,
  quartos,
  banheiros,
  vagas_garagem,
  area_total,
  valor,
  onButtonClick,
//   img campo para imagem a ser iplementado no futuro
}) => {
    return (
    <div className="anuncio-card">
      <div className="anuncio-card__conteudo">
        {/* <img src={imgtest} alt="Anúncio" className="anuncio-card__imagem" /> */}
        <h3 className="anuncio-card__descricao">{`${tipo} ${descricao}`}</h3>

         <ul className="anuncio-card__caracteristicas">
          <li><FaRulerCombined /> {area_total} m²</li>
          <li><FaBed /> {quartos}</li>
          <li><FaBath /> {banheiros}</li>
          <li><FaCar /> {vagas_garagem}</li>
        </ul>

        <p className="anuncio-card__valor">R$ {valor}</p>
        <p className="anuncio-card__localizacao">
          Localização: {bairro ? `${bairro}, ` : ''}{cidade} - {estado}
        </p>

        <button className="anuncio-card__button" onClick={onButtonClick}>
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default AnuncioCard;
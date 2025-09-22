import './Home.css';
import logo from '../../assets/logo.png';
function Home() {
  return (
    <div className='home-container'>
      <header>
        <img src={logo} alt="Logo" />
        <li>
            <a href="/">Imóveis</a>
            <a href="/">Sobre nós</a>
            <a className ="cadastro"href="/cadastro">Cadastre-se</a>
           
        </li>
      </header>
      <div className='content'>
        <h1>
            Seu imóvel, sua história, nossa missão <span className='ponto'>.</span>
        </h1>
        <p>Na Nyox Imóveis, ajudamos você a encontrar o imóvel ideal com transparência e facilidade. Com anos de experiência e um time de especialistas, garantimos uma negociação segura e personalizada. Explore nossas opções e comece hoje mesmo uma nova etapa da sua vida!</p>
        <a id='imoveis' href="/">Ver Imóveis</a>
      </div>
    </div>
  )
}

export default Home

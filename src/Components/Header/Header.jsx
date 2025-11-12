import "./Header.css";
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

function Header({user}){

    
    return(
        <header className="header_component">
            <img src={logo} className="logo" alt="Nyox Imobiliária logo" />
            <a className='user' href="/login"><FontAwesomeIcon icon={faUser} size="lg" />{user}</a>
        </header>
    )
}

export default Header;
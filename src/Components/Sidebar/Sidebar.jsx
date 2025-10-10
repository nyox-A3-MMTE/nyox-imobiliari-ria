import { optionsObjects } from "./SidebarObjects.jsx"
import styles from "./Sidebar.module.css"
import logo from '../../assets/logo.png';


function Sidebar() {
    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";}
    return ( 
        <div className={styles.sidebar}>
            <div className={styles.simbolContainer}>
                <img src={logo} alt="Logo" className={styles.simbolImage} />
            </div>
            <div className={styles.optionsContainer}>
                <ul className={styles.listContainer}>
                    {
                        optionsObjects.map((val, key) => {
                            if(val.title === "Sair"){
                                return(
                                    <li className={styles.liOptions}onClick={() => {
                                        handleLogout()
                                    }}
                                    key={key}>
                                    <div className={styles.liIcon}>{val.icon}</div>
                                    <div className={styles.liTitle}>{val.title}</div>
                                </li>
                                )
                            }
                                return(
                                <li className={styles.liOptions}onClick={() => {
                                    window.location.pathname = val.link
                                }}
                                key={key}>
                                    <div className={styles.liIcon}>{val.icon}</div>
                                    <div className={styles.liTitle}>{val.title}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
     );
}

export default Sidebar;
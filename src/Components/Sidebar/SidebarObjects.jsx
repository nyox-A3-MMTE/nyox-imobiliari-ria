import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faHome,faArrowLeft } from '@fortawesome/free-solid-svg-icons'


export const optionsObjects = [
  {
    title: "Início",
    icon: <FontAwesomeIcon icon={faHome} />,
    link: "AdmPannel"
  },
  {
    title: "Criar",
    icon: <FontAwesomeIcon icon={faPlus} />,
    link: "AdmPannel/create"
  },
  {
    title: "Excluídos",
    icon: <FontAwesomeIcon icon={faTrash} />,
    link: "AdmPannel/delete"
  },
  {
    title: "Sair",
    icon: <FontAwesomeIcon icon={faArrowLeft} />,
    link: "/",
  }
]
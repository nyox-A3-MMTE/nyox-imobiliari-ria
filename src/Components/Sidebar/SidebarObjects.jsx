import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faHome } from '@fortawesome/free-solid-svg-icons'

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
    title: "Editar",
    icon: <FontAwesomeIcon icon={faEdit} />,
    link: "AdmPannel/edit"
  },
  {
    title: "Excluídos",
    icon: <FontAwesomeIcon icon={faTrash} />,
    link: "AdmPannel/delete"
  }
]
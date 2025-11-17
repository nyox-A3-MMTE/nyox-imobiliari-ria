import { icon } from "@fortawesome/fontawesome-svg-core";
import"./Alert.css"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';

export default function Alert(message, type, icon) {
    return(
    Swal.fire({
      title: type,
      text: message,
      icon: icon, 
      confirmButtonText: 'Fechar',
    }));
    

}


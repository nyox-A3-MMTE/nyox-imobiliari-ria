import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Components/Alert/Alert';
import './Login.css';


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

       const data = await response.json();
            
      if (response.ok) {
       localStorage.setItem("token", data.token);
       await Alert(data.message,'Sucesso!','success');
       navigate('/AdmPannel');
       setForm({ email: '', senha: '' });

      } else {
      await  Alert(data.message,'Erro!','error');
      }
      }catch (error) {
       await Alert('Erro ao conectar ao servidor:','Erro!','error');
      }
       
    };

  return (
    <div className="login-container">  
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Login;
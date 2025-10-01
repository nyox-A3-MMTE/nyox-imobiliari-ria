import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            
      if (response.ok) {
       const data = await response.json();
       localStorage.setItem("token", data.token);
       console.log("Login efetuado com sucesso!"+ data);
       navigate('/AdmPannel');
       setForm({ email: '', senha: '' });
       

      } else {
        console.log("Erro ao logar"+ data);
      }
      }catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
      
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  const [mensagem, setMensagem] = useState({mensagem: '', tipo: ''});

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
      console.log('Resposta do backend:', data);
      
      if (response.ok) {
       setMensagem({mensagem: data.message, tipo: 'sucesso'});
       setForm({ email: '', senha: '' });
       setTimeout(() => {
        navigate('/');
        }, 2000);
        

      } else {
        setMensagem({mensagem: 'Erro ao logar!', tipo: 'erro'});
      }
      }catch (error) {
        setMensagem({mensagem: 'Erro ao logar!', tipo: 'erro'});
      
      }
       setTimeout(() => setMensagem({ mensagem: '', tipo: '' }), 3000);
    };

  return (
    <div className="login-container">  
      <div className={`mensagem ${mensagem.tipo} ${mensagem.mensagem ? 'show' : ''}`}>
        {mensagem.mensagem}
      </div>

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
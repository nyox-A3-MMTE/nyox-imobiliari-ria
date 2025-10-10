import React, { useState } from 'react';
import './Cadastro.css';

function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
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
      const response = await fetch('http://localhost:8800/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      console.log('Resposta do backend:', data);
      
      if (response.ok) {
       setMensagem({mensagem: 'Cadastro realizado com sucesso!', tipo: 'sucesso'});
        setForm({ nome: '', email: '', senha: '' });
      } else {
        setMensagem({mensagem: 'Erro ao cadastrar!', tipo: 'erro'});
      }
      }catch (error) {
        setMensagem({mensagem: 'Erro ao cadastrar!', tipo: 'erro'});
      
      }
       setTimeout(() => setMensagem({ mensagem: '', tipo: '' }), 3000);
    };

  return (
    <div className="cadastro-container">  
      <div className={`mensagem ${mensagem.tipo} ${mensagem.mensagem ? 'show' : ''}`}>
        {mensagem.mensagem}
      </div>

      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">Cadastrar</button>
        <a href="/login">Já tem cadastro?</a>
      </form>
    </div>
  );
}

export default Cadastro;
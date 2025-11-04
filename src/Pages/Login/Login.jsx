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

  const[formregister,setformregister]=useState({
        nome:'',
        email:'',
        idade:'',
        cpf:'',
        senha:''
    });
  
  const handleChangeLogin = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeRegister = (e) => {
    setformregister({ ...formregister, [e.target.name]: e.target.value });
    };

  const handleSubmitLogin = async (e) => {
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
       if(data.type == "adm"){
        localStorage.setItem("token", data.token);
        await Alert(data.message,'Sucesso!','success');
        setTimeout(() => {
        navigate('/AdmPannel');
        }, 2000)
       }else{
        localStorage.setItem("token", data.token)
        await Alert(data.message,'Sucesso!','success');
        setTimeout(() => {
        navigate('/');
        }, 2000)
       }
       setForm({ email: '', senha: '' });

      } else {
      await  Alert(data.message,'Erro!','error');
      }
      }catch (error) {
       await Alert('Erro ao conectar ao servidor:','Erro!','error');
      }
       
    };

    const handleSubmitRegister = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch('http://localhost:8800/users/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formregister)
      });

      const data = await response.json({});

      if(response.ok){
        await Alert(data.message,'Sucesso!','success')
          setformregister({
                  nome:'',
                  email:'',
                  idade:'',
                  cpf:'',
                  senha:''
                });
                navigate('/login');
      } else {
       await Alert(data.message,'Erro!','error')
      }
    } catch (error) {
      await Alert('Erro ao conectar ao servidor:','Erro!','error')
      
    }
    }

  return (
    <div className="login-container">  
   
      

      <form onSubmit={handleSubmitRegister}>
        <h2>Cadastre-se</h2>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={formregister.nome}
          onChange={handleChangeRegister}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formregister.email}
          onChange={handleChangeRegister}
          required
        />

        <label>Idade:</label>
        <input
          type="text"
          name="idade"
          value={formregister.idade}
          onChange={handleChangeRegister}
          required
        />

        <label>CPF:</label>
        <input
          type="text"
          name="cpf"
          value={formregister.cpf}
          onChange={handleChangeRegister}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          name="senha"
          value={formregister.senha}
          onChange={handleChangeRegister}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>
      
      <form onSubmit={handleSubmitLogin}>
        <h2>Já possui uma conta ?</h2>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChangeLogin}
            required
          />
        
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChangeLogin}
            required
          />
        <button type="submit" >Enviar</button>
        <button  type="button"  onClick={()=>window.location="/"}>Sair</button>
      </form>
    </div>
  );
}

export default Login;
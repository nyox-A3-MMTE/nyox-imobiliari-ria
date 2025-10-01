import './Create.css';
import { useState } from 'react';

function Create() {
  const [formData, setFormData] = useState({
    descricao: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    tipo: "",
    quartos: "",
    banheiros: "",
    vagas_garagem: "",
    area_total: "",
    valor: "",
  });

  let [mensagem, setMensagem] = useState("");
  let[estilo, setEstilo] = useState({
    color: '',
    fontSize: '20px',
    fontWeight: 'bold',
  });

  function consultarCEP() {
    const cep = formData.cep;

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                setMensagem('CEP não encontrado.');
                setEstilo({
                  color: 'red',
                  fontSize: '20px',
                  fontWeight: 'bold',
                });
                return;
            };
           setFormData(prev => ({
            ...prev,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            }));
            
        })
        .catch(error => {
            setMensagem('Ocorreu um erro ao consultar o CEP.');
                setEstilo({
                  color: 'red',
                  fontSize: '20px',
                  fontWeight: 'bold',
                });
            console.error('Erro:', error);
        });
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    ...formData,
    cep: Number(formData.cep),
    quartos: Number(formData.quartos),
    banheiros: Number(formData.banheiros),
    vagas_garagem: Number(formData.vagas_garagem),
    area_total: Number(formData.area_total),
    valor: Number(formData.valor),
  };



    try {
      const res = await fetch('http://localhost:8800/imoveis/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMensagem('Imóvel cadastrado com sucesso!');
        setTimeout(() => {
        setMensagem('');
        }, 3000);
        setEstilo({
          color: 'green',
          fontSize: '20px',
          fontWeight: 'bold',
        });
        setFormData({
          descricao: "",
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          tipo: "",
          quartos: "",
          banheiros: "",
          vagas_garagem: "",
          area_total: "",
          valor: "",
        });
      } else {
       setMensagem('Erro ao cadastrar imóvel.');
       setEstilo({
        color: 'red',
        fontSize: '20px',
        fontWeight: 'bold',
      });
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Erro ao cadastrar imóvel.');
      setEstilo({
        color: 'red',
        fontSize: '20px',
        fontWeight: 'bold',
      });
    }
  };

  

  return (
    <div className="create-container">
      <h2 style={estilo}>{mensagem}</h2>
      <h1>Cadastro de Imóveis</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-left">
            <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
            <input type="number" name="cep" placeholder="CEP" value={formData.cep} onBlur={consultarCEP}  onChange={handleChange} required />
            <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} required />
            <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} required />
            <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
            <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
          </div>
          <div className="form-right">
            <input type="text" name="tipo" placeholder="Tipo" value={formData.tipo} onChange={handleChange} required />
            <input type="number" name="quartos" placeholder="Quartos" value={formData.quartos} onChange={handleChange} />
            <input type="number" name="banheiros" placeholder="Banheiros" value={formData.banheiros} onChange={handleChange} />
            <input type="number" name="vagas_garagem" placeholder="Vagas de garagem" value={formData.vagas_garagem} onChange={handleChange} />
            <input type="number" step="0.01" name="area_total" placeholder="Área total (m²)" value={formData.area_total} onChange={handleChange} />
            <input type="number" step="0.01" name="valor" placeholder="Valor (R$)" value={formData.valor} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="CadastroButton">Cadastrar Imóvel</button>
      </form>
    </div>
  );
}

export default Create;

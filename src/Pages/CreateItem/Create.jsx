import './Create.css';
import { useState,useEffect } from 'react';
import Alert from '../../Components/Alert/Alert';
import Sidebar from '../../Components/Sidebar/Sidebar';



function Create() {

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login"; 
      } 
    }, []);


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


  function consultarCEP() {
    const cep = formData.cep;

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                Alert(response.message,'Erro!','error')
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
            Alert('Erro ao Buscar CEP:','Erro!','error')
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
       await Alert(res.message,'Sucesso!','success')
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
       await Alert(res.message,'Erro!','error')
      }
    } catch (error) {
      await Alert('Erro ao conectar ao servidor:','Erro!','error')
    }
  };

  

  return (
    <div>
      <Sidebar></Sidebar>
    <div className="create-container">
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
    </div>
  );
}

export default Create;

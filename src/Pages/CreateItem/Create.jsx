import { useEffect, useState } from 'react';
import Alert from '../../Components/Alert/Alert';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Create.css';

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
    imagens: [],
  });
  
  const [previews, setPreviews] = useState([]);


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

    const payload = new FormData();

    payload.append("descricao", formData.descricao);
    payload.append("endereco", formData.endereco);
    payload.append("bairro", formData.bairro);
    payload.append("cidade", formData.cidade);
    payload.append("estado", formData.estado);
    payload.append("tipo", formData.tipo);
    payload.append("cep", Number(formData.cep));
    payload.append("quartos", Number(formData.quartos));
    payload.append("banheiros", Number(formData.banheiros));
    payload.append("vagas_garagem", Number(formData.vagas_garagem));
    payload.append("area_total", Number(formData.area_total));
    payload.append("valor", Number(formData.valor));

    formData.imagens.forEach((file) => {
      payload.append("imagens", file)
    });

    try {
      const res = await fetch('http://localhost:8800/imoveis/register', {
        method: 'POST',
        body: payload
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
          imagens: [],
        });
        setPreviews([]);
      } else {
       await Alert(res.message,'Erro!','error')
      }
    } catch (error) {
      await Alert('Erro ao conectar ao servidor:','Erro!','error')
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    const limit = 5;
    const total = formData.imagens.length + files.length;
    
    if(total > limit){
      Alert(`Limite de ${limit} imagens atingido.`, "Atenção!", "warning")
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imagens: [...prev.imagens, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
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
          <div className="form-down">
            <input type="file" accept="image/*" multiple name="image" onChange={handleImageChange}/>
            <div className="preview-container">
              {previews.map((src, index) =>(
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-32 h-32 object-cover rounded mr-2"
                  />
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="CadastroButton">Cadastrar Imóvel</button>
      </form>
    </div>
    </div>
  );
}

export default Create;

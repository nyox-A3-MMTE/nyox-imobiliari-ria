import { useEffect, useState } from 'react';
import Alert from '../../Components/Alert/Alert';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Create.css';
const API_URL = import.meta.env.VITE_API_URL;

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

  // Limpar URLs de preview ao desmontar
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const consultarCEP = () => {
    const cep = formData.cep;

    if (!cep) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          Alert('CEP não encontrado','Erro!','error');
          return;
        }
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      })
      .catch(() => {
        Alert('Erro ao buscar CEP','Erro!','error');
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const limit = 10;
    const total = formData.imagens.length + files.length;

    if (total > limit) {
      Alert(`Limite de ${limit} imagens atingido.`, "Atenção!", "warning");
      return;
    }

    setFormData(prev => ({
      ...prev,
      imagens: [...prev.imagens, ...files],
    }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imagens.length < 3) {
      Alert('Mínimo de 3 imagens devem ser selecionadas','Atenção!','warning');
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'imagens') {
        payload.append(key, value);
      }
    });
    formData.imagens.forEach(file => payload.append("imagens", file));

    try {
      const res = await fetch(`${API_URL}/imoveis/register`, {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();

      if (res.ok) {
        await Alert(data.message,'Sucesso!','success');
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
        await Alert(data.message,'Erro!','error');
      }
    } catch (error) {
      await Alert('Erro ao conectar ao servidor','Erro!','error');
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="create-container">
        <h1>Cadastro de Imóveis</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-left">
              <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
              <input type="number" name="cep" placeholder="CEP" value={formData.cep} onBlur={consultarCEP} onChange={handleChange} required />
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
              <label htmlFor="file-upload" className="upload-label">Selecionar imagens</label>
              <input type="file" id="file-upload" accept="image/*" multiple name="imagens" onChange={handleImageChange} />

              {previews.length > 0 && (
                <div className="preview-container">
                  {previews.map((src, index) => (
                    <div key={index} className="preview-item">
                      <img src={src} alt={`Preview ${index + 1}`} className="imagem-box" />
                      <span className="preview-index">{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="CadastroButton">Cadastrar Imóvel</button>
        </form>
      </div>
    </div>
  );
}

export default Create;

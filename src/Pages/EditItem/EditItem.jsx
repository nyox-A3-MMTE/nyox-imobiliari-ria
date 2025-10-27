import './EditItem.css';
import { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

function EditItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state;

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  async function listaImovel() {
    try {
      const response = await fetch(`http://localhost:8800/imoveis/listforid/${id.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Aqui você deve preencher o formData com o retorno
        if (data && data.length > 0) {
          setFormData(data[0]); // supondo que o backend retorne um array com 1 item
        }
      } else {
        console.error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  }

  useEffect(() => {
    listaImovel();
  }, []);

  function consultarCEP() {
    const cep = formData.cep;
    if (!cep) return;

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          Alert('CEP não encontrado', 'Erro!', 'error');
          return;
        }
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      })
      .catch(error => {
        Alert('Erro ao Buscar CEP:', 'Erro!', 'error');
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
      const res = await fetch(`http://localhost:8800/imoveis/update/${id.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        await Alert(data.message, 'Sucesso!', 'success');
        navigate('/AdmPannel'); 
      } else {
        await Alert(data.message, 'Erro!', 'error');
      }
    } catch (error) {
      await Alert('Erro ao conectar ao servidor:', 'Erro!', 'error');
    }
  };

  return (
    <div className='secao'>
      <Sidebar />
      <div className="edit-container">
        <h1>Edição de Imóveis</h1>
        <form onSubmit={handleSubmit}>
          <div className="edit-form-grid">
            <div className="edit-form-left">
              <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
              <input type="number" name="cep" placeholder="CEP" value={formData.cep} onBlur={consultarCEP} onChange={handleChange} required />
              <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} required />
              <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} required />
              <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
              <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
            </div>
            <div className="edit-form-right">
              <input type="text" name="tipo" placeholder="Tipo" value={formData.tipo} onChange={handleChange} required />
              <input type="number" name="quartos" placeholder="Quartos" value={formData.quartos} onChange={handleChange} />
              <input type="number" name="banheiros" placeholder="Banheiros" value={formData.banheiros} onChange={handleChange} />
              <input type="number" name="vagas_garagem" placeholder="Vagas de garagem" value={formData.vagas_garagem} onChange={handleChange} />
              <input type="number" step="0.01" name="area_total" placeholder="Área total (m²)" value={formData.area_total} onChange={handleChange} />
              <input type="number" step="0.01" name="valor" placeholder="Valor (R$)" value={formData.valor} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="edit-button">
            Salvar Alterações
          </button>
        </form>
            <div className='exibirimovel'>
                <div className="imoveledit">
                    <div className='resize'>
                      <h2>{formData.descricao}</h2>
                      <p>Bairro: {formData.bairro}</p>
                      <p>Cidade: {formData.cidade}</p>
                      <p>Estado: {formData.estado}</p>
                      <p>Tipo: {formData.tipo}</p>
                      </div>
                      <div>
                      <p>Quartos: {formData.quartos}</p>
                      <p>Banheiros: {formData.banheiros}</p>
                      <p>Vagas na garagem: {formData.vagas_garagem}</p>
                      <p>Área total: {formData.area_total} m²</p>
                      <p>Valor: {formData.valor}</p>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
}

export default EditItem;

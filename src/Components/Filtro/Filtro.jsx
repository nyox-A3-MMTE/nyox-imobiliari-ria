import React, { useState, useEffect, useMemo} from 'react';
import './Filtro.css';
import { NumericFormat } from 'react-number-format';
import { FaSearch } from 'react-icons/fa';
import useDebounce from '../Debounce/useDebounce.jsx'

function Filtro({ onFiltrar }) {
  const [imoveisOriginais, setImoveisOriginais] = useState([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("Comprar");
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(0);
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");

  const [sugestao, setSugestao] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  const debouncedSugestao = useDebounce(sugestao, 500);
  const [inputFocado, setInputFocado] = useState(false);

  const params = new URLSearchParams();

  // feito pra nao ter que ficar renderizando toda hora
const cidadesUnicas = useMemo(() => {
  // Verifica se imoveis é um array. Se não for, usa um array vazio.
  const imoveisArray = Array.isArray(imoveisOriginais) ? imoveisOriginais : [];
  return [...new Set(imoveisArray.map(imovel => imovel.cidade))];
}, [imoveisOriginais]); 

// O mesmo para bairrosUnicos:
const bairrosUnicos = useMemo(() => {
  const imoveisArray = Array.isArray(imoveisOriginais) ? imoveisOriginais : [];
  return [...new Set(imoveisArray.map(imovel => imovel.bairro))];
}, [imoveisOriginais]);

// O mesmo para tiposImoveisUnicos:
const tiposImoveisUnicos = useMemo(() => {
  const imoveisArray = Array.isArray(imoveisOriginais) ? imoveisOriginais : [];
  return [...new Set(imoveisArray.map(imovel => imovel.tipo))];
}, [imoveisOriginais]);


  useEffect(() => {
    if (debouncedSugestao.trim() === "") {
      setSugestoes([]);
      return;
    }

    const filtradas = [
      ...cidadesUnicas.filter(cidade =>
        cidade?.toLowerCase().startsWith(debouncedSugestao.toLowerCase())
      ),
      ...bairrosUnicos.filter(bairro =>
        bairro?.toLowerCase().startsWith(debouncedSugestao.toLowerCase())
      )
      
    ];

    setSugestoes(filtradas);

  }, [debouncedSugestao, cidadesUnicas, bairrosUnicos]);
  async function listaImoveis() {
    try {
      const response = await fetch('http://localhost:8800/imoveis/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setImoveisOriginais(data);
      } else {
        console.error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  }

  useEffect(() => {
    listaImoveis();
  }, []);
 
  function handleOpcaoChange(opcao) {
    setOpcaoSelecionada(opcao);
  }
 async function handleFiltrar(event) {
    event.preventDefault();


    params.set("localizacao", sugestao);
    params.set("precoMin", precoMin);
    params.set("precoMax", precoMax);
    params.set("opcaoImovel", opcaoSelecionada);
    params.set("tipoImovel", tipoSelecionado);

    if(opcaoSelecionada === "Comprar"){
      const url = `/venda?${params.toString()}`;
      try{
        const response = await fetch("http://localhost:8800/imoveis" + url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

       if (response.ok){
          const data = await response.json();
          
          const imoveisArray = data.imoveis || []; 

          onFiltrar(Array.isArray(imoveisArray) ? imoveisArray : []); 
        }else{
          console.error('Erro na resposta do servidor');
          console.log(response.status,'Erro!','error')
        }
    } catch (error) {
      console.log("erro ", error);

    }

    }else{
      const url = `/aluguel?${params.toString()}`;
      try{
        const response = await fetch("http://localhost:8800/imoveis" + url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

       if (response.ok){
          const data = await response.json();
          
          const imoveisArray = data.imoveis || []; 
          
          onFiltrar(Array.isArray(imoveisArray) ? imoveisArray : []); 
        }else{
          console.error('Erro na resposta do servidor');
          console.log(response.status,'Erro!','error')
        }
    } catch (err) {
      console.log("erro ", err);
      
    }
    }
  }

    return (
       <div className='contentFilter'>
        <div className='buttonContainer'>
            <button id="alugar" className="buttonCheckbox" type="button" onClick={() => handleOpcaoChange("Alugar")} style={{
              backgroundColor: opcaoSelecionada === 'Alugar' ? '#223555' : '#303d55ff', 
              color: opcaoSelecionada === 'Alugar' ? 'white' : '#ffffff9a'
              }}>Alugar</button>

            <button id="comprar" className="buttonCheckbox" type="button" onClick={() => handleOpcaoChange("Comprar")} style={{
              backgroundColor: opcaoSelecionada === 'Comprar' ? '#223555' : '#303d55ff', 
              color: opcaoSelecionada === 'Comprar' ? 'white' : '#ffffff88',
              font: opcaoSelecionada === 'Comprar' ? 'bold' : 'normal'
              }}>Comprar</button>
        </div>
        <div className='containerInnerFilter'> 
            <div className='containerInputs'>
            <label>Tipo de Imóvel</label>
              <div className='containerInputsContents'>
            <select
            id='tipoImovel'
            onChange={(e) => {
              setTipoSelecionado(e.target.value)
            }}>
                <option value="Todos">Todos</option>
                {tiposImoveisUnicos.map((tipos, index) => (
                  <option key={index} value={tipos}>{tipos}</option>
                ))}
            </select>

            <div className='localizacaoContainer'>
              <input
                id="inputLocalizacao"
                type="text"
                placeholder='Cidade, bairro ou estado'
                value={sugestao}
                onFocus={() => setInputFocado(true)}
                onBlur={() => setTimeout(() => setInputFocado(false), 200)} 
                onChange={e => setSugestao(e.target.value)}
                
                className='inputs'
              />

              {}
              {sugestoes.length > 0 && inputFocado &&(
                <ul id="suggestionsList">
                  {sugestoes.map((item, index) => (
                    <li
                      key={index}
                      className="opcaoContainer"
                      onClick={() => {
                        setSugestao(item);
                        setSugestoes([])
                        
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="buttonFilter" type="button" onClick={e =>handleFiltrar(e)}>
              <FaSearch size={15} color="black" />
            </button>
              </div>
            </div>

            
            <div className='priceContainer'>
            <div className='priceLabelContainer'>
            <label id="precoLabel">Preço</label>
            </div>
            <div className='numericInputContainer'>

            <NumericFormat
            id="precoMin"
            className='inputs'
            prefix="R$"
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            placeholder='Min'
            onValueChange={(values)=>{
              setPrecoMin(values.floatValue ?? 0);
            }}
            />

            <NumericFormat
            id="precoMax"
            prefix="R$"
            className='inputs'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            onValueChange={(values)=>{
              setPrecoMax(values.floatValue ?? 0);
            }}
            placeholder='Max'
            />
            </div>
            
            </div>


            
        </div>
       </div>
    );
}

export default Filtro;
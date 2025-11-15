import { MapContainer, TileLayer, Circle, useMap} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";


import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_COORDS = [-19.92083, -43.93778];

const CACHE_TIME_LIMIT = 48 * 60 * 60 * 1000;

if (!localStorage.getItem("localizacoes")) {
  localStorage.setItem("localizacoes", JSON.stringify([]));
}

export default function MapView({imovel}) {

  const [coord, setCoords] = useState(DEFAULT_COORDS);

  const enderecoCompleto = `${imovel.endereco}, ${imovel.cidade}, ${imovel.estado}`

  function isExpired(timestamp){
    return Date.now() - timestamp > CACHE_TIME_LIMIT;
  }

  function cleanExpired(cache){
    return cache.filter(item => !isExpired(item.time));
  }

  useEffect(() =>{
    const load = async () =>{

      let cache = JSON.parse(localStorage.getItem("localizacoes")) || [];
      cache = cleanExpired(cache);

      const localizacao = cache.find(item => item.id === imovel.id);

      if(localizacao){
        setCoords(localizacao.coord);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8800/imoveis/coords/${encodeURIComponent(enderecoCompleto)}`
        );

        if (!res.ok) {
          const err = await res.json().catch(()=>({message: 'Erro na resposta do servidor'}));
          console.error("Erro ao obter coords:", err);
          return;
        }

        const data = await res.json();
        const coord = [parseFloat(data.lat), parseFloat(data.lon)];
        setCoords(coord);


        const novaEntrada = {
          id: imovel.id,
          coord: coord,
          time: Date.now(),
        }

        cache.push(novaEntrada);
        localStorage.setItem("localizacoes", JSON.stringify(cache));

      } catch (err) {
        console.error("Erro ao buscar endereço:", err);
        setCoords(DEFAULT_COORDS);
      }
    }
    if(enderecoCompleto.trim().length > 0) load();

  }, [enderecoCompleto]);

  function MoveMap({coord}){
    const map = useMap();
    map.setView(coord);
    return null;
  }
  
  return (
    <MapContainer
      center={coord}
      zoom={15}
      scrollWheelZoom={true}
    >
      <MoveMap coord={coord}/>

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap Contributors"
      />

      <Circle
        center={coord}
        radius={250}
        color="blue"
        fillOpacity={0.3}
      />
    </MapContainer>
  );
}

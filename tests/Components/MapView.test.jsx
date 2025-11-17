import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import MapView from "../../src/Components/MapView/MapView";

const mockSetView = vi.fn();
const mockUseMap = vi.fn(() => ({
  setView: mockSetView,
}));

vi.mock("react-leaflet", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Circle: ({ center }) => <div data-testid="circle" data-center={JSON.stringify(center)} />,
    useMap: () => mockUseMap(),
  };
});

global.fetch = vi.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockImovel = {
  id: 1,
  endereco: "123 Main St",
  cidade: "Anytown",
  estado: "CA",
};

describe("MapView Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    global.fetch.mockReset();
  });

  it("deve renderizar o container do mapa e componentes filhos", () => {
    render(<MapView imovel={mockImovel} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("circle")).toBeInTheDocument();
  });

  it("deve buscar coordenadas da API quando o cache está vazio", async () => {
    const mockCoords = { lat: "34.0522", lon: "-118.2437" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCoords,
    });

    render(<MapView imovel={mockImovel} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const expectedUrl = `http://localhost:8800/imoveis/coords/123%20Main%20St%2C%20Anytown%2C%20CA`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
    });

    await waitFor(() => {
      expect(mockSetView).toHaveBeenCalledWith([parseFloat(mockCoords.lat), parseFloat(mockCoords.lon)]);
      const cachedData = JSON.parse(localStorage.getItem("localizacoes"));
      expect(cachedData[0].id).toBe(mockImovel.id);
      expect(cachedData[0].coord).toEqual([parseFloat(mockCoords.lat), parseFloat(mockCoords.lon)]);
    });
  });

  it("deve usar coordenadas do cache se forem válidas", async () => {
    const cachedCoords = {
      id: mockImovel.id,
      coord: [35.0, -120.0],
      time: Date.now(),
    };
    localStorage.setItem("localizacoes", JSON.stringify([cachedCoords]));

    render(<MapView imovel={mockImovel} />);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockSetView).toHaveBeenCalledWith(cachedCoords.coord);
    });
  });

  it("deve buscar coordenadas da API se o cache estiver expirado", async () => {
    const expiredTime = Date.now() - 50 * 60 * 60 * 1000; // 50 horas atrás
    const expiredCoords = {
      id: mockImovel.id,
      coord: [35.0, -120.0],
      time: expiredTime,
    };
    localStorage.setItem("localizacoes", JSON.stringify([expiredCoords]));

    const newMockCoords = { lat: "40.7128", lon: "-74.0060" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newMockCoords,
    });

    render(<MapView imovel={mockImovel} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    
    await waitFor(() => {
        expect(mockSetView).toHaveBeenCalledWith([parseFloat(newMockCoords.lat), parseFloat(newMockCoords.lon)]);
    });
  });

  it("deve lidar com erro na API e manter coordenadas padrão", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Erro na resposta do servidor' }), // Mock a JSON response for error
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<MapView imovel={mockImovel} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith("Erro ao obter coords:", { message: 'Erro na resposta do servidor' });
      // Verifica se setView foi chamado apenas com as coordenadas padrão iniciais (se houver)
      // ou se não foi chamado novamente com coordenadas da API.
      expect(mockSetView).not.toHaveBeenCalledWith(expect.not.arrayContaining([-19.92083, -43.93778]));
    });

    consoleSpy.mockRestore();
  });
});

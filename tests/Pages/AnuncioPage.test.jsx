import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AnuncioPage from "../../src/Pages/AnuncioPage/AnuncioPage";
import Alert from "../../src/Components/Alert/Alert";

// Mocking necessary modules and components
const mockNavigate = vi.fn();
vi.mock("../../src/Components/Alert/Alert");
vi.mock("../../src/Components/Header/Header", () => ({ default: () => <header>Header</header> }));
vi.mock("../../src/Components/Carrossel/Carrossel", () => ({ default: () => <div data-testid="carrossel"></div> }));
vi.mock("../../src/Components/MapView/MapView", () => ({ default: () => <div data-testid="map-view"></div> }));
vi.mock("../../src/Components/AnuncioCard/AnuncioCard", () => ({ default: () => <div data-testid="anuncio-card"></div> }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();

const mockImovel = {
  id: 1,
  descricao: "Apartamento de 2 quartos em Copacabana",
  valor: 500000,
  modalidade: "venda",
  endereco: "Avenida Atlântica, 1702",
  bairro: "Copacabana",
  cidade: "Rio de Janeiro",
  estado: "RJ",
  cep: "22021-001",
  area_total: 85,
  quartos: 2,
  banheiros: 2,
  vagas_garagem: 1,
  imagens: ["img1.jpg", "img2.jpg"],
};

const renderPage = () => render(
  <BrowserRouter>
    <AnuncioPage />
  </BrowserRouter>
);

describe("AnuncioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
  });

  it("deve exibir a mensagem 'Carregando...' inicialmente", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [mockImovel] });
    renderPage();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });
  });

  it("deve renderizar os detalhes do imóvel após o carregamento", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [mockImovel] });
    renderPage();

    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {level: 1, name: mockImovel.descricao})).toBeInTheDocument();
    expect(screen.getByText("R$ 500.000,00")).toBeInTheDocument();
    expect(screen.getByText(mockImovel.modalidade.toUpperCase())).toBeInTheDocument();
    expect(screen.getByText(/Avenida Atlântica/)).toBeInTheDocument();
    expect(screen.getByText(/85 m²/)).toBeInTheDocument();
    expect(screen.getByTestId("carrossel")).toBeInTheDocument();
    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });

  it("deve chamar Alert e navegar para /Main em caso de erro na busca", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Erro ao carregar imovel", 'Erro!', 'error');
      expect(mockNavigate).toHaveBeenCalledWith("/Main");
    });
  });

  it("deve chamar Alert e navegar para /Main em caso de erro de rede", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));
    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith('Erro ao conectar ao servidor:', 'Erro!', 'error');
      expect(mockNavigate).toHaveBeenCalledWith("/Main");
    });
  });

   it("deve formatar o preço corretamente", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [mockImovel] });
    renderPage();
    
    const priceElement = await screen.findByText("R$ 500.000,00");
    expect(priceElement).toBeInTheDocument();
  });

});

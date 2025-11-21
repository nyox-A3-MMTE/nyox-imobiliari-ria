import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import Filtro from "../../src/Components/Filtro/Filtro";

const API_URL = import.meta.env.VITE_API_URL;

global.fetch = vi.fn();

const mockImoveis = [
  { id: 1, cidade: "Rio de Janeiro", bairro: "Copacabana", tipo: "Apartamento" },
  { id: 2, cidade: "São Paulo", bairro: "Liberdade", tipo: "Casa" },
  { id: 3, cidade: "Rio de Janeiro", bairro: "Ipanema", tipo: "Apartamento" },
];

const mockOnFiltrar = vi.fn();

const renderFiltro = () => render(<Filtro imoveis={mockImoveis} onFiltrar={mockOnFiltrar} />);

describe("Filtro Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the initial fetch inside Filtro component
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImoveis,
    });
  });

  it("deve renderizar com valores padrão", async () => {
    renderFiltro();
    await waitFor(() => {
      expect(screen.getByText("Alugar")).toBeInTheDocument();
      expect(screen.getByText("Comprar")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Cidade, bairro ou estado")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
    });
  });

  it("deve alternar entre Alugar e Comprar", async () => {
    renderFiltro();
    const alugarButton = await screen.findByText("Alugar");
    const comprarButton = await screen.findByText("Comprar");

    fireEvent.click(alugarButton);
    expect(alugarButton).toHaveStyle("background-color: rgb(34, 53, 85)");
    
    fireEvent.click(comprarButton);
    expect(comprarButton).toHaveStyle("background-color: rgb(34, 53, 85)");
  });

  it("deve mostrar sugestões de localização ao digitar", async () => {
    renderFiltro();
    const locationInput = await screen.findByPlaceholderText("Cidade, bairro ou estado");
    
    fireEvent.focus(locationInput);
    fireEvent.change(locationInput, { target: { value: "Rio" } });

    await waitFor(() => {
      expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument();
    });
  });

  it("deve chamar onFiltrar com os resultados da busca", async () => {
    const filteredImoveis = [mockImoveis[0]];
    // Mock for the initial fetch + mock for the filter fetch
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ imoveis: filteredImoveis }),
    });

    const { container } = renderFiltro();
    
    const locationInput = await screen.findByPlaceholderText("Cidade, bairro ou estado");
    fireEvent.change(locationInput, { target: { value: "Copacabana" } });

    const searchButton = container.querySelector('.buttonFilter');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      const expectedUrl = `${API_URL}/imoveis/venda?localizacao=Copacabana&precoMin=0&precoMax=0&opcaoImovel=Comprar&tipoImovel=Todos`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
      expect(mockOnFiltrar).toHaveBeenCalledWith(filteredImoveis);
    });
  });

  it("deve atualizar os valores de preço", async () => {
    const { container } = renderFiltro();
    const minPriceInput = await screen.findByPlaceholderText("Min");
    const maxPriceInput = screen.getByPlaceholderText("Max");

    fireEvent.change(minPriceInput, { target: { value: "R$100.000" } });
    fireEvent.change(maxPriceInput, { target: { value: "R$500.000" } });

    // The NumericFormat component processes the value, we can check the fetch call
    // to see if the state was updated correctly.
    const searchButton = container.querySelector('.buttonFilter');
    
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ imoveis: [] }),
    });
    
    fireEvent.click(searchButton);

    await waitFor(() => {
      const expectedUrl = `${API_URL}/imoveis/venda?localizacao=&precoMin=100000&precoMax=500000&opcaoImovel=Comprar&tipoImovel=Todos`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
  });
});

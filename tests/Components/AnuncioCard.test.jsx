import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AnuncioCard from "../../src/Components/AnuncioCard/AnuncioCard";
import { expect } from "vitest";

vi.mock("../../src/Components/Carrossel/Carrossel", () => ({
  default: ({ imagens }) => (
    <div data-testid="mock-carrossel">
      {imagens && imagens.length > 0 ? (
        <img src={imagens[0]} alt="Mock Carrossel Image" />
      ) : (
        <span>No Image</span>
      )}
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AnuncioCard Component", () => {
  const mockImovel = {
    id: "123",
    tipo: "Apartamento",
    descricao: "Moderno",
    valor: 500000,
    imagens: ["image1.jpg", "image2.jpg"],
    area_total: 100,
    quartos: 5,
    banheiros: 4,
    vagas_garagem: 3,
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (imovel = mockImovel) =>
    render(
      <BrowserRouter>
        <AnuncioCard imovel={imovel} />
      </BrowserRouter>
    );

  it("deve renderizar os detalhes do imovel corretamente", () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /Apartamento Moderno/i })).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.area_total} m²`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.quartos}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.banheiros}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.vagas_garagem}`)).toBeInTheDocument();

    expect(screen.getByTestId("mock-carrossel")).toBeInTheDocument();
    expect(screen.getByAltText("Mock Carrossel Image")).toHaveAttribute("src", mockImovel.imagens[0]);
  });

  it("deve navegar para a página de detalhes ao clicar no botão", () => {
    renderComponent();

    const detailsButton = screen.getByText("Ver detalhes");
    fireEvent.click(detailsButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/AnuncioPage/${mockImovel.id}`);
  });

  it("deve renderizar localização sem bairro", () => {
    const imovelSemBairro = { ...mockImovel, bairro: "" };
    renderComponent(imovelSemBairro);

    expect(screen.getByText("Localização: São Paulo - SP")).toBeInTheDocument();
  });
});

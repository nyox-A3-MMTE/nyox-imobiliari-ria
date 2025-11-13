import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

describe("AnuncioCard Component", () => {
  const mockImovel = {
    id: "123",
    tipo: "Apartamento",
    descricao: "Moderno",
    valor: 500000,
    localizacao: "Centro, Cidade",
    imagens: ["image1.jpg", "image2.jpg"],
    area_total: 100,
    quartos: 5,
    banheiros: 4,
    vagas_garagem: 3,
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
  };

  const mockOnButtonClick = vi.fn();

  const renderComponent = (imovel = mockImovel, onButtonClick = mockOnButtonClick) =>
    render(<AnuncioCard imovel={imovel} onButtonClick={onButtonClick} />);

  it("deve renderizar os detalhes do imovel corretamente", () => {
    renderComponent();

    expect(screen.getByText(`${mockImovel.tipo} ${mockImovel.descricao}`)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${mockImovel.valor}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.area_total} m²`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.quartos}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.banheiros}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockImovel.vagas_garagem}`)).toBeInTheDocument();

    expect(screen.getByTestId("mock-carrossel")).toBeInTheDocument();
    expect(screen.getByAltText("Mock Carrossel Image")).toHaveAttribute("src", mockImovel.imagens[0]);
  });

  it("deve chamar onButtonClick quando o botão 'Ver detalhes' for clicado", () => {
    renderComponent();

    const detailsButton = screen.getByText("Ver detalhes");
    fireEvent.click(detailsButton);

    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
    expect(mockOnButtonClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it("deve renderizar localização sem bairro", () => {
    const imovelSemBairro = { ...mockImovel, bairro: "" };
    renderComponent(imovelSemBairro);

    expect(screen.getByText("Localização: São Paulo - SP")).toBeInTheDocument();
  });
});

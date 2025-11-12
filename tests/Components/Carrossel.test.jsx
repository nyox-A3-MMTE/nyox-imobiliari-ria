import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Carrossel from "../../src/Components/Carrossel/Carrossel";

vi.mock("slick-carousel/slick/slick.css", () => ({}));
vi.mock("slick-carousel/slick/slick-theme.css", () => ({}));
vi.mock("react-slick", () => {
  const MockSlider = ({ children }) => {
    const slides = React.Children.toArray(children);
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToNext = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const goToPrev = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
      <div data-testid="mock-slider">
        <button onClick={goToPrev} data-testid="prev-button">Previous</button>
        {slides[currentSlide]}
        <button onClick={goToNext} data-testid="next-button">Next</button>
      </div>
    );
  };
  return {
    __esModule: true,
    default: MockSlider,
  };
});

describe("Carrossel Component", () => {
  const mockImages = ["image1.jpg", "image2.jpg", "image3.jpg"];

  it("deve renderizar a primeira imagen inicalmente", () => {
    render(<Carrossel imagens={mockImages} />);

    expect(screen.getByTestId("mock-slider")).toBeInTheDocument();
    expect(screen.getByAltText("Imagem 1")).toHaveAttribute("src", "image1.jpg"); 
    expect(screen.queryByAltText("Imagem 2")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Imagem 3")).not.toBeInTheDocument();
  });

  it("deve navegar para a proxima imagen quando next-button for clicado", () => {
    render(<Carrossel imagens={mockImages} />);

    fireEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByAltText("Imagem 2")).toHaveAttribute("src", "image2.jpg");
    expect(screen.queryByAltText("Imagem 1")).not.toBeInTheDocument();
  });

  it("deve navegar para a imagen anterior quando prev-button for clicado", () => {
    render(<Carrossel imagens={mockImages} />);

    fireEvent.click(screen.getByTestId("next-button"));
    expect(screen.getByAltText("Imagem 2")).toHaveAttribute("src", "image2.jpg");

    fireEvent.click(screen.getByTestId("prev-button"));
    expect(screen.getByAltText("Imagem 1")).toHaveAttribute("src", "image1.jpg");
    expect(screen.queryByAltText("Imagem 2")).not.toBeInTheDocument();
  });

  it("deve voltar para a primeira imagem após chegar ao final", () => {
    render(<Carrossel imagens={mockImages} />);

    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("next-button")); 

    expect(screen.getByAltText("Imagem 1")).toHaveAttribute("src", "image1.jpg");
  });

  it("deve ir para a última imagem após chegar ao início", () => {
    render(<Carrossel imagens={mockImages} />);

    fireEvent.click(screen.getByTestId("prev-button"));

    expect(screen.getByAltText("Imagem 3")).toHaveAttribute("src", "image3.jpg");
  });
});

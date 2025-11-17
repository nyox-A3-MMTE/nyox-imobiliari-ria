import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../src/Components/Sidebar/Sidebar";
import { optionsObjects } from "../../src/Components/Sidebar/SidebarObjects";

const originalLocation = window.location;
const originalLocalStorage = window.localStorage;

beforeAll(() => {
  delete window.location;
  window.location = { ...originalLocation, pathname: "/", href: "" };

  delete window.localStorage;
  window.localStorage = {
    ...originalLocalStorage,
    removeItem: vi.fn(),
  };
});

afterAll(() => {
  window.location = originalLocation;
  window.localStorage = originalLocalStorage;
});

describe("Sidebar Component", () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

  it("deve renderizar o logo", () => {
    renderComponent();
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
  });

  it("deve renderizar todos os links de navegação do SidebarObjects", () => {
    renderComponent();
    optionsObjects.forEach((item) => {
      if (item.title) {
        const linkElement = screen.getByText(item.title);
        expect(linkElement).toBeInTheDocument();

        const iconElement = linkElement.previousSibling;
        expect(iconElement).toBeInTheDocument();
      }
    });
  });

  it("deve tentar navegar quando um link for clicado", () => {
    renderComponent();
    const link = screen.getByText("Início");
    fireEvent.click(link);
    expect(window.location.pathname).toBe("AdmPannel");
  });
  
  it("deve lidar com logout corretmente", () => {
    renderComponent();
    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(window.location.href).toBe("/login");
  });
});

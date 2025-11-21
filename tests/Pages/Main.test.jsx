import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import jwtDecode from "jwt-decode";
import Main from "../../src/Pages/Main/Main";
import Alert from "../../src/Components/Alert/Alert";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("jwt-decode", () => ({ default: vi.fn() }));

vi.mock("../../src/Components/AnuncioCard/AnuncioCard", () => ({
  default: ({ imovel }) => <div data-testid="anuncio-card">{imovel.descricao}</div>,
}));

vi.mock("../../src/Components/Header/Header", () => ({
  default: ({ user }) => <div data-testid="header-user">{user}</div>,
}));

global.fetch = vi.fn();
const mockJwtDecode = jwtDecode;

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (k) => store[k],
    setItem: (k, v) => (store[k] = v.toString()),
    clear: () => (store = {}),
    removeItem: vi.fn((k) => delete store[k]),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockFetch = (data = []) => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => data,
  });
};

const renderMain = () => render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  global.fetch.mockReset();
});

describe("Main Page", () => {
  it("deve carregar e renderizar uma lista de imóveis", async () => {
    const mockImoveis = [
      { id: 1, descricao: "Imovel 1" },
      { id: 2, descricao: "Imovel 2" },
    ];
    mockFetch(mockImoveis);
    renderMain();

    const cards = await screen.findAllByTestId("anuncio-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Imovel 1")).toBeInTheDocument();
    expect(screen.getByText("Imovel 2")).toBeInTheDocument();
  });

  it("deve exibir 'Sign In/Up' quando não há token", async () => {
    mockFetch();
    renderMain();

    await waitFor(() =>
      expect(screen.getByTestId("header-user").textContent).toBe("Sign In/Up")
    );
  });

  it("deve exibir credenciais de administrador", async () => {
    localStorageMock.setItem("token", "token");
    mockJwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600, type: "adm", email: "adm@test.com" });
    mockFetch();

    renderMain();

    await waitFor(() =>
      expect(screen.getByTestId("header-user").textContent).toBe("adm - adm@test.com")
    );
  });

  it("deve exibir nome do visitante", async () => {
    localStorageMock.setItem("token", "token");
    mockJwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600, type: "visit", nome: "Visitante" });
    mockFetch();

    renderMain();

    await waitFor(() =>
      expect(screen.getByTestId("header-user").textContent).toBe("Visitante")
    );
  });

  it("deve remover token expirado e alertar usuário", async () => {
    localStorageMock.setItem("token", "token");
    mockJwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 10 });
    mockFetch();

    renderMain();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Seu login expirou!", "Alerta!", "alert");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(screen.getByTestId("header-user").textContent).toBe("Sign In/Up");
    });
  });
});

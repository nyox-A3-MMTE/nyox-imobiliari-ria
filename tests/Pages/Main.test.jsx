import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import jwtDecode from "jwt-decode";
import Main from "../../src/Pages/Main/Main";
import Alert from "../../src/Components/Alert/Alert";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("jwt-decode", () => ({ default: vi.fn() }));

vi.mock("../../src/Components/AnuncioCard/AnuncioCard", () => ({
  default: ({ onButtonClick }) => (
    <button data-testid="ver-detalhes" onClick={onButtonClick}>
      Ver detalhes
    </button>
  ),
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

const mockImovel = {
  descricao: "Imovel 1",
  bairro: "Centro",
  cidade: "São Paulo",
  estado: "SP",
  tipo: "Apartamento",
  quartos: 2,
  banheiros: 1,
  vagas_garagem: 1,
  area_total: 60,
  valor: "R$ 300.000",
};

const mockFetch = (data = []) => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

const renderMain = () => render(<Main />);

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  global.fetch.mockReset();
});

describe("Main Page", () => {
  it("deve carregar imóveis e exibir informações", async () => {
    mockFetch([mockImovel]);
    renderMain();

    await waitFor(() => {
      expect(screen.getByText(mockImovel.descricao)).toBeInTheDocument();
    });
    expect(screen.getByText("Bairro: Centro.")).toBeInTheDocument();
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

  it("deve expandir e recolher detalhes do imóvel", async () => {
    mockFetch([mockImovel]);
    const { container } = renderMain();

    await waitFor(() => expect(document.getElementById("imovelhome-0")).not.toBeNull());
    const card = document.getElementById("imovelhome-0");
    card.style.width = "500px";

    fireEvent.click(screen.getByTestId("ver-detalhes"));
    expect(card.style.width).toBe("980px");

    fireEvent.click(container.querySelector(".mostrar-menos"));
    expect(card.style.width).toBe("500px");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import * as jwtDecode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import Home from "../../src/Pages/Home/Home";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("jwt-decode");

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

const createToken = (payload) => {
  return `header.${Buffer.from(JSON.stringify(payload)).toString("base64")}.signature`;
};

const createAdminToken = (expires = true) => ({
  type: "adm",
  email: "admin@example.com",
  exp: Math.floor(Date.now() / 1000) + (expires ? 3600 : -3600),
});

const createVisitorToken = (expires = true) => ({
  type: "visit",
  nome: "João Silva",
  exp: Math.floor(Date.now() / 1000) + (expires ? 3600 : -3600),
});

const setupAuthenticatedUser = (tokenPayload) => {
  const token = createToken(tokenPayload);
  localStorageMock.setItem("token", token);
  vi.mocked(jwtDecode.default).mockReturnValue(tokenPayload);
};

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it("deve renderizar elementos principais da página", () => {
    renderComponent();

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(
      screen.getByText(/Seu imóvel, sua história, nossa missão/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Na Nyox Imóveis, ajudamos você a encontrar/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver Imóveis/i })).toBeInTheDocument();
  });

  it("deve renderizar links de navegação corretos", () => {
    renderComponent();

    const verImoveisLink = screen.getByRole("link", { name: /Ver Imóveis/i });
    expect(verImoveisLink.href).toContain("/Main");

    const sobreNosLink = screen.getByRole("link", { name: /Sobre nós/i });
    expect(sobreNosLink).toBeInTheDocument();
  });

  it("deve exibir 'Sign In/Up' quando não há token", () => {
    renderComponent();
    const loginLink = screen.getByRole("link", { name: /Sign In\/Up/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.href).toContain("/login");
  });

  it("deve exibir informações do admin quando autenticado", async () => {
    setupAuthenticatedUser(createAdminToken());
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/adm - admin@example.com/i)).toBeInTheDocument();
    });
  });

  it("deve exibir nome do visitante quando autenticado", async () => {
    setupAuthenticatedUser(createVisitorToken());
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });
  });

  it("deve exibir alerta e remover token quando expirado", async () => {
    setupAuthenticatedUser(createAdminToken(false));
    renderComponent();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith(
        "Seu login expirou!",
        "Alerta!",
        "alert"
      );
    });

    expect(localStorageMock.getItem("token")).toBeNull();
  });

  it("deve tratar erro ao decodificar token inválido", async () => {
    localStorageMock.setItem("token", "invalid.token");
    vi.mocked(jwtDecode.default).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao decodificar token:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});

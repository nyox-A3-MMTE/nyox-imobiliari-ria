import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DeleteItem from "../../src/Pages/DeleteItem/DeleteItem";
import Alert from "../../src/Components/Alert/Alert";

const mockNavigate = vi.fn();
vi.mock("../../src/Components/Alert/Alert");
vi.mock("../../src/Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

global.fetch = vi.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockImovel = {
  id: 1,
  descricao: "Imóvel inativo",
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

const renderPage = () =>
  render(
    <BrowserRouter>
      <DeleteItem />
    </BrowserRouter>
  );

const mockFetch = (responses) => {
  global.fetch.mockReset();
  responses.forEach((res) => global.fetch.mockResolvedValueOnce(res));
};

const mockOk = (json) => ({ ok: true, json: async () => json });
const mockFail = () => ({ ok: false });

describe("DeleteItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem("token", "token");
  });

  it("deve renderizar imóveis e sidebar", async () => {
    mockFetch([mockOk([mockImovel])]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByText("Imóvel inativo")).toBeInTheDocument();
    });
  });

  it("deve redirecionar para login sem token", async () => {
    localStorageMock.clear();
    mockFetch([mockOk([])]);
    const original = window.location;
    delete window.location;
    window.location = { href: "" };

    renderPage();
    
    await waitFor(() => {
      expect(window.location.href).toBe("/login");
    });

    window.location = original;
  });

  it("deve reativar e remover imóvel com sucesso", async () => {
    mockFetch([mockOk([mockImovel]), mockOk({ id: 1 })]);
    renderPage();

    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /restaurar/i }));

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith(
        "Imóvel foi reativado!",
        "Sucesso!",
        "success"
      );
      expect(screen.queryByText("Imóvel inativo")).not.toBeInTheDocument();
    });
  });

  it("deve mostrar erro em falha ou exceção na reativação", async () => {
    mockFetch([mockOk([mockImovel]), mockFail()]);
    renderPage();

    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /restaurar/i }));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Erro ao processar!", "Erro!", "error")
    );
  });

  it("deve exclui imóvel permanentemente com sucesso", async () => {
    mockFetch([mockOk([mockImovel]), mockOk({ id: 1 })]);
    renderPage();

    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /Excluir permanentemente/i }));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Imóvel foi deletado permanentemente!",
        "Sucesso!",
        "success"
      )
    );
  });

  it("deve mostrar erro ao excluir imóvel", async () => {
    mockFetch([mockOk([mockImovel]), mockFail()]);
    renderPage();

    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /Excluir permanentemente/i }));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Erro ao processar!", "Erro!", "error")
    );
  });

  it("deve navegar para tela de edição", async () => {
    mockFetch([mockOk([mockImovel])]);
    renderPage();

    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /editar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/AdmPannel/EditItem", {
      state: { id: mockImovel.id },
    });
  });

  it("deve registrar erro ao listar imóveis quando resposta falhar", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch([mockFail()]);
    renderPage();

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith("Erro na resposta do servidor")
    );

    consoleSpy.mockRestore();
  });

  it("deve alertar erro ao reativar em exceção de rede", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    global.fetch
      .mockResolvedValueOnce(mockOk([mockImovel]))
      .mockRejectedValueOnce(new Error("Network error"));

    renderPage();
    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(screen.getByRole("button", { name: /restaurar/i }));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Erro ao processar!", "Erro!", "error")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Erro ao conectar ao servidor:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("deve alertar erro ao excluir em exceção de rede", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    global.fetch
      .mockResolvedValueOnce(mockOk([mockImovel]))
      .mockRejectedValueOnce(new Error("Network error"));

    renderPage();
    await waitFor(() => screen.getByText("Imóvel inativo"));
    fireEvent.click(
      screen.getByRole("button", { name: /Excluir permanentemente/i })
    );

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Erro ao processar!", "Erro!", "error")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Erro ao conectar ao servidor:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PainelAdm from "../../src/Pages/PainelAdm/PainelAdm";
import Alert from "../../src/Components/Alert/Alert";
import jwtDecode from "jwt-decode";

const mockNavigate = vi.fn();
vi.mock("../../src/Components/Alert/Alert");
vi.mock("jwt-decode", () => ({ default: vi.fn() }));
vi.mock("../../src/Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../../src/Components/AnuncioCard/AnuncioCard", () => ({
  default: ({ imovel }) => <div>Card {imovel.descricao}</div>,
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

global.fetch = vi.fn();

const mockJwtDecode = jwtDecode;
const mockImovel = { id: 1, descricao: "Casa 1" };

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

const mockFetch = (response) => global.fetch.mockResolvedValueOnce(response);
const mockOk = (body) => ({ ok: true, json: async () => body, message: "Sucesso!" });
const mockFail = (msg = "Erro ao processar!") => ({ ok: false, message: msg });

const renderPage = () =>
  render(
    <BrowserRouter>
      <PainelAdm />
    </BrowserRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  global.fetch.mockReset();
  localStorageMock.setItem("token", "token");
});

describe("PainelAdm", () => {
  const setToken = (payload) => mockJwtDecode.mockReturnValue(payload);

  it("deve permitir acesso ao administrador e lista imóveis", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "adm" });
    mockFetch(mockOk([mockImovel]));

    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Acesso permitido!", "Sucesso!", "success");
      expect(screen.getByText("Casa 1")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });
  });

  it("deve alertar e redirecionar se não houver token", async () => {
    localStorageMock.clear();
    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Você não está logado", "Erro!", "error");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("deve expirar token e redirecionar", async () => {
    setToken({ exp: Date.now() / 1000 - 10, type: "adm" });
    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Seu login expirou!", "Alerta!", "alert");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("deve bloqueiar acesso para visitante", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "visit" });
    renderPage();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith(
        "Seu usuário não tem permissões necessárias!",
        "Erro!",
        "error"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("deve navegar para edição do imóvel", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "adm" });
    mockFetch(mockOk([mockImovel]));

    const { container } = renderPage();
    await waitFor(() => screen.getByText("Casa 1"));

    fireEvent.click(container.querySelector(".edita"));
    expect(mockNavigate).toHaveBeenCalledWith("/AdmPannel/EditItem", {
      state: { id: mockImovel.id },
    });
  });

  it("deve deletar imóvel com sucesso", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "adm" });
    global.fetch
      .mockResolvedValueOnce(mockOk([mockImovel]))
      .mockResolvedValueOnce({ ...mockOk({ id: 1 }), message: "Removido!" });

    const { container } = renderPage();
    await waitFor(() => screen.getByText("Casa 1"));

    fireEvent.click(container.querySelector(".excluir"));

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Removido!", "Sucesso!", "success");
      expect(screen.queryByText("Casa 1")).not.toBeInTheDocument();
    });
  });

  it("deve mostrar erro ao tentar deletar imóvel", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "adm" });
    global.fetch
      .mockResolvedValueOnce(mockOk([mockImovel]))
      .mockResolvedValueOnce(mockFail("Erro ao processar!"));

    const { container } = renderPage();
    await waitFor(() => screen.getByText("Casa 1"));

    fireEvent.click(container.querySelector(".excluir"));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Erro ao processar!", "Erro!", "error")
    );
  });

  it("deve exibir erro em exceção de rede", async () => {
    setToken({ exp: Date.now() / 1000 + 3600, type: "adm" });
    global.fetch
      .mockResolvedValueOnce(mockOk([mockImovel]))
      .mockRejectedValueOnce(new Error("Network error"));

    const { container } = renderPage();
    await waitFor(() => screen.getByText("Casa 1"));

    fireEvent.click(container.querySelector(".excluir"));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        expect.any(Error),
        "imóvel não foi enviado para itens excluidos!",
        "Erro!",
        "error"
      )
    );
  });
});

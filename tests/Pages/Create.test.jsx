import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, beforeEach, vi, expect } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import Create from "../../src/Pages/CreateItem/Create";
const API_URL = import.meta.env.VITE_API_URL;

vi.mock("../../src/Components/Alert/Alert");
vi.mock("../../src/Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

global.fetch = vi.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (k) => store[k],
    setItem: (k, v) => (store[k] = v.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const renderPage = () =>
  render(
    <BrowserRouter>
      <Create />
    </BrowserRouter>
  );

const getPlaceholder = (placeholder) =>
  screen.getByPlaceholderText((content) => content.toLowerCase() === placeholder.toLowerCase());

const fill = (placeholder, value) =>
  fireEvent.change(getPlaceholder(placeholder), { target: { value } });

const mockFiles = (n) =>
  Array.from({ length: n }, (_, i) => new File([`f${i}`], `file${i}.png`, { type: "image/png" }));

const addImages = (n) => {
  const input = document.querySelector('input[type="file"]');
  const files = mockFiles(n);
  fireEvent.change(input, { target: { files } });
};

const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar Imóvel/i }));

const fillRequiredFields = () => {
  const fields = {
    Descrição: "Casa teste",
    CEP: "12345678",
    Endereço: "Rua A",
    Bairro: "Centro",
    Cidade: "São Paulo",
    Estado: "SP",
    Tipo: "Casa",
  };

  Object.entries(fields).forEach(([placeholder, value]) => fill(placeholder, value));
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.setItem("token", "token");
  global.fetch.mockReset();
});

describe("Create Page", () => {
  it("deve renderizar formulário e sidebar", () => {
    renderPage();
    expect(screen.getByText("Cadastro de Imóveis")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("deve redirecionar se nao houver token", () => {
    localStorageMock.clear();
    const original = window.location;
    delete window.location;
    window.location = { href: "" };
    renderPage();
    expect(window.location.href).toBe("/login");
    window.location = original;
  });

  it("deve atualizar campos ao digitar", () => {
    renderPage();
    fill("Descrição", "Casa linda");
    expect(screen.getByPlaceholderText("Descrição").value).toBe("Casa linda");
  });

  it("deve consultar CEP e preencher o endereço", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        logradouro: "Rua Teste",
        bairro: "Bairro T",
        localidade: "São Paulo",
        uf: "SP",
      }),
    });
    renderPage();
    fill("CEP", "12345678");
    fireEvent.blur(screen.getByPlaceholderText("CEP"));

    await waitFor(() =>
      expect(screen.getByPlaceholderText("Endereço").value).toBe("Rua Teste")
    );
  });

  it("deve alertar se CEP inválido", async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => ({ erro: true }) });
    renderPage();
    fill("CEP", "00000000");
    fireEvent.blur(screen.getByPlaceholderText("CEP"));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("CEP não encontrado", "Erro!", "error")
    );
  });

  it("deve alertar em erro ao buscar CEP", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    renderPage();
    fill("CEP", "87654321");
    fireEvent.blur(screen.getByPlaceholderText("CEP"));

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Erro ao buscar CEP",
        "Erro!",
        "error"
      )
    );
  });

  it("deve selecionar imagens e mostrar previews", async () => {
    renderPage();
    addImages(2);
    await waitFor(() =>
      expect(screen.getAllByAltText(/Preview/).length).toBe(2)
    );
  });

  it("deve alertar se exceder limite de 10 imagens", () => {
    renderPage();
    addImages(11);
    expect(Alert).toHaveBeenCalledWith(
      "Limite de 10 imagens atingido.",
      "Atenção!",
      "warning"
    );
  });

  it("deve alertar se enviar com menos de 3 imagens", async () => {
    renderPage();
    fillRequiredFields();
    submit();
    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Mínimo de 3 imagens devem ser selecionadas",
        "Atenção!",
        "warning"
      )
    );
  });

  it("deve enviar formulário com sucesso", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Imóvel cadastrado com sucesso!" }),
    });

    renderPage();
    fillRequiredFields();
    addImages(3);
    submit();

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith(
        "Imóvel cadastrado com sucesso!",
        "Sucesso!",
        "success"
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/imoveis/register`,
        expect.objectContaining({ method: "POST", body: expect.any(FormData) })
      );
    });
  });

  it("deve alertar erro ao cadastrar imóvel", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Erro ao cadastrar imóvel" }),
    });

    renderPage();
    fillRequiredFields();
    addImages(3);
    submit();

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Erro ao cadastrar imóvel",
        "Erro!",
        "error"
      )
    );
  });

  it("deve alertar erro de conexão", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    renderPage();
    fillRequiredFields();
    addImages(3);
    submit();

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Erro ao conectar ao servidor",
        "Erro!",
        "error"
      )
    );
  });
});

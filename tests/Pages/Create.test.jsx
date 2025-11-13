/* eslint-disable no-undef */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import Create from "../../src/Pages/CreateItem/Create";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("../../src/Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

const localStorageMock = (() => {
  let store = { token: "test-token" };
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

global.fetch = vi.fn();

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Create />
    </BrowserRouter>
  );
};

const fillFormField = (placeholder, value) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), {
    target: { value },
  });
};

const createMockFiles = (count = 3) => {
  return Array.from({ length: count }, (_, i) =>
    new File([`image${i}`], `test${i}.png`, { type: "image/png" })
  );
};

const fillCompleteForm = () => {
  const fields = {
    Descrição: "Casa nova",
    Endereço: "Rua A",
    Bairro: "Bairro A",
    Cidade: "São Paulo",
    Estado: "SP",
    CEP: "12345678",
    Tipo: "Casa",
  };

  Object.entries(fields).forEach(([placeholder, value]) => {
    fillFormField(placeholder, value);
  });
};

const addImages = (count = 3) => {
  const fileInput = document.querySelector('input[type="file"]');
  const files = createMockFiles(count);
  fireEvent.change(fileInput, { target: { files } });
  return files;
};

const submitForm = () => {
  fireEvent.click(screen.getByRole("button", { name: /Cadastrar Imóvel/i }));
};

describe("Create Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.setItem("token", "test-token");
    global.fetch.mockClear();
  });

  describe("Renderização", () => {
    it("deve renderizar a página com formulário e sidebar", () => {
      renderComponent();

      expect(screen.getByText("Cadastro de Imóveis")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("CEP")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tipo")).toBeInTheDocument();
    });

    it("deve redirecionar para login se não houver token", () => {
      localStorageMock.clear();
      const originalLocation = window.location;
      delete window.location;
      window.location = { ...originalLocation, href: "" };

      renderComponent();
      expect(window.location.href).toBe("/login");

      window.location = originalLocation;
    });
  });

  describe("Formulário", () => {
    it("deve atualizar campos do formulário ao digitar", () => {
      renderComponent();

      fillFormField("Descrição", "Casa bonita");
      fillFormField("Tipo", "Casa");

      expect(screen.getByPlaceholderText("Descrição").value).toBe("Casa bonita");
      expect(screen.getByPlaceholderText("Tipo").value).toBe("Casa");
    });

    it("deve consultar CEP e preencher endereço automaticamente", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          logradouro: "Rua Teste",
          bairro: "Bairro Teste",
          localidade: "São Paulo",
          uf: "SP",
        }),
      });

      renderComponent();
      const cepInput = screen.getByPlaceholderText("CEP");
      fireEvent.change(cepInput, { target: { value: "12345678" } });
      fireEvent.blur(cepInput);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://viacep.com.br/ws/12345678/json/"
        );
        expect(screen.getByPlaceholderText("Endereço").value).toBe("Rua Teste");
        expect(screen.getByPlaceholderText("Cidade").value).toBe("São Paulo");
      });
    });

    it("deve tratar erros ao consultar CEP", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ erro: true }),
      });

      renderComponent();
      const cepInput = screen.getByPlaceholderText("CEP");
      fireEvent.change(cepInput, { target: { value: "00000000" } });
      fireEvent.blur(cepInput);

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith("CEP não encontrado", "Erro!", "error");
      });
    });
  });

  describe("Upload de Imagens", () => {
    it("deve permitir selecionar imagens e exibir previews", async () => {
      renderComponent();
      addImages(2);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput.files.length).toBe(2);

      await waitFor(() => {
        const previewImages = screen.getAllByAltText(/Preview/);
        expect(previewImages.length).toBe(2);
      });
    });

    it("deve exibir alerta se exceder 10 imagens", () => {
      renderComponent();
      const fileInput = document.querySelector('input[type="file"]');
      const files = createMockFiles(11);
      fireEvent.change(fileInput, { target: { files } });

      expect(Alert).toHaveBeenCalledWith(
        "Limite de 10 imagens atingido.",
        "Atenção!",
        "warning"
      );
    });

    it("deve exigir mínimo de 3 imagens ao enviar", async () => {
      renderComponent();
      fillCompleteForm();
      submitForm();

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith(
          "Mínimo de 3 imagens devem ser selecionadas",
          "Atenção!",
          "warning"
        );
      });
    });
  });

  describe("Submissão do Formulário", () => {
    it("deve enviar formulário e exibir sucesso ao cadastrar imóvel", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Imóvel cadastrado com sucesso!" }),
      });

      renderComponent();
      fillCompleteForm();
      addImages(3);
      submitForm();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8800/imoveis/register",
          expect.objectContaining({
            method: "POST",
            body: expect.any(FormData),
          })
        );
        expect(Alert).toHaveBeenCalledWith(
          "Imóvel cadastrado com sucesso!",
          "Sucesso!",
          "success"
        );
        expect(screen.getByPlaceholderText("Descrição").value).toBe("");
      });
    });

    it("deve tratar erros ao cadastrar imóvel", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Erro ao cadastrar imóvel" }),
      });

      renderComponent();
      fillCompleteForm();
      addImages(3);
      submitForm();

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith("Erro ao cadastrar imóvel", "Erro!", "error");
      });
    });

    it("deve tratar erro de conexão com servidor", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      renderComponent();
      fillCompleteForm();
      addImages(3);
      submitForm();

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith(
          "Erro ao conectar ao servidor",
          "Erro!",
          "error"
        );
      });
    });
  });
});
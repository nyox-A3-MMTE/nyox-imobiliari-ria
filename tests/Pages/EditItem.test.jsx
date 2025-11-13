/* eslint-disable no-undef */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import EditItem from "../../src/Pages/EditItem/EditItem";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("../../src/Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      state: { id: "123" },
    }),
    useNavigate: () => vi.fn(),
  };
});

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
      <EditItem />
    </BrowserRouter>
  );
};

const fillFormField = (placeholder, value) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), {
    target: { value },
  });
};

const fillCompleteForm = () => {
  const fields = {
    Descrição: "Casa editada",
    Endereço: "Rua B",
    Bairro: "Bairro B",
    Cidade: "Rio de Janeiro",
    Estado: "RJ",
    CEP: "20000000",
    Tipo: "Apartamento",
  };

  Object.entries(fields).forEach(([placeholder, value]) => {
    fillFormField(placeholder, value);
  });
};

const submitForm = () => {
  fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
};

const mockImovelData = {
  id: "123",
  descricao: "Casa para editar",
  endereco: "Rua A",
  bairro: "Bairro A",
  cidade: "São Paulo",
  estado: "SP",
  cep: "12345678",
  tipo: "Casa",
  quartos: "3",
  banheiros: "2",
  vagas_garagem: "2",
  area_total: "150",
  valor: "500000",
};

const mockFetchImovel = () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [mockImovelData],
  });
};

const waitFormReady = () =>
  waitFor(() => {
    expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument();
  });

describe("EditItem Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.setItem("token", "test-token");
    global.fetch.mockClear();
  });

  describe("Renderização e Carregamento", () => {
    it("deve renderizar a página com formulário e carregar dados do imóvel", async () => {
      mockFetchImovel();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Edição de Imóveis")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8800/imoveis/listforid/123",
          expect.objectContaining({
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
        );
        expect(screen.getByPlaceholderText("Descrição").value).toBe(
          mockImovelData.descricao
        );
      });
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
    it("deve atualizar campos do formulário ao digitar", async () => {
      mockFetchImovel();
      renderComponent();
      await waitFormReady();

      fillFormField("Descrição", "Casa atualizada");
      fillFormField("Tipo", "Apartamento");

      expect(screen.getByPlaceholderText("Descrição").value).toBe("Casa atualizada");
      expect(screen.getByPlaceholderText("Tipo").value).toBe("Apartamento");
    });

    it("deve consultar CEP e preencher endereço automaticamente", async () => {
      mockFetchImovel();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          logradouro: "Rua Nova",
          bairro: "Bairro Novo",
          localidade: "Belo Horizonte",
          uf: "MG",
        }),
      });

      renderComponent();
      await waitFormReady();

      const cepInput = screen.getByPlaceholderText("CEP");
      fireEvent.change(cepInput, { target: { value: "30000000" } });
      fireEvent.blur(cepInput);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://viacep.com.br/ws/30000000/json/"
        );
        expect(screen.getByPlaceholderText("Endereço").value).toBe("Rua Nova");
        expect(screen.getByPlaceholderText("Cidade").value).toBe("Belo Horizonte");
      });
    });

    it("deve tratar erros ao consultar CEP", async () => {
      mockFetchImovel();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ erro: true }),
      });

      renderComponent();
      await waitFormReady();

      const cepInput = screen.getByPlaceholderText("CEP");
      fireEvent.change(cepInput, { target: { value: "00000000" } });
      fireEvent.blur(cepInput);

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith("CEP não encontrado", "Erro!", "error");
      });
    });
  });

  describe("Submissão do Formulário", () => {
    it("deve enviar formulário e exibir sucesso ao atualizar imóvel", async () => {
      mockFetchImovel();
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Imóvel atualizado com sucesso!" }),
      });

      renderComponent();
      await waitFormReady();
      fillCompleteForm();
      submitForm();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8800/imoveis/update/123",
          expect.objectContaining({
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: expect.any(String),
          })
        );
        expect(Alert).toHaveBeenCalledWith(
          "Imóvel atualizado com sucesso!",
          "Sucesso!",
          "success"
        );
      });
    });

    it("deve tratar erros ao atualizar imóvel", async () => {
      mockFetchImovel();
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Erro ao atualizar imóvel" }),
      });

      renderComponent();
      await waitFormReady();
      fillCompleteForm();
      submitForm();

      await waitFor(() => {
        expect(Alert).toHaveBeenCalledWith("Erro ao atualizar imóvel", "Erro!", "error");
      });
    });

    it("deve converter valores numéricos ao enviar formulário", async () => {
      mockFetchImovel();
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Sucesso" }),
      });

      renderComponent();
      await waitFormReady();
      fillCompleteForm();
      submitForm();

      await waitFor(() => {
        const lastCall = global.fetch.mock.calls[global.fetch.mock.calls.length - 1];
        const body = JSON.parse(lastCall[1].body);
        expect(typeof body.cep).toBe("number");
        expect(typeof body.quartos).toBe("number");
        expect(typeof body.valor).toBe("number");
      });
    });
  });

  describe("Exibição de Dados", () => {
    it("deve exibir informações do imóvel na seção de visualização", async () => {
      mockFetchImovel();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(mockImovelData.descricao)).toBeInTheDocument();
        expect(screen.getByText(`Bairro: ${mockImovelData.bairro}`)).toBeInTheDocument();
        expect(screen.getByText(`Quartos: ${mockImovelData.quartos}`)).toBeInTheDocument();
        expect(screen.getByText(`Valor: ${mockImovelData.valor}`)).toBeInTheDocument();
      });
    });
  });
});

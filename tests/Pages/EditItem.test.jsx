import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, beforeEach, vi, expect } from "vitest";
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
    useLocation: () => ({ state: { id: "123" } }),
    useNavigate: () => vi.fn(),
  };
});

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

const mockImovel = {
  id: "123",
  descricao: "Casa para editar",
  endereco: "Rua A",
  bairro: "Centro",
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

const mockFetch = (resp) => global.fetch.mockResolvedValueOnce(resp);
const mockOk = (data) => ({ ok: true, json: async () => data });
const mockFail = (msg) => ({ ok: false, json: async () => ({ message: msg }) });

const renderPage = () =>
  render(
    <BrowserRouter>
      <EditItem />
    </BrowserRouter>
  );

const fill = (placeholder, value) =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), {
    target: { value },
  });

const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

const waitFormLoaded = () =>
  screen.findByPlaceholderText("Descrição");

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.setItem("token", "token");
  global.fetch.mockReset();
});

describe("EditItem Page", () => {
  it("renderiza e carrega dados do imóvel", async () => {
    mockFetch(mockOk([mockImovel]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Edição de Imóveis")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Descrição").value).toBe(
        mockImovel.descricao
      );
    });
  });

  it("deve redirecionar se não houver token", () => {
    localStorageMock.clear();
    const original = window.location;
    delete window.location;
    window.location = { href: "" };

    renderPage();
    expect(window.location.href).toBe("/login");

    window.location = original;
  });

  it("deve atualizar campos ao digitar", async () => {
    mockFetch(mockOk([mockImovel]));
    renderPage();
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument()
    );

    fill("Descrição", "Casa nova");
    expect(screen.getByPlaceholderText("Descrição").value).toBe("Casa nova");
  });

  it("deve consultar CEP e preencher o endereço", async () => {
    mockFetch(mockOk([mockImovel]));
    mockFetch({ json: async () => ({ logradouro: "Rua X", bairro: "Bairro X", localidade: "BH", uf: "MG" }) });

    renderPage();
    const cep = await screen.findByPlaceholderText("CEP");
    fireEvent.change(cep, { target: { value: "30000000" } });
    fireEvent.blur(cep);

    await waitFor(() =>
      expect(screen.getByPlaceholderText("Endereço").value).toBe("Rua X")
    );
  });

  it("deve alertar se CEP for inválido", async () => {
    mockFetch(mockOk([mockImovel]));
    mockFetch({ json: async () => ({ erro: true }) });

    renderPage();
    const cep = await screen.findByPlaceholderText("CEP");
    fireEvent.change(cep, { target: { value: "00000000" } });
    fireEvent.blur(cep);

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("CEP não encontrado", "Erro!", "error")
    );
  });

  it("deve enviar atualização com sucesso", async () => {
    mockFetch(mockOk([mockImovel]));
    mockFetch({ ok: true, json: async () => ({ message: "Atualizado!" }) });

    renderPage();
    const desc = await waitFormLoaded();
    fireEvent.change(desc, { target: { value: "Casa reformada" } });
    submit();

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith("Atualizado!", "Sucesso!", "success")
    );
  });

  it("deve alertar erro de atualização", async () => {
    mockFetch(mockOk([mockImovel]));
    mockFetch(mockFail("Erro ao atualizar imóvel"));

    renderPage();
    await waitFormLoaded();
    submit();

    await waitFor(() =>
      expect(Alert).toHaveBeenCalledWith(
        "Erro ao atualizar imóvel",
        "Erro!",
        "error"
      )
    );
  });

  it("deve enviar valores numéricos corretamente", async () => {
    mockFetch(mockOk([mockImovel]));
    mockFetch({ ok: true, json: async () => ({ message: "OK" }) });

    renderPage();
    await waitFormLoaded();
    submit();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      const [, updateCall] = global.fetch.mock.calls;
      const body = JSON.parse(updateCall[1].body);
      expect(typeof body.cep).toBe("number");
      expect(typeof body.valor).toBe("number");
    });
  });

  it("deve exibir informações do imóvel na visualização", async () => {
    mockFetch(mockOk([mockImovel]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(mockImovel.descricao)).toBeInTheDocument();
      expect(screen.getByText(`Bairro: ${mockImovel.bairro}`)).toBeInTheDocument();
      expect(screen.getByText(`Valor: ${mockImovel.valor}`)).toBeInTheDocument();
    });
  });
});

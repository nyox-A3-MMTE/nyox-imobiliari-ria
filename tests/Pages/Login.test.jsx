import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import Login from "../../src/Pages/Login/Login";

vi.mock("../../src/Components/Alert/Alert");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

global.fetch = vi.fn();

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

const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

const fillAndSubmit = (formSelector, fields) => {
  const form = screen.getByText(formSelector).closest("form");
  Object.entries(fields).forEach(([name, value]) =>
    fireEvent.change(form.querySelector(`[name='${name}']`), {
      target: { value },
    })
  );
  fireEvent.click(form.querySelector("button[type='submit']"));
};

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
    localStorage.clear();
  });

  it("renderiza os formulários de login e cadastro", () => {
    renderLogin();
    expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
    expect(screen.getByText("Já possui uma conta ?")).toBeInTheDocument();
  });

  it("realiza login com sucesso", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Login OK",
        token: "abc123",
        type: "visit",
      }),
    });

    renderLogin();
    fillAndSubmit("Já possui uma conta ?", {
      email: "user@test.com",
      senha: "123456",
    });

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Login OK", "Sucesso!", "success");
      expect(localStorage.getItem("token")).toBe("abc123");
    });
  });

  it("exibe erro ao falhar login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Credenciais inválidas" }),
    });

    renderLogin();
    fillAndSubmit("Já possui uma conta ?", {
      email: "user@test.com",
      senha: "errada",
    });

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Credenciais inválidas", "Erro!", "error");
    });
  });

  it("cadastra novo usuário com sucesso", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Cadastro OK", token: "newuser123" }),
    });

    renderLogin();
    fillAndSubmit("Cadastre-se", {
      nome: "João",
      email: "joao@test.com",
      idade: "25",
      cpf: "12345678900",
      senha: "123456",
    });

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith("Cadastro OK", "Sucesso!", "success");
    });
  });

  it("mostra erro de rede", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    renderLogin();
    fillAndSubmit("Já possui uma conta ?", {
      email: "user@test.com",
      senha: "123456",
    });

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith(
        "Erro ao conectar ao servidor:",
        "Erro!",
        "error"
      );
    });
  });
});

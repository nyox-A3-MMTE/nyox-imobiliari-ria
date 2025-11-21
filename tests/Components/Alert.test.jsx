import { vi, describe, it, expect } from "vitest";
import Alert from "../../src/Components/Alert/Alert";
import Swal from "sweetalert2";


vi.mock("sweetalert2", () => {
  const Swal = {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })), 
  };
  return { default: Swal };
});

describe("Alert function", () => {
  it("deve chamar Swal.fire com parametros corretos para success alert", () => {
    const message = "Operação realizada com sucesso!";
    const type = "success";
    const icon = "success";

    Alert(message, type, icon);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: type,
      icon: icon,
      text: message,
      confirmButtonText: "Fechar",
    });
  });

  it("deve chamar Swal.fire com parametros corretos para error alert", () => {
    const message = "Ocorreu um erro!";
    const type = "error";
    const icon = "error";

    Alert(message, type, icon);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: type,
      icon: icon,
      text: message,
      confirmButtonText: "Fechar",
    });
  });

  it("deve chamar Swal.fire com parametros corretos para warning alert", () => {
    const message = "Atenção!";
    const type = "warning";
    const icon = "warning";

    Alert(message, type, icon);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: type,
      icon: icon,
      text: message,
      confirmButtonText: "Fechar",
    });
  });

  it("deve chamar Swal.fire com parametros corretos para info alert", () => {
    const message = "Informação importante.";
    const type = "info";
    const icon = "info";

    Alert(message, type, icon);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: type,
      icon: icon,
      text: message,
      confirmButtonText: "Fechar",
    });
  });

  it("deve chamar Swal.fire com parametros corretos para question alert", () => {
    const message = "Você tem certeza?";
    const type = "question";
    const icon = "question";

    Alert(message, type, icon);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: type,
      icon: icon,
      text: message,
      confirmButtonText: "Fechar",
    });
  });
});

import { render, screen } from "@testing-library/react";
import Header from "../../src/Components/Header/Header";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};


describe("Header", () => {
  it("deve renderizar o logo e o link do usuário", () => {
    renderWithRouter(<Header user="TestUser" />);

    const logoElement = screen.getByRole("img", { name: /Nyox Imobiliária logo/i });
    expect(logoElement).toBeInTheDocument();

    const userLink = screen.getByRole("link", { name: /TestUser/i });
    expect(userLink).toBeInTheDocument();
    expect(userLink).toHaveAttribute("href", "/login");
  });

  it("deve renderizar sem uma prop de usuário", () => {
    renderWithRouter(<Header />);

    const logoElement = screen.getByRole("img", { name: /Nyox Imobiliária logo/i });
    expect(logoElement).toBeInTheDocument();

    const userLink = screen.getByRole("link");
    expect(userLink).toBeInTheDocument();
    expect(userLink).toHaveAttribute("href", "/login");
    expect(screen.queryByText(/TestUser/i)).not.toBeInTheDocument();
  });
});

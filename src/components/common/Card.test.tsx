import { render, screen } from "@testing-library/react";
import Card from "./Card"; // Adjust the import based on your file structure

describe("Card Component", () => {
  it("renders children content inside the card", () => {
    render(
      <Card>
        <p>Card Content</p>
      </Card>
    );

    // Check if the children are rendered correctly
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies the provided className", () => {
    render(
      <Card className="custom-class">
        <p>Card Content</p>
      </Card>
    );

    // Check if the custom class is applied
    const cardElement = screen.getByText("Card Content").parentElement;
    expect(cardElement).toHaveClass("custom-class");
  });

  it("applies default styles and additional props", () => {
    render(
      <Card className="custom-class" data-testid="card">
        <p>Card Content</p>
      </Card>
    );

    // Check if default styles are applied
    const cardElement = screen.getByTestId("card");
    expect(cardElement).toHaveClass("bg-[#F5F5F5]");
    expect(cardElement).toHaveClass("rounded-xl");
    expect(cardElement).toHaveClass("shadow-md");
    expect(cardElement).toHaveClass("border");
    expect(cardElement).toHaveClass("border-gray-200");

    // Ensure that the custom class is applied
    expect(cardElement).toHaveClass("custom-class");
  });

  it("applies additional props correctly", () => {
    render(
      <Card className="custom-class" data-testid="card" aria-label="card-component">
        <p>Card Content</p>
      </Card>
    );

    // Check if the aria-label is applied
    const cardElement = screen.getByTestId("card");
    expect(cardElement).toHaveAttribute("aria-label", "card-component");
  });
});

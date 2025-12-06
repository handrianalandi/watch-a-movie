import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchComponent from "./SearchBar";

jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("SearchBar Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
  });

  it("renders search input", () => {
    render(<SearchComponent onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search movies...");
    expect(input).toBeInTheDocument();
  });

  it("displays placeholder text", () => {
    render(
      <SearchComponent onSearch={mockOnSearch} placeholder="Find movies..." />
    );
    expect(screen.getByPlaceholderText("Find movies...")).toBeInTheDocument();
  });

  it("shows clear button when input has value", async () => {
    render(<SearchComponent onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search movies...");

    await userEvent.type(input, "Batman");

    const clearButton = screen.getByLabelText("Clear search");
    expect(clearButton).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    render(<SearchComponent onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      "Search movies..."
    ) as HTMLInputElement;

    await userEvent.type(input, "Batman");
    const clearButton = screen.getByLabelText("Clear search");
    await userEvent.click(clearButton);

    expect(input.value).toBe("");
  });

  it("accepts user input", async () => {
    render(<SearchComponent onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      "Search movies..."
    ) as HTMLInputElement;

    await userEvent.type(input, "Batman");

    expect(input.value).toBe("Batman");
  });
});

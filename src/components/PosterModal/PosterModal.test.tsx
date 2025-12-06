import React from "react";
import { render, screen } from "@testing-library/react";
import PosterModal from "./PosterModal";

describe("PosterModal Component", () => {
  const mockOnClose = jest.fn();
  const posterUrl = "https://example.com/poster.jpg";
  const title = "Batman Begins";

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders modal with poster and title", () => {
    render(
      <PosterModal posterUrl={posterUrl} title={title} onClose={mockOnClose} />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByAltText(`${title} poster`)).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(
      <PosterModal posterUrl={posterUrl} title={title} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText("Close modal");
    expect(closeButton).toBeInTheDocument();
  });

  it("displays the correct poster image", () => {
    render(
      <PosterModal posterUrl={posterUrl} title={title} onClose={mockOnClose} />
    );

    const image = screen.getByAltText(`${title} poster`) as HTMLImageElement;
    expect(image.src).toContain(posterUrl);
  });
});

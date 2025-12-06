import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import { DEFAULT_MOVIE_PLACEHOLDER } from "@/constant/general";

describe("MovieCard Component", () => {
  const mockMovie: Movie = {
    imdbID: "tt0372784",
    Title: "Batman Begins",
    Year: "2005",
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
  };

  const mockOnMovieClick = jest.fn();
  const mockOnPosterClick = jest.fn();

  beforeEach(() => {
    mockOnMovieClick.mockClear();
    mockOnPosterClick.mockClear();
  });

  it("renders movie information", () => {
    render(
      <MovieCard
        movie={mockMovie}
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    expect(screen.getByText("Batman Begins")).toBeInTheDocument();
    expect(screen.getByText("2005")).toBeInTheDocument();
    expect(screen.getByText("MOVIE")).toBeInTheDocument();
  });

  it("calls onMovieClick when card footer is clicked", () => {
    render(
      <MovieCard
        movie={mockMovie}
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    const titleElement = screen.getByText("Batman Begins");
    fireEvent.click(titleElement);

    expect(mockOnMovieClick).toHaveBeenCalledWith("tt0372784");
  });

  it("calls onPosterClick when poster is clicked", () => {
    render(
      <MovieCard
        movie={mockMovie}
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    const poster = screen.getByAltText("Batman Begins poster").closest("div");
    if (poster) {
      fireEvent.click(poster);
      expect(mockOnPosterClick).toHaveBeenCalledWith(
        "https://example.com/poster.jpg"
      );
    }
  });

  it("displays placeholder when poster is N/A", () => {
    const movieWithoutPoster = { ...mockMovie, Poster: "N/A" };

    render(
      <MovieCard
        movie={movieWithoutPoster}
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    const img = screen.getByAltText("Batman Begins poster") as HTMLImageElement;
    expect(img.src).toContain(DEFAULT_MOVIE_PLACEHOLDER);
  });
});

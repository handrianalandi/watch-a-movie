import React from "react";
import { render, screen } from "@testing-library/react";
import MovieList from "./MovieList";
import { Movie } from "@/types/movie";

const mockMovies: Movie[] = [
  {
    imdbID: "tt0372784",
    Title: "Batman Begins",
    Year: "2005",
    Type: "movie",
    Poster: "https://example.com/poster1.jpg",
  },
  {
    imdbID: "tt0468569",
    Title: "The Dark Knight",
    Year: "2008",
    Type: "movie",
    Poster: "https://example.com/poster2.jpg",
  },
];

describe("MovieList Component", () => {
  const mockOnMovieClick = jest.fn();
  const mockOnPosterClick = jest.fn();

  it("renders list of movies", () => {
    render(
      <MovieList
        movies={mockMovies}
        loading={false}
        error={null}
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    expect(screen.getByText("Batman Begins")).toBeInTheDocument();
    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
  });

  it("displays error message when there is a general error", () => {
    render(
      <MovieList
        movies={[]}
        loading={false}
        error="Network error occurred"
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Network error occurred")).toBeInTheDocument();
  });

  it("displays 'No movies found' when error is 'Movie not found!'", () => {
    render(
      <MovieList
        movies={[]}
        loading={false}
        error="Movie not found!"
        onMovieClick={mockOnMovieClick}
        onPosterClick={mockOnPosterClick}
      />
    );

    expect(screen.getByText("No movies found")).toBeInTheDocument();
    expect(
      screen.getByText("Try searching for a different title")
    ).toBeInTheDocument();
  });
});

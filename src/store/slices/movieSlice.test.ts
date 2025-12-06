import movieReducer, {
  searchMovies,
  fetchMovieDetails,
  setSearchQuery,
  resetMovies,
  clearSelectedMovie,
} from "./movieSlice";
import { MovieDetail } from "@/types/movie";
import { SearchTypeEnum } from "@/types/search";

describe("movieSlice", () => {
  const initialState = {
    movies: [],
    selectedMovie: null,
    searchQuery: "",
    searchType: SearchTypeEnum.MOVIE,
    currentPage: 1,
    fetchedTotalResults: 0,
    loading: false,
    error: null,
    hasMore: false,
  };

  it("should handle initial state", () => {
    expect(movieReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("setSearchQuery", () => {
    it("should set search query and reset state", () => {
      const state = movieReducer(
        {
          ...initialState,
          movies: [
            {
              imdbID: "1",
              Title: "Test",
              Year: "2020",
              Type: "movie",
              Poster: "",
            },
          ],
        },
        setSearchQuery("Batman")
      );

      expect(state.searchQuery).toBe("Batman");
      expect(state.movies).toEqual([]);
      expect(state.currentPage).toBe(1);
      expect(state.fetchedTotalResults).toBe(0);
    });
  });

  describe("resetMovies", () => {
    it("should reset movies state", () => {
      const state = movieReducer(
        {
          ...initialState,
          movies: [
            {
              imdbID: "1",
              Title: "Test",
              Year: "2020",
              Type: "movie",
              Poster: "",
            },
          ],
          currentPage: 5,
          fetchedTotalResults: 100,
          hasMore: true,
        },
        resetMovies()
      );

      expect(state.movies).toEqual([]);
      expect(state.currentPage).toBe(1);
      expect(state.fetchedTotalResults).toBe(0);
      expect(state.hasMore).toBe(false);
    });
  });

  describe("clearSelectedMovie", () => {
    it("should clear selected movie", () => {
      const mockMovie: MovieDetail = {
        imdbID: "tt123",
        Title: "Test Movie",
        Year: "2020",
        Rated: "PG-13",
        Released: "01 Jan 2020",
        Runtime: "120 min",
        Genre: "Action",
        Director: "Test Director",
        Writer: "Test Writer",
        Actors: "Test Actor",
        Plot: "Test plot",
        Language: "English",
        Country: "USA",
        Awards: "Test Awards",
        Poster: "test.jpg",
        Ratings: [],
        Metascore: "80",
        imdbRating: "8.0",
        imdbVotes: "1000",
        Type: "movie",
        DVD: "01 Jan 2020",
        BoxOffice: "$100M",
        Production: "Test Prod",
        Website: "test.com",
        response: "True",
      };

      const state = movieReducer(
        { ...initialState, selectedMovie: mockMovie },
        clearSelectedMovie()
      );

      expect(state.selectedMovie).toBeNull();
    });
  });

  describe("searchMovies async thunk", () => {
    it("should set loading to true when pending", () => {
      const action = { type: searchMovies.pending.type };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled search movies for first page", () => {
      const payload = {
        movies: [
          {
            imdbID: "tt1",
            Title: "Movie 1",
            Year: "2020",
            Type: "movie",
            Poster: "",
          },
          {
            imdbID: "tt2",
            Title: "Movie 2",
            Year: "2021",
            Type: "movie",
            Poster: "",
          },
        ],
        totalResults: 100,
        page: 1,
      };

      const action = { type: searchMovies.fulfilled.type, payload };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.movies).toEqual(payload.movies);
      expect(state.currentPage).toBe(1);
      expect(state.fetchedTotalResults).toBe(2);
      expect(state.hasMore).toBe(true);
    });

    it("should append movies for subsequent pages", () => {
      const existingState = {
        ...initialState,
        movies: [
          {
            imdbID: "tt1",
            Title: "Movie 1",
            Year: "2020",
            Type: "movie",
            Poster: "",
          },
        ],
        currentPage: 1,
        fetchedTotalResults: 10,
      };

      const payload = {
        movies: [
          {
            imdbID: "tt2",
            Title: "Movie 2",
            Year: "2021",
            Type: "movie",
            Poster: "",
          },
        ],
        totalResults: 100,
        page: 2,
      };

      const action = { type: searchMovies.fulfilled.type, payload };
      const state = movieReducer(existingState, action);

      expect(state.movies.length).toBe(2);
      expect(state.currentPage).toBe(2);
    });

    it("should handle rejected search", () => {
      const action = {
        type: searchMovies.rejected.type,
        error: { message: "Network error" },
      };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
      expect(state.movies).toEqual([]);
      expect(state.hasMore).toBe(false);
    });
  });

  describe("fetchMovieDetails async thunk", () => {
    it("should set loading to true when pending", () => {
      const action = { type: fetchMovieDetails.pending.type };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled movie details", () => {
      const mockMovie: MovieDetail = {
        imdbID: "tt123",
        Title: "Test Movie",
        Year: "2020",
        Rated: "PG-13",
        Released: "01 Jan 2020",
        Runtime: "120 min",
        Genre: "Action",
        Director: "Test Director",
        Writer: "Test Writer",
        Actors: "Test Actor",
        Plot: "Test plot",
        Language: "English",
        Country: "USA",
        Awards: "Test Awards",
        Poster: "test.jpg",
        Ratings: [],
        Metascore: "80",
        imdbRating: "8.0",
        imdbVotes: "1000",
        Type: "movie",
        DVD: "01 Jan 2020",
        BoxOffice: "$100M",
        Production: "Test Prod",
        Website: "test.com",
        response: "True",
      };

      const action = {
        type: fetchMovieDetails.fulfilled.type,
        payload: mockMovie,
      };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.selectedMovie).toEqual(mockMovie);
    });

    it("should handle rejected movie details", () => {
      const action = {
        type: fetchMovieDetails.rejected.type,
        error: { message: "Movie not found" },
      };
      const state = movieReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Movie not found");
    });
  });
});

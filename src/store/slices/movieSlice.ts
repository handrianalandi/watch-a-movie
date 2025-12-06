import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Movie, MovieDetail } from "@/types/movie";
import {
  searchMovies as searchMoviesApi,
  getMovieDetails as getMovieDetailsApi,
} from "@/services/movieApi";
import { SearchTypeEnum } from "@/types/search";
import { SearchQuery } from "@/types/api";

interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetail | null;
  searchQuery: string;
  searchType: SearchTypeEnum;
  currentPage: number;
  fetchedTotalResults: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: MovieState = {
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

export const searchMovies = createAsyncThunk(
  "movies/search",
  async ({ query, page }: { query: SearchQuery; page: number }) => {
    const response = await searchMoviesApi(query, page);
    if (response.Response === "False") {
      throw new Error(response.Error || "Movie not found");
    }
    return {
      movies: response.Search,
      totalResults: parseInt(response.totalResults),
      page,
    };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchDetails",
  async (imdbID: string) => {
    const response = await getMovieDetailsApi(imdbID);
    if (response.response === "False") {
      throw new Error("Movie not found");
    }
    return response;
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      state.fetchedTotalResults = 0;
      state.movies = [];
    },
    setSearchType: (state, action: PayloadAction<SearchTypeEnum>) => {
      state.searchType = action.payload;
    },
    resetMovies: (state) => {
      state.movies = [];
      state.currentPage = 1;
      state.hasMore = false;
      state.error = null;
      state.fetchedTotalResults = 0;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        const { movies, totalResults, page } = action.payload;

        state.fetchedTotalResults = state.fetchedTotalResults + movies.length;

        const movieMap = new Map(
          state.movies.map((movie) => [movie.imdbID, movie])
        );
        movies.forEach((movie) => movieMap.set(movie.imdbID, movie));
        state.movies = Array.from(movieMap.values());

        state.currentPage = page;
        state.hasMore = state.fetchedTotalResults < totalResults;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search movies";
        state.movies = [];
        state.hasMore = false;
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movie details";
      });
  },
});

export const {
  setSearchQuery,
  setSearchType,
  resetMovies,
  clearSelectedMovie,
} = movieSlice.actions;
export default movieSlice.reducer;

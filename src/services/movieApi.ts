import axios from "axios";
import { SearchResponse, MovieDetail } from "@/types/movie";
import { SearchQuery } from "@/types/api";

const apiClient = axios.create({
  baseURL: "/api",
});

export const searchMovies = async (
  query: SearchQuery,
  page: number = 1
): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get<SearchResponse>("/search", {
      params: {
        s: query.search,
        type: query.type,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID: string): Promise<MovieDetail> => {
  try {
    const response = await apiClient.get<MovieDetail>(`/movie/${imdbID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

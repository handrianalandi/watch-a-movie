"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchComponent from "@/components/SearchBar/SearchBar";
import MovieList from "@/components/MovieList/MovieList";
import PosterModal from "@/components/PosterModal/PosterModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  searchMovies,
  setSearchQuery,
  setSearchType,
} from "@/store/slices/movieSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SearchQuery } from "@/types/api";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    movies,
    loading,
    error,
    hasMore,
    currentPage,

    searchQuery,
    searchType,
  } = useAppSelector((state) => state.movies);

  const [posterModal, setPosterModal] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const handleSearch = useCallback(
    (query: SearchQuery) => {
      dispatch(setSearchQuery(query.search));
      dispatch(setSearchType(query.type));
      dispatch(searchMovies({ query, page: 1 }));
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (searchQuery && hasMore && !loading) {
      dispatch(
        searchMovies({
          query: { search: searchQuery, type: searchType },
          page: currentPage + 1,
        })
      );
    }
  }, [dispatch, searchQuery, hasMore, loading, currentPage, searchType]);

  const handleMovieClick = (imdbID: string) => {
    router.push(`/movie/${imdbID}`);
  };

  const handlePosterClick = (posterUrl: string) => {
    const movie = movies.find((m) => m.Poster === posterUrl);
    setPosterModal({
      url: posterUrl,
      title: movie?.Title || "Movie Poster",
    });
  };

  const closePosterModal = () => {
    setPosterModal(null);
  };

  const setTargetElement = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: handleLoadMore,
    threshold: 500,
  });

  const hasContent = movies.length > 0 || error;

  return (
    <main
      className={`min-h-screen px-4 sm:px-6 lg:px-8 ${
        !hasContent ? "flex items-center justify-center" : "py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <header
          className={`text-center transition-all duration-500 ${
            !hasContent ? "mb-8" : "mb-12 mt-0"
          }`}
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            Watch-a-Movie
          </h1>
          <p className="text-gray-400 text-lg">
            What do you want to watch today?
          </p>
        </header>

        <div
          className={`transition-all duration-500 ${
            !hasContent ? "mb-0" : "mb-12"
          }`}
        >
          <SearchComponent onSearch={handleSearch} value={searchQuery} />
        </div>

        {(movies.length > 0 || error) && (
          <div className="mb-8">
            <MovieList
              movies={movies}
              loading={loading}
              error={error}
              onMovieClick={handleMovieClick}
              onPosterClick={handlePosterClick}
            />
          </div>
        )}

        {searchQuery && (
          <div
            ref={setTargetElement}
            className="h-20 flex items-center justify-center"
          >
            {loading && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                <span>Loading more movies...</span>
              </div>
            )}
            {!hasMore && movies.length > 0 && !loading && (
              <p className="text-white/40">No more movies to load</p>
            )}
          </div>
        )}
      </div>

      {posterModal && (
        <PosterModal
          posterUrl={posterModal.url}
          title={posterModal.title}
          onClose={closePosterModal}
        />
      )}
    </main>
  );
}

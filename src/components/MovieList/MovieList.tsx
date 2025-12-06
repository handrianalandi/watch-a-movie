"use client";

import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard/MovieCard";
import { CardBody, Skeleton } from "@nextui-org/react";
import { IoAlertCircleOutline, IoFilmOutline } from "react-icons/io5";
import Card from "../Card/Card";

function MovieListSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    <Card
      key={`skeleton-${index}`}
      className="bg-white/5 backdrop-blur-sm border border-white/10"
    >
      <CardBody className="p-0">
        <Skeleton className="rounded-none">
          <div className="aspect-[2/3] bg-gradient-to-b from-gray-700 to-gray-800" />
        </Skeleton>
      </CardBody>
      <div className="p-4 space-y-2">
        <Skeleton className="rounded-lg">
          <div className="h-5 bg-white/10 rounded" />
        </Skeleton>
        <Skeleton className="rounded-lg w-2/3">
          <div className="h-4 bg-white/10 rounded" />
        </Skeleton>
      </div>
    </Card>
  ));
}

interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onMovieClick: (imdbID: string) => void;
  onPosterClick: (posterUrl: string) => void;
}

export default function MovieList({
  movies,
  loading,
  error,
  onMovieClick,
  onPosterClick,
}: MovieListProps) {
  if (error) {
    if (error === "Movie not found!") {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <IoFilmOutline className="w-20 h-20 text-white/20 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No movies found
          </h3>
          <p className="text-gray-400">Try searching for a different title</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <IoAlertCircleOutline className="w-16 h-16 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-400">{error}</p>
        </div>
      );
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie, index) => (
        <div key={`${movie.imdbID}-${index}`}>
          <MovieCard
            movie={movie}
            onMovieClick={onMovieClick}
            onPosterClick={onPosterClick}
          />
        </div>
      ))}

      {loading && <MovieListSkeleton />}
    </div>
  );
}

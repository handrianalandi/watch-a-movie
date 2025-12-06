"use client";

import React, { useState } from "react";
import { Movie } from "@/types/movie";
import { CardBody, CardFooter, Chip, Tooltip, Image } from "@nextui-org/react";
import Card from "@/components/Card/Card";
import { DEFAULT_MOVIE_PLACEHOLDER } from "@/constant/general";

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (imdbID: string) => void;
  onPosterClick: (posterUrl: string) => void;
}

export default function MovieCard({
  movie,
  onMovieClick,
  onPosterClick,
}: MovieCardProps) {
  const [source, setSource] = useState<string>(
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : DEFAULT_MOVIE_PLACEHOLDER
  );

  const handleCardClick = () => {
    onMovieClick(movie.imdbID);
  };

  const handlePosterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.Poster && movie.Poster !== "N/A") {
      onPosterClick(movie.Poster);
    }
  };

  return (
    <Card isPressable className="hover:scale-105">
      <CardBody className="p-0">
        <div
          className="relative aspect-[2/3] overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 cursor-zoom-in"
          onClick={handlePosterClick}
        >
          <Image
            src={source}
            alt={`${movie.Title} poster`}
            className="object-cover h-full w-full hover:scale-110 transition-transform duration-300 rounded-none"
            removeWrapper
            onError={() => {
              setSource(DEFAULT_MOVIE_PLACEHOLDER);
            }}
          />
        </div>
      </CardBody>
      <CardFooter
        className="flex-col items-start gap-2 p-4"
        onClick={handleCardClick}
      >
        <Tooltip content={movie.Title}>
          <h3 className="font-bold text-white text-lg line-clamp-1 w-full">
            {movie.Title}
          </h3>
        </Tooltip>
        <div className="flex items-center justify-between w-full">
          <span className="text-gray-400 text-sm">{movie.Year}</span>
          <Chip
            size="sm"
            variant="flat"
            className="bg-blue-500/20 text-blue-300"
          >
            {movie.Type.toUpperCase()}
          </Chip>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardBody, Image, Chip, Button, Spinner } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMovieDetails,
  clearSelectedMovie,
} from "@/store/slices/movieSlice";
import {
  IoChevronBack,
  IoAlertCircleOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { DEFAULT_MOVIE_PLACEHOLDER } from "@/constant/general";
import { Movie } from "@/types/movie";
import Card from "@/components/Card/Card";

interface DetailKey {
  key: string;
  twoCols?: boolean;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedMovie, loading, error } = useAppSelector(
    (state) => state.movies
  );

  const imdbID = params.id as string;

  const detailKeys: DetailKey[] = [
    {
      key: "Director",
    },
    {
      key: "Writer",
    },
    {
      key: "Actors",
      twoCols: true,
    },
    {
      key: "Language",
    },
    {
      key: "Country",
    },
  ];

  useEffect(() => {
    if (imdbID) {
      dispatch(fetchMovieDetails(imdbID));
    }
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [imdbID, dispatch]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-400 mt-4">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <IoAlertCircleOutline className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "Unable to load movie details"}
          </p>
          <Button color="primary" onPress={handleBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const posterUrl =
    selectedMovie.Poster !== "N/A"
      ? selectedMovie.Poster
      : DEFAULT_MOVIE_PLACEHOLDER;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="light"
          startContent={<IoChevronBack className="text-xl" />}
          onPress={handleBack}
          className="text-white/70 hover:text-white mb-8 -ml-2"
        >
          Back to Search
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="grid gap-4">
            <Image
              src={posterUrl}
              alt={`${selectedMovie.Title} poster`}
              className="w-full aspect-[2/3] object-cover"
              removeWrapper
            />
            <div className="flex flex-wrap gap-4">
              {selectedMovie.imdbRating &&
                selectedMovie.imdbRating !== "N/A" && (
                  <Card className="bg-yellow-500/20 border border-yellow-500/30">
                    <CardBody className="px-4 py-2">
                      <div className="text-xs text-yellow-300 mb-1">IMDb</div>
                      <div className="text-lg font-bold text-yellow-400">
                        ⭐ {selectedMovie.imdbRating}
                      </div>
                    </CardBody>
                  </Card>
                )}
              {selectedMovie.Metascore && selectedMovie.Metascore !== "N/A" && (
                <Card className="bg-green-500/20 border border-green-500/30">
                  <CardBody className="px-4 py-2">
                    <div className="text-xs text-green-300 mb-1">Metascore</div>
                    <div className="text-lg font-bold text-green-400">
                      {selectedMovie.Metascore}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedMovie.Genre.split(", ").map((genre) => (
                <Chip
                  key={genre}
                  variant="flat"
                  className="bg-blue-500/20 border border-blue-500/30 text-blue-300"
                >
                  {genre}
                </Chip>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {selectedMovie.Title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <span>
                  {selectedMovie.Year}&nbsp;•&nbsp;{selectedMovie.Rated}
                  &nbsp;•&nbsp;
                  {selectedMovie.Runtime}
                </span>
              </div>
            </div>

            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-white mb-2">Plot</h2>
                <p className="text-white/80 leading-relaxed">
                  {selectedMovie.Plot}
                </p>
              </CardBody>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              {detailKeys.map((key) => (
                <Card key={key.key} className={key.twoCols ? "col-span-2" : ""}>
                  <CardBody>
                    <div className="text-sm text-white/50 mb-1">{key.key}</div>
                    <div className="text-white font-medium">
                      {selectedMovie[key.key as keyof Movie]}
                    </div>
                  </CardBody>
                </Card>
              ))}
              {selectedMovie.Awards && selectedMovie.Awards !== "N/A" && (
                <Card className="col-span-2">
                  <CardBody>
                    <div className="text-sm text-white/50 mb-1 flex items-center gap-2">
                      <IoTrophyOutline className="text-lg" />
                      Awards
                    </div>
                    <div className="text-white font-medium">
                      {selectedMovie.Awards}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

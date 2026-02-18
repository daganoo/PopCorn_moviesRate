import { useState, useEffect } from "react";

const KEY = "f84fc31d";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();

          // Handle API errors (OMDB returns 200 with Response: "False" and Error message)
          if (data.Response === "False") {
            if (data.Error && data.Error.toLowerCase().includes("limit")) {
              throw new Error("Request limit reached! Please try again later.");
            }
            throw new Error(data.Error || "Movie not found");
          }

          // Network/HTTP error (e.g. 429, 500) when API didn't return our format
          if (!res.ok) {
            throw new Error(data.Error || "Something went wrong with fetching movies");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // Debounce: wait 500ms after user stops typing before making API call
      const timeoutId = setTimeout(() => {
        fetchMovies();
      }, 500);

      return function () {
        clearTimeout(timeoutId);
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}

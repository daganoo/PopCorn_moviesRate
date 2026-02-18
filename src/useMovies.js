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

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          
          // Handle API errors properly
          if (data.Response === "False") {
            // Check if it's a rate limit error
            if (data.Error && data.Error.includes("limit")) {
              throw new Error("Request limit reached! Please try again later.");
            }
            // Other API errors (e.g., "Movie not found")
            throw new Error(data.Error || "Movie not found");
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

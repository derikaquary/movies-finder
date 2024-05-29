import { useState, useEffect } from "react";

const KEY = "276982a5";

export function useMovies(query /* callback */) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      /* callback?.(); */

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("the connection is interupted");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("the movie cannot be found");
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

      fetchMovies();

      return function () {
        controller.abort(); /* this is the cleaning up for the fetch */
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}

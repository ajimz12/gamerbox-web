import React, { useState, useEffect, useRef, useCallback } from "react";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import { debounce } from "lodash";
import { fetchGames, searchGames } from "../services/rawgService";

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const genres = [
    { id: "", name: "Todos los géneros" },
    { id: "4", name: "Acción" },
    { id: "3", name: "Aventura" },
    { id: "5", name: "RPG" },
    { id: "2", name: "Shooter" },
    { id: "10", name: "Estrategia" },
    { id: "7", name: "Puzzle" },
    { id: "1", name: "Carreras" },
    { id: "15", name: "Deportes" }
  ];

  const gamesRef = useRef([]);

  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGames(page, 200, selectedGenre);

        if (page === 1) {
          setGames(data.results);
          setFilteredGames(data.results);
        } else {
          const newGames = [...gamesRef.current, ...data.results];
          setGames(newGames);
          setFilteredGames(newGames);
        }

        setHasMore(data.next !== null);
      } catch (error) {
        setError("Error al cargar los juegos");
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchTerm) {
      loadGames();
    }
  }, [page, searchTerm, selectedGenre]);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setFilteredGames(gamesRef.current);
        setHasMore(true);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchGames(term);
        const results = selectedGenre
          ? data.results.filter(game => 
              game.genres.some(genre => genre.id === parseInt(selectedGenre))
            )
          : data.results;
        setFilteredGames(results);
        setHasMore(false);
      } catch (error) {
        console.error("Error searching games:", error);
        setError("Error al buscar juegos");
      } finally {
        setIsLoading(false);
      }
    }, 400),
    [selectedGenre] 
  );

  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGames(page, 200, selectedGenre);

        if (page === 1) {
          setGames(data.results);
          setFilteredGames(data.results);
        } else {
          const newGames = [...gamesRef.current, ...data.results];
          setGames(newGames);
          setFilteredGames(newGames);
        }

        setHasMore(data.next !== null);
      } catch (error) {
        setError("Error al cargar los juegos");
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchTerm) {
      setPage(1);
      loadGames();
    }
  }, [page, searchTerm, selectedGenre]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-6">
            Explorar Juegos
          </h1>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
            <SearchBar onSearch={handleSearch} placeholder="Buscar juegos..." />
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {isLoading && <LoadingSpinner />}

        {!isLoading && hasMore && !searchTerm && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="bg-[#3D5AFE] text-[#E0E0E0] px-6 py-2 cursor-pointer rounded-md hover:bg-[#5C6BC0] transition-colors"
            >
              Cargar más juegos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;

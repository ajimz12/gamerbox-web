import React, { useState, useEffect, useCallback } from "react";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import { debounce } from "lodash";
import {
  fetchGames,
  searchGames,
  fetchGenres,
  fetchPlatforms,
} from "../services/rawgService";
import { MdCake } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BiFilterAlt, BiJoystick } from "react-icons/bi";
import { FaGamepad } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";

const ITEMS_PER_PAGE = 20;

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [genresData, platformsData] = await Promise.all([
          fetchGenres(),
          fetchPlatforms(),
        ]);

        setGenres([
          { id: "", name: "Todos los géneros" },
          ...genresData.results,
        ]);
        setPlatforms([
          { id: "", name: "Todas las plataformas" },
          ...platformsData.results,
        ]);

        const currentYear = new Date().getFullYear();
        const years = Array.from(
          { length: currentYear - 1990 + 1 },
          (_, i) => currentYear - i
        );
        setAvailableYears(years);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGames(
          currentPage,
          ITEMS_PER_PAGE,
          selectedGenre,
          selectedPlatform,
          selectedYear
        );
        setGames(data.results);
        setFilteredGames(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
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
  }, [currentPage, searchTerm, selectedGenre, selectedPlatform, selectedYear]);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setFilteredGames(games);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchGames(term);
        let results = data.results;

        if (selectedGenre) {
          results = results.filter((game) =>
            game.genres.some((genre) => genre.id === parseInt(selectedGenre))
          );
        }

        if (selectedPlatform) {
          results = results.filter((game) =>
            game.parent_platforms.some(
              (platform) => platform.platform.id === parseInt(selectedPlatform)
            )
          );
        }

        if (selectedYear) {
          results = results.filter((game) => {
            const gameYear = new Date(game.released).getFullYear();
            return gameYear === parseInt(selectedYear);
          });
        }

        setFilteredGames(results);
      } catch (error) {
        console.error("Error searching games:", error);
        setError("Error al buscar juegos");
      } finally {
        setIsLoading(false);
      }
    }, 400),
    [selectedGenre, selectedPlatform, selectedYear, games]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handlePageChange = (newPage) => {
    setIsLoading(true); 
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-6 flex items-center gap-2">
            <BiJoystick className="text-[#3D5AFE]" />
            Explorar Juegos
          </h1>
          <div className="w-full max-w-4xl space-y-4 flex flex-col items-center mt-5">
            <div className="w-full max-w-lg mx-auto">
              <SearchBar onSearch={handleSearch} placeholder="Buscar juegos..." />
            </div>
            
            <div className="relative w-full max-w-lg mx-auto">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-[#1E1E1E] text-[#E0E0E0] rounded-lg hover:bg-[#2D2D2D] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BiFilterAlt className="text-[#3D5AFE]" />
                  <span>Filtros</span>
                </div>
                {isFiltersOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>

              {isFiltersOpen && (
                <div className="mt-2 p-4 bg-[#1E1E1E] rounded-lg shadow-lg space-y-4 w-full">
                  <div className="flex items-center gap-2">
                    <FaGamepad className="text-[#3D5AFE]" />
                    <select
                      value={selectedGenre}
                      onChange={(e) => {
                        setSelectedGenre(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-[#2D2D2D] text-[#E0E0E0] border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors cursor-pointer"
                    >
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <BiJoystick className="text-[#3D5AFE]" />
                    <select
                      value={selectedPlatform}
                      onChange={(e) => {
                        setSelectedPlatform(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-[#2D2D2D] text-[#E0E0E0] border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors cursor-pointer"
                    >
                      {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="text-[#3D5AFE]" />
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-[#2D2D2D] text-[#E0E0E0] border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors cursor-pointer"
                    >
                      <option value="">Todos los años</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => <GameCard key={game.id} game={game} />)
            ) : (
              <div className="col-span-full flex flex-col justify-center items-center py-12 space-y-4">
                <MdCake className="text-6xl text-[#E0E0E0]" />
                <p className="text-[#E0E0E0] text-xl font-bold italic">
                  The cake is a lie
                </p>
                <p className="text-[#E0E0E0] text-lg">
                  No se encontraron juegos que coincidan con los criterios
                  seleccionados
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !searchTerm && (
          <div className="mt-8 flex justify-center gap-4 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-[#E0E0E0] p-2 rounded-full hover:bg-[#3D5AFE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              aria-label="Página anterior"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
            <span className="text-[#E0E0E0] px-4 py-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-[#E0E0E0] p-2 rounded-full hover:bg-[#3D5AFE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              aria-label="Página siguiente"
            >
              <IoIosArrowForward className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;

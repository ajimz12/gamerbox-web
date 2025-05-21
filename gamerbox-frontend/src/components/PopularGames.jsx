import React, { useEffect, useState, useRef } from "react";
import GameCard from "./GameCard";
import LoadingSpinner from "./LoadingSpinner";
import { fetchPopularGames } from "../services/rawgService";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PopularGames = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchPopularGames();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 500;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const handleScroll = () => checkScroll();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      setTimeout(checkScroll, 100);
    }
  }, [games]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative p-8">
      {/* Botón Izquierda */}
      {canScrollLeft && (
        <button
          className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#1E1E1E] text-[#E0E0E0] rounded-full shadow p-2 hover:bg-[#3D5AFE] transition-colors duration-300"
          onClick={() => scroll("left")}
        >
          <ChevronLeft />
        </button>
      )}

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar space-x-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {games.map((game) => (
          <div key={game.id} className="flex-shrink-0 w-64">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* Botón Derecha */}
      {canScrollRight && (
        <button
          className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#1E1E1E] text-[#E0E0E0] rounded-full shadow p-2 hover:bg-[#3D5AFE] transition-colors duration-300"
          onClick={() => scroll("right")}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default PopularGames;

import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";
import LoadingSpinner from "./LoadingSpinner";

const PopularGames = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games?page_size=10&ordering=-metacritic`);
        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Juegos Populares</h1>
      <div className="flex overflow-x-auto space-x-4">
        {games.map((game) => (
          <div key={game.id} className="flex-shrink-0 w-64">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularGames;

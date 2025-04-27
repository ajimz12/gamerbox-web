import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

const PopularGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/games");
        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

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

import React, { useEffect, useState } from "react";
import PopularGames from "../components/PopularGames";

const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games	`);
        const data = await response.json();
        setGames(data.results);
        if (data.results.length > 0) {
          const randomGame =
            data.results[Math.floor(Math.random() * data.results.length)];
          setBackgroundImage(randomGame.background_image);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const interval = setInterval(() => {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        setBackgroundImage(randomGame.background_image);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [games]);

  return (
    <div className="flex flex-col items-center">
      {/* Banner */}
      <div
        className="w-full flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />
        <div className="z-10 flex flex-col items-center gap-4 text-white text-2xl md:text-4xl font-bold">
          <h1>Registra lo que has jugado</h1>
          <h1>Descubre los que aún te esperan</h1>
          <h1>Comparte lo mejor con tu comunidad</h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-7xl px-4 py-10">
        <PopularGames />
      </div>
    </div>
  );
};

export default Home;

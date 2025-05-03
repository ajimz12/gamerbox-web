import React from "react";
import "../assets/GameCard.css";

const genreTranslations = {
  "Action": "Acción",
  "Adventure": "Aventura",
  "RPG": "RPG",
  "Strategy": "Estrategia",
  "Racing": "Carreras",
  "Sports": "Deportes",
  "Simulation": "Simulación",
  "Fighting": "Lucha",
  "Family": "Familiar",
  "Board Games": "Juegos de Mesa",
  "Educational": "Educativo",
  "Card": "Cartas",
  "Massively Multiplayer": "Multijugador Masivo",
  "Platformer": "Plataformas"
};

const translateGenre = (genre) => {
  return genreTranslations[genre] || genre;
};

const GameCard = ({ game }) => {
  return (
    <div className="game-card cursor-pointer">
      <div className="image-container">
        <img
          src={game.background_image}
          alt={game.name}
          className="game-image"
        />
        <div className="game-info">
          <h2 className="text-lg font-semibold">{game.name}</h2>
          <p className="text-gray-400">
            {game.genres.map(genre => translateGenre(genre.name)).join(", ")}
          </p>
          <p className="text-gray-400">
            {new Date(game.released).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

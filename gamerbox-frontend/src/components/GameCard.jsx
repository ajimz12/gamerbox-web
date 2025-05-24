import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/GameCard.css";

const genreTranslations = {
  Action: "Acción",
  Adventure: "Aventura",
  RPG: "RPG",
  Strategy: "Estrategia",
  Racing: "Carreras",
  Sports: "Deportes",
  Simulation: "Simulación",
  Fighting: "Lucha",
  Family: "Familiar",
  "Board Games": "Juegos de Mesa",
  Educational: "Educativo",
  Card: "Cartas",
  "Massively Multiplayer": "Multijugador Masivo",
  Platformer: "Plataformas",
};

const translateGenre = (genre) => {
  return genreTranslations[genre] || genre;
};

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  };

  const defaultImage = "/img/noimage.png";

  return (
    <div className="game-card cursor-pointer" onClick={handleClick}>
      <div className="image-container">
        <img
          src={game.background_image || defaultImage}
          alt={game.name}
          className="game-image"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
          style={
            !game.background_image
              ? {
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  position: "relative",
                  top: "50%",
                  transform: "translateY(-50%)",
                }
              : {}
          }
        />
        <div className="game-info">
          <h2 className="text-lg font-semibold">{game.name}</h2>
          <p className="text-gray-400 font-chakra text-lg">
            {game.genres.map((genre) => translateGenre(genre.name)).join(", ")}
          </p>
          <p className="text-gray-400 font-chakra text-sm">
            {new Date(game.released).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

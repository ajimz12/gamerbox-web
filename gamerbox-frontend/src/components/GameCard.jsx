import React from "react";
import "../assets/GameCard.css";

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
            {game.genres.map((genre) => genre.name).join(", ")}
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

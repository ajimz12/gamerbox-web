import React from "react";
import PopularGames from "../components/PopularGames";

const Home = () => {
  return (
    <div className="flex flex-col items-center bg-[#121212]">
      {/* Banner */}
      <div
        className="w-full flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.6) 70%, rgba(18, 18, 18, 1)), url(/header.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-[#121212] opacity-20" />
        <div className="z-10 flex flex-col items-center gap-4 text-[#E0E0E0] text-2xl md:text-4xl font-bold">
          <h1>Juega.</h1>
          <h1>Descubre.</h1>
          <h1>Comparte.</h1>
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

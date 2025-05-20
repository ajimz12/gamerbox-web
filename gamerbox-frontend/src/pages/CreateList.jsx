import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchGames } from "../services/rawgService";
import { createList } from "../services/api";
import { toast } from "react-toastify";

const CreateList = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchGames(searchTerm);
      setSearchResults(data.results || []);
    } catch (error) {
      toast.error("Error al buscar juegos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGame = (game) => {
    if (!selectedGames.some((g) => g.id === game.id)) {
      setSelectedGames([...selectedGames, game]);
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  const handleRemoveGame = (gameId) => {
    setSelectedGames(selectedGames.filter((game) => game.id !== gameId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Por favor, ingresa un título para la lista");
      return;
    }

    setIsCreating(true);
    try {
      const data = await createList({
        title,
        description,
        isPublic,
        games: selectedGames
      });
      
      toast.success("Lista creada exitosamente");
      navigate(`/user/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : ''}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al crear la lista");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-2xl mx-auto bg-[#1E1E1E] p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-white mb-6">
          Crear Nueva Lista
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#2C2C2C] text-white p-2 rounded"
              placeholder="Nombre de la lista"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#2C2C2C] text-white p-2 rounded"
              rows="3"
              placeholder="Descripción de la lista"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <label className="text-white">Lista Pública</label>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-[#2C2C2C] text-white p-2 rounded"
                placeholder="Buscar juegos..."
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-[#3D5AFE] text-white cursor-pointer px-4 py-2 rounded"
                disabled={isLoading}
              >
                Buscar
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-[#2C2C2C] rounded p-2 max-h-60 overflow-y-auto">
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleAddGame(game)}
                    className="flex items-center gap-2 p-2 hover:bg-[#3D5AFE] cursor-pointer rounded"
                  >
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-white">{game.name}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedGames.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-semibold">
                  Juegos Seleccionados:
                </h3>
                {selectedGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between bg-[#2C2C2C] p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-white">{game.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGame(game.id)}
                      className="text-red-500 cursor-pointer hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-[#3D5AFE] text-white cursor-pointer py-2 rounded hover:bg-[#5C6BC0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </>
            ) : (
              "Crear Lista"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateList;

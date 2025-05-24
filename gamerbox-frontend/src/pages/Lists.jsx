import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListCard from "../components/ListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/lists`
        );

        if (!response.ok) {
          throw new Error("Error al cargar las listas");
        }

        const data = await response.json();
        setLists(data.lists);
        setFilteredLists(data.lists);
      } catch (error) {
        setError(
          "Error al cargar las listas. Por favor, inténtalo de nuevo más tarde."
        );
        console.error("Error cargando listas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = lists.filter(
      (list) =>
        list.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        list.creator.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
    );
    setFilteredLists(filtered);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen font-chakra flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-chakra bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl mb-10 font-bold text-[#E0E0E0]">
            Listas de Juegos
          </h1>
          {localStorage.getItem("token") && (
            <Link
              to="/create-list"
              className="bg-[#3D5AFE] text-white px-4 py-2 rounded-lg hover:bg-[#536DFE] transition-colors flex items-center space-x-2"
            >
              <span>Crear Lista</span>
            </Link>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <SearchBar onSearch={handleSearch} placeholder="Buscar listas..." />
        </div>

        {filteredLists.length === 0 ? (
          <div className="text-center text-[#A0A0A0] bg-[#1E1E1E] p-8 rounded-lg shadow-sm border border-[#2C2C2C]">
            No se encontraron listas
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;

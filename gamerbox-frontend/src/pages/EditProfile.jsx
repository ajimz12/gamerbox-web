import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getSuperFavoriteGames, addSuperFavoriteGame, removeSuperFavoriteGame } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchGames } from '../services/rawgService';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const { user, login: updateAuthUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [location, setLocation] = useState(user?.location || '');
  const [instagramProfile, setInstagramProfile] = useState((user?.instagram_profile || '').replace('@', ''));
  const [twitterProfile, setTwitterProfile] = useState((user?.twitter_profile || '').replace('@', ''));
  const [description, setDescription] = useState(user?.description || '');
  const [previewUrl, setPreviewUrl] = useState(
    user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : '/profile_pictures/pfp.png'
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = {
        username,
        profilePicture,
        location,
        instagram_profile: instagramProfile ? `@${instagramProfile}` : '',
        twitter_profile: twitterProfile ? `@${twitterProfile}` : '',
        description
      };

      const updatedUser = await updateProfile(formData);
      updateAuthUser({
        user: updatedUser,
        token: localStorage.getItem('token')
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [superFavoriteGames, setSuperFavoriteGames] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSuperFavorites = async () => {
      try {
        const games = await getSuperFavoriteGames(user.username);
        setSuperFavoriteGames(games);
      } catch (error) {
        console.error('Error al cargar juegos superfavoritos:', error);
      }
    };

    fetchSuperFavorites();
  }, [user.username]);

  const handleGameSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      try {
        const data = await searchGames(searchTerm);
        setSearchResults(data.results || []);
      } catch (error) {
        console.error('Error al buscar juegos:', error);
        toast.error('Error al buscar juegos');
      }
      setIsSearching(false);
    }
  };

  const handleAddSuperFavorite = async (game) => {
    if (superFavoriteGames.length >= 5) {
      toast.error('Solo puedes tener 5 juegos superfavoritos');
      return;
    }

    try {
      await addSuperFavoriteGame(game.id);
      setSuperFavoriteGames([...superFavoriteGames, game]);
      setSearchResults([]);
      setSearchTerm('');
      toast.success('Juego añadido a superfavoritos');
    } catch (error) {
      toast.error(error.message || 'Error al añadir el juego a superfavoritos');
    }
  };

  const handleRemoveSuperFavorite = async (gameId) => {
    try {
      await removeSuperFavoriteGame(gameId);
      setSuperFavoriteGames(superFavoriteGames.filter(game => game.rawgId !== gameId));
      toast.success('Juego eliminado de superfavoritos');
    } catch (error) {
      toast.error('Error al eliminar el juego de superfavoritos');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-2xl mx-auto bg-[#1E1E1E] p-8 rounded-lg shadow border border-[#2C2C2C]">
        <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de perfil */}
          <div>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover rounded-full border-2 border-[#3D5AFE]"
                  src={previewUrl}
                  alt="Profile preview"
                  onError={(e) => {
                    e.target.src = '/profile_pictures/pfp.png';
                  }}
                />
              </div>
              <label className="block">
                <span className="sr-only">Elige una foto de perfil</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-[#A0A0A0]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#3D5AFE] file:text-[#E0E0E0]
                    hover:file:bg-[#5C6BC0]
                    cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Campos de formulario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-[#2C2C2C] rounded-md shadow-sm 
                placeholder-[#A0A0A0] bg-[#1E1E1E] text-[#E0E0E0]
                focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE]"
            />
          </div>

          {/* Sección de Juegos Superfavoritos */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Juegos Superfavoritos (máximo 5)
            </label>
            
            {/* Lista de juegos superfavoritos */}
            <div className="space-y-2">
              {superFavoriteGames.map((game) => (
                <div key={`superfav-${game.rawgId}`} className="flex items-center justify-between bg-[#252525] p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <img
                      src={game.backgroundImage}
                      alt={game.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-[#E0E0E0]">{game.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSuperFavorite(game.rawgId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            {/* Buscador de juegos */}
            {superFavoriteGames.length < 5 && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar juegos para añadir..."
                      className="w-full px-3 py-2 pl-10 border border-[#2C2C2C] rounded-md bg-[#1E1E1E] text-[#E0E0E0]"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGameSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-[#3D5AFE] text-[#E0E0E0] rounded-md hover:bg-[#5C6BC0] disabled:opacity-50"
                  >
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                {/* Resultados de búsqueda */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-[#252525] rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((game) => (
                      <div
                        key={`search-${game.id}`}
                        className="flex items-center space-x-2 p-2 hover:bg-[#3D3D3D] cursor-pointer"
                        onClick={() => handleAddSuperFavorite(game)}
                      >
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="text-[#E0E0E0]">{game.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Madrid, España"
              className="appearance-none block w-full px-3 py-2 border border-[#2C2C2C] rounded-md shadow-sm 
                placeholder-[#A0A0A0] bg-[#1E1E1E] text-[#E0E0E0]
                focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Usuario de Instagram
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#A0A0A0]">@</span>
                <input
                  type="text"
                  id="instagram"
                  value={instagramProfile}
                  onChange={(e) => setInstagramProfile(e.target.value.replace('@', ''))}
                  placeholder="usuario"
                  className="appearance-none block w-full pl-8 px-3 py-2 border border-[#2C2C2C] rounded-md shadow-sm 
                    placeholder-[#A0A0A0] bg-[#1E1E1E] text-[#E0E0E0]
                    focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Usuario de Twitter
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#A0A0A0]">@</span>
                <input
                  type="text"
                  id="twitter"
                  value={twitterProfile}
                  onChange={(e) => setTwitterProfile(e.target.value.replace('@', ''))}
                  placeholder="usuario"
                  className="appearance-none block w-full pl-8 px-3 py-2 border border-[#2C2C2C] rounded-md shadow-sm 
                    placeholder-[#A0A0A0] bg-[#1E1E1E] text-[#E0E0E0]
                    focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE]"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#E0E0E0] mb-2">
              Sobre mí
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              className="appearance-none block w-full px-3 py-2 border border-[#2C2C2C] rounded-md shadow-sm 
                placeholder-[#A0A0A0] bg-[#1E1E1E] text-[#E0E0E0]
                focus:outline-none focus:ring-[#3D5AFE] focus:border-[#3D5AFE]"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-[#E0E0E0] bg-[#2C2C2C] hover:bg-[#1E1E1E] rounded-md cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[#E0E0E0] bg-[#3D5AFE] hover:bg-[#5C6BC0] rounded-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
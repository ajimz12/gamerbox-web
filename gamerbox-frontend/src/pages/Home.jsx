import React from "react";
import PopularGames from "../components/PopularGames";
import ListCard from "../components/ListCard";
import { useState, useEffect } from "react";
import { getAllReviews, getFollowingReviews } from "../services/api/reviews";
import { getRecentLists } from "../services/api/lists";
import { getAllUsers } from "../services/api/users";
import { fetchTotalGames } from "../services/rawgService";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewItem from "../components/ReviewItem";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { MdRateReview, MdGames } from "react-icons/md";
import { FaList, FaUsers } from "react-icons/fa";

const Home = () => {
  const [popularReviews, setPopularReviews] = useState([]);
  const [followingReviews, setFollowingReviews] = useState([]);
  const [recentLists, setRecentLists] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalGamesCount, setTotalGamesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          popularData,
          followingData,
          listsData,
          usersData,
          gamesCountData,
        ] = await Promise.all([
          getAllReviews("popular"),
          user ? getFollowingReviews() : Promise.resolve([]),
          getRecentLists(),
          getAllUsers(),
          fetchTotalGames(),
        ]);

        setPopularReviews(popularData.slice(0, 6));
        setFollowingReviews(followingData.slice(0, 3));
        setRecentLists(listsData.lists?.slice(0, 3) || []);
        setUsers(usersData || []);
        setTotalGamesCount(gamesCountData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center bg-[#121212] min-h-screen">
        {/* Banner */}
        <div
          className="w-full flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.6) 70%, rgba(18, 18, 18, 1)), url(/img/header.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-[#121212] opacity-20" />
          <div className="z-10 flex flex-col font-press-start items-center gap-4 text-[#E0E0E0] text-2xl md:text-4xl font-bold">
            <h1>Juega.</h1>
            <h1>Descubre.</h1>
            <h1>Comparte.</h1>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 py-10">
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[#121212]">
      {/* Banner */}
      <div
        className="w-full flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.6) 70%, rgba(18, 18, 18, 1)), url(/img/header.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-[#121212] opacity-20" />
        <div className="z-10 flex flex-col font-press-start items-center gap-8 text-[#E0E0E0] text-2xl md:text-4xl font-bold">
          <h1 className="animate-slide-in" style={{ animationDelay: "0.3s" }}>
            Juega.
          </h1>
          <h1 className="animate-slide-in" style={{ animationDelay: "0.6s" }}>
            Descubre.
          </h1>
          <h1 className="animate-slide-in" style={{ animationDelay: "0.9s" }}>
            Comparte.
          </h1>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="w-full max-w-2xl font-chakra mx-auto -mt-16 px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/reviews" className="block">
            <div className="bg-[#1E1E1E] shadow-xl p-4 rounded-full text-center transform hover:scale-105 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center mx-auto cursor-pointer">
              <div className="text-[#FF6B6B] text-3xl mb-1">
                <MdRateReview />
              </div>
              <div className="text-xl font-bold text-[#E0E0E0]">
                {popularReviews.length}
              </div>
              <div className="text-xs text-[#A0A0A0]">Reseñas</div>
            </div>
          </Link>
          <Link to="/lists" className="block">
            <div className="bg-[#1E1E1E] shadow-xl p-4 rounded-full text-center transform hover:scale-105 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center mx-auto cursor-pointer">
              <div className="text-[#4ECDC4] text-3xl mb-1">
                <FaList />
              </div>
              <div className="text-xl font-bold text-[#E0E0E0]">
                {recentLists.length}
              </div>
              <div className="text-xs text-[#A0A0A0]">Listas</div>
            </div>
          </Link>
          <Link to="/users" className="block">
            <div className="bg-[#1E1E1E] shadow-xl p-4 rounded-full text-center transform hover:scale-105 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center mx-auto cursor-pointer">
              <div className="text-[#FFD93D] text-3xl mb-1">
                <FaUsers />
              </div>
              <div className="text-xl font-bold text-[#E0E0E0]">
                {users?.length || 0}
              </div>
              <div className="text-xs text-[#A0A0A0]">Miembros</div>
            </div>
          </Link>
          <Link to="/games" className="block">
            <div className="bg-[#1E1E1E] shadow-xl p-4 rounded-full text-center transform hover:scale-105 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center mx-auto cursor-pointer">
              <div className="text-[#4A90E2] text-3xl mb-1">
                <MdGames />
              </div>
              <div className="text-xl  font-bold text-[#E0E0E0]">
                {totalGamesCount?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-[#A0A0A0]">Juegos</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 py-10">
        <div className="space-y-16">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold text-[#E0E0E0]">
                Descubre los Juegos del Momento
              </h1>
            </div>
            <PopularGames />
          </div>

          <div className="space-y-32 mt-30 mb-40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-[#E0E0E0]">
                  ¿Qué es Gamerbox?
                </h1>
                <p className="text-[#A0A0A0] text-xl font-chakra leading-relaxed">
                  Gamerbox es tu espacio personal para explorar, compartir y
                  organizar tu pasión por los videojuegos. Una plataforma
                  diseñada por y para gamers, donde podrás descubrir nuevos
                  títulos, conectar con otros jugadores y mantener un registro
                  de tus experiencias gaming.
                </p>
              </div>
              <div className="relative group">
                <img
                  src="/img/logo.png"
                  alt="Gamerbox"
                  className="rounded-lg shadow-xl h-100  transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative group">
                <img
                  src="/img/feature-2.png"
                  alt="Comparte tu opinion"
                  className="rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <h1 className="text-2xl font-bold text-[#E0E0E0]">
                  Expresa tus opiniones sobre juegos
                </h1>
                <p className="text-[#A0A0A0] font-chakra text-xl leading-relaxed">
                  Comparte tus experiencias, escribe reseñas detalladas y valora
                  los juegos que has probado. Tu opinión ayuda a otros jugadores
                  a descubrir nuevos títulos y contribuye a crear una comunidad
                  más informada.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-[#E0E0E0]">
                  Descubre a lo que juegan tus amigos
                </h1>
                <p className="text-[#A0A0A0] text-xl font-chakra leading-relaxed">
                  Conecta con otros jugadores, sigue sus actividades y descubre
                  nuevos juegos a través de sus experiencias. Mantente al día
                  con las últimas reseñas y recomendaciones de tu círculo de
                  amigos gaming.
                </p>
              </div>
              <div className="relative group">
                <img
                  src="/img/feature-3.png"
                  alt="Connect with friends"
                  className="rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative group">
                <img
                  src="/img/feature-4.png"
                  alt="Organiza tus juegos"
                  className="rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <h1 className="text-2xl font-bold text-[#E0E0E0]">
                  Organiza tus juegos
                </h1>
                <p className="text-[#A0A0A0] text-xl font-chakra leading-relaxed">
                  Crea listas personalizadas para organizar tus juegos:
                  pendientes, favoritos, completados y más. Una manera perfecta
                  de mantener un registro de tu colección y compartir
                  recomendaciones temáticas con la comunidad.
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="mb-40">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-[#E0E0E0]">
                  Lo Último de tus Amigos
                </h1>
              </div>
              {followingReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {followingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="transform hover:scale-105 transition-transform duration-300"
                    >
                      <ReviewItem review={review} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1E1E1E] p-8 rounded-lg text-center text-[#A0A0A0]">
                  <p className="text-lg font-chakra">
                    No hay actividad reciente de tus seguidos
                  </p>
                  <p className="mt-2 font-chakra">
                    ¡Comienza a seguir a otros gamers para ver sus
                    actualizaciones!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sección de Últimas Listas */}
          <div className="mb-40">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold text-[#E0E0E0]">
                Colecciones de la Comunidad
              </h1>
              <Link
                to="/lists"
                className="text-[#3D5AFE] hover:text-[#536DFE] text-lg font-chakra font-medium hover:underline"
              >
                Ver todas las listas
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentLists.length > 0 ? (
                recentLists.map((list) => (
                  <div
                    key={list.id}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <ListCard list={list} />
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-[#1E1E1E] p-8 rounded-lg text-center text-[#A0A0A0]">
                  <p className="text-lg font-chakra">
                    Aún no hay listas disponibles
                  </p>
                  <p className="mt-2 font-chakra">
                    ¡Sé el primero en crear una lista de juegos!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Reseñas Populares */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold text-[#E0E0E0]">
                Reseñas populares esta semana
              </h1>
              <Link
                to="/reviews"
                className="text-[#3D5AFE] hover:text-[#536DFE] text-lg font-chakra font-medium hover:underline"
              >
                Ver todas las reseñas
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {popularReviews.map((review) => (
                <div
                  key={review.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ReviewItem review={review} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

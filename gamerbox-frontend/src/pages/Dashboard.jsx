import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAdminStats,
  adminBanUser,
  adminUnbanUser,
} from "../services/api/admin";
import { getAllUsers } from "../services/api/users";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await getAdminStats();
        const usersData = await getAllUsers();

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError("Error al cargar los datos del panel de administración");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.roles?.includes("ROLE_ADMIN")) {
      fetchAdminData();
    } else {
      setLoading(false);
      setError("Acceso no autorizado");
    }
  }, [user]);

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await adminUnbanUser(userId);
      } else {
        await adminBanUser(userId);
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBanned: !isBanned } : user
        )
      );
    } catch (err) {
      console.error("Error al cambiar el estado del usuario:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user?.roles?.includes("ROLE_ADMIN")) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex items-center justify-center">
        <div className="text-red-500">
          No tienes permisos para acceder al panel de administración
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-chakra bg-[#121212] text-[#E0E0E0] p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/users"
          className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C] cursor-pointer transform transition-transform hover:scale-105"
        >
          <h3 className="text-xl mb-2">Usuarios Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">
            {stats?.totalUsers || 0}
          </p>
        </Link>
        <Link
          to="/reviews"
          className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C] cursor-pointer transform transition-transform hover:scale-105"
        >
          <h3 className="text-xl mb-2">Reseñas Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">
            {stats?.totalReviews || 0}
          </p>
        </Link>
        <Link
          to="/lists"
          className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C] cursor-pointer transform transition-transform hover:scale-105"
        >
          <h3 className="text-xl mb-2">Listas Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">
            {stats?.totalLists || 0}
          </p>
        </Link>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-[#1E1E1E] rounded-lg border border-[#2C2C2C] overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b border-[#2C2C2C]">
          Gestión de Usuarios
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2C2C2C]">
              <tr>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id} className="border-b border-[#2C2C2C]">
                  <td className="px-6 py-4">{userItem.username}</td>
                  <td className="px-6 py-4">{userItem.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded ${userItem.roles?.includes("ROLE_ADMIN") ? "bg-purple-600" : "bg-blue-600"}`}>
                      {userItem.roles?.includes("ROLE_ADMIN") ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-2 rounded ${
                        userItem.isBanned ? "bg-red-500" : "bg-green-700"
                      }`}
                    >
                      {userItem.isBanned ? "Baneado" : "Activo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!userItem.roles?.includes("ROLE_ADMIN") && (
                      <button
                        onClick={() =>
                          handleBanUser(userItem.id, userItem.isBanned)
                        }
                        className={`px-4 py-2 cursor-pointer rounded ${
                          userItem.isBanned
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-800 hover:bg-red-900"
                        }`}
                      >
                        {userItem.isBanned ? "Desbanear" : "Banear"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

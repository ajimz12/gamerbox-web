import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Intentar obtener datos de admin - si no es admin, el backend devolverá 403
        const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers });
        
        if (statsResponse.status === 403) {
          setError('No tienes permisos de administrador');
          setLoading(false);
          return;
        }

        const statsData = await statsResponse.json();
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers });
        const usersData = await usersResponse.json();

        setStats(statsData.stats);
        setUsers(usersData.users);
      } catch (err) {
        setError('Error al cargar los datos del panel de administración');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.roles?.includes('ROLE_ADMIN')) {
      fetchAdminData();
    } else {
      setLoading(false);
      setError('Acceso no autorizado');
    }
  }, [user]);

  const handleBanUser = async (userId, isBanned) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/${isBanned ? 'unban' : 'ban'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isBanned: !isBanned }
            : user
        ));
      }
    } catch (err) {
      console.error('Error al cambiar el estado del usuario:', err);
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

  if (!user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex items-center justify-center">
        <div className="text-red-500">No tienes permisos para acceder al panel de administración</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C]">
          <h3 className="text-xl mb-2">Usuarios Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C]">
          <h3 className="text-xl mb-2">Reseñas Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">{stats?.totalReviews || 0}</p>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#2C2C2C]">
          <h3 className="text-xl mb-2">Listas Totales</h3>
          <p className="text-4xl font-bold text-[#3D5AFE]">{stats?.totalLists || 0}</p>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-[#1E1E1E] rounded-lg border border-[#2C2C2C] overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b border-[#2C2C2C]">Gestión de Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2C2C2C]">
              <tr>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Fecha de Registro</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-[#2C2C2C]">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded ${user.isBanned ? 'bg-red-500' : 'bg-green-500'}`}>
                      {user.isBanned ? 'Baneado' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBanUser(user.id, user.isBanned)}
                      className={`px-4 py-2 rounded ${
                        user.isBanned 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {user.isBanned ? 'Desbanear' : 'Banear'}
                    </button>
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
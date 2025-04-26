import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import UserCard from '../components/UserCard';

const Following = () => {
  const { username } = useParams();
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFollowing = async () => {
    try {
      setIsLoading(true);
      setError('');
      const userData = await getUserProfile(username);
      if (userData.following) {
        setFollowing(userData.following);
      }
    } catch (error) {
      setError('Error al cargar los usuarios seguidos. Por favor, inténtalo de nuevo más tarde.');
      console.error('Error al cargar los usuarios seguidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchFollowing();
    }
  }, [username, refreshKey]);

  const handleFollowUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Usuarios seguidos por @{username}
        </h1>
        {following.length === 0 ? (
          <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow-sm">
            Este usuario aún no sigue a nadie
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {following.map((followed) => (
              <UserCard 
                key={followed.id} 
                user={followed} 
                onFollowUpdate={handleFollowUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;
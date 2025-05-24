import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/api/profile';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Following = () => {
  const { username } = useParams();
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFollowing = useCallback(async () => {
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
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchFollowing();
    }
  }, [username, refreshKey, fetchFollowing]);

  const handleFollowUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#E0E0E0] mb-8">
          Usuarios seguidos por @{username}
        </h1>
        {following.length === 0 ? (
          <div className="text-center text-[#A0A0A0] bg-[#1E1E1E] p-8 rounded-lg shadow-sm border border-[#2C2C2C]">
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
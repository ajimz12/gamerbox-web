import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../services/api';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile(id);
        setUser(userData);
      } catch (error) {
        setError('Error al ver el perfil del usuario. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

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
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture 
              ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
              : '/profile_pictures/pfp.png'
            }
            alt={`${user.username}'s profile`}
            className="w-32 h-32 rounded-full object-cover mb-4"
            onError={(e) => {
              e.target.src = '/profile_pictures/pfp.png';
            }}
          />
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
        </div>

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="block w-full text-center px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-md"
          >
            Volver a Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
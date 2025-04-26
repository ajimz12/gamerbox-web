import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  
  // Asegúrate de que userData siempre tenga un valor válido
  const userData = user.follower || user.followed || user || {};

  const isCurrentUser = currentUser?.username === userData.username;
  const linkTo = isCurrentUser ? '/dashboard' : `/user/${userData.username}`;

  return (
    <Link to={linkTo} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={userData.profilePicture 
              ? `${import.meta.env.VITE_API_URL}${userData.profilePicture}`
              : "/profile_pictures/pfp.png"
            }
            alt={`${userData.username}'s profile`}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/profile_pictures/pfp.png";
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{userData.username || 'Usuario Desconocido'}</h3>
            {userData.location && (
              <p className="text-sm text-gray-600">{userData.location}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
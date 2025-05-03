import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  
  const userData = user.follower || user.followed || user || {};

  const isCurrentUser = currentUser?.username === userData.username;
  const linkTo = isCurrentUser ? '/dashboard' : `/user/${userData.username}`;

  return (
    <Link 
      to={linkTo} 
      className="block bg-[#1E1E1E] rounded-lg shadow-md hover:shadow-lg transition-shadow border border-[#2C2C2C] hover:bg-[#2C2C2C]"
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={userData.profilePicture 
              ? `${import.meta.env.VITE_API_URL}${userData.profilePicture}`
              : "/profile_pictures/pfp.png"
            }
            alt={`${userData.username}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#3D5AFE]"
            onError={(e) => {
              e.target.src = "/profile_pictures/pfp.png";
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-[#E0E0E0]">{userData.username || 'Usuario Desconocido'}</h3>
            {userData.location && (
              <p className="text-sm text-[#A0A0A0]">{userData.location}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
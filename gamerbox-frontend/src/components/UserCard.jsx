import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (currentUser?.id === user.id) {
      e.preventDefault();
      navigate('/dashboard');
    }
  };

  return (
    <Link
      to={`/user/${user.username}`}
      onClick={handleClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-6 flex flex-col items-center">
        <img
          src={user.profilePicture 
            ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
            : '/profile_pictures/pfp.png'
          }
          alt={`${user.username}'s profile`}
          className="w-24 h-24 rounded-full object-cover mb-4"
          onError={(e) => {
            e.target.src = '/profile_pictures/pfp.png';
          }}
        />
        <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
        {user.location && (
          <p className="text-sm text-gray-600 mt-1">{user.location}</p>
        )}
      </div>
    </Link>
  );
};

export default UserCard;
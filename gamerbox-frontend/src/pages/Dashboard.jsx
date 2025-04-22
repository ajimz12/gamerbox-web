import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tu Perfil</h1>
        <Link 
          to="/profile/edit" 
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md cursor-pointer"
        >
          Editar Perfil
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Nombre:</span> {user?.username}</p>
          {user?.profilePicture && (
            <div>
              <span className="font-medium">Profile Picture:</span>
              <img 
                src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                alt={`${user.username}'s profile`}
                className="w-24 h-24 rounded-full mt-2 object-cover"
                onError={(e) => {
                  e.target.src = '/profile_pictures/pfp.png';
                  console.error('Error loading profile picture');
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
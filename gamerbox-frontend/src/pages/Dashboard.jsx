import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Nombre:</span> {user?.username}</p>
          {user?.profilePicture && (
            <div>
              <span className="font-medium">Profile Picture:</span>
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-24 h-24 rounded-full mt-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
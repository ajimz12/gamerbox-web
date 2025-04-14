import React, { useEffect, useState } from 'react';
import { getMe } from '../services/api';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe();
        setUserData(data);
      } catch (error) {
        alert(error);
      }
    };
    
    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {userData.email}!</p>
      <p>Your ID: {userData.id}</p>
    </div>
  );
};

export default Dashboard;

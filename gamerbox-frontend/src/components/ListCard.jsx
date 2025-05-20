import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ListCard = ({ list }) => {
  const { user } = useAuth();
  
  if (!list || (!list.isPublic && (!user || user.id !== list.creator.id))) {
    return null;
  }

  return (
    <Link to={`/lists/${list.id}`} className="block">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-40">
          <div className="absolute inset-0 grid grid-cols-3 gap-1">
            {list.games && list.games.length > 0 ? (
              list.games.slice(0, 3).map((game) => (
                <img
                  key={game.rawgId}
                  src={game.backgroundImage}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/img/placeholder-game.jpg";
                  }}
                />
              ))
            ) : (
              <div className="col-span-3 bg-[#252525] flex items-center justify-center">
                <span className="text-[#808080]">Sin juegos</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/profile_pictures/${list.creator.profilePicture}`}
              alt={list.creator.username}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/profile_pictures/pfp.png";
              }}
            />
            <span className="text-[#A0A0A0] text-sm">@{list.creator.username}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-1">{list.title}</h3>
          <p className="text-[#808080] text-sm line-clamp-2">{list.description}</p>
          
          <div className="mt-3 text-sm text-[#A0A0A0]">
            {list.games ? list.games.length : 0} {list.games && list.games.length === 1 ? 'juego' : 'juegos'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCard;
import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ReviewItem = ({ review }) => {
  console.log(
    `${import.meta.env.VITE_API_URL}/uploads/${review.author.profilePicture}`
  );

  return (
    <div className="bg-[#252525] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/user/${review.author.username}`}
          className="flex items-center space-x-3 hover:text-[#3D5AFE]"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${
              review.author.profilePicture
            }`}
            alt={review.author.username}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/profile_pictures/pfp.png";
            }}
          />

          <span className="font-medium text-[#E0E0E0]">
            {review.author.username}
          </span>
        </Link>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className="w-5 h-5"
              color={index < review.rating ? "#ffc107" : "#e4e5e9"}
            />
          ))}
        </div>
      </div>

      <p className="text-[#A0A0A0] mb-4">{review.text}</p>

      <div className="text-sm text-[#808080]">
        {formatDistanceToNow(new Date(review.createdAt), {
          addSuffix: true,
          locale: es,
        })}
      </div>
    </div>
  );
};

export default ReviewItem;

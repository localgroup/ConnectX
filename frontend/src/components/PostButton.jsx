import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';



export default function PostButton ({ expanded, expandButton }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePostClick = () => {
    if (location.pathname !== '/home/') {
      // If not on home page, navigate to home and set URL parameter
      navigate('/home/?expand=true');
    } else {
      // If already on home page, just expand the textarea
      expandButton();
    }
  };

  return (
    <>
      <button 
        onClick={handlePostClick}
        className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200"
      >
        Post
      </button>
    </>
  );
}
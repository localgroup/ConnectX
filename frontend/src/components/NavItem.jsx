import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


export default function NavItem ({ Icon, text, to }) {
    return (
      <RouterLink to={to} className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-full">
        <Icon className="h-7 w-7" />
        <span className="text-xl hidden xl:inline">{text}</span>
      </RouterLink>
    );
  }




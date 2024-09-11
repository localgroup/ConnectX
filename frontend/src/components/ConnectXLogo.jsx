import React from 'react';
import { Brackets, X } from 'lucide-react';


export default function ConnectXLogo() {
  return (
    <div className="relative w-12 h-12">
      <Brackets className="w-12 h-12 text-primary absolute" />
      <X className="w-10 h-10 text-primary absolute top-1 left-1" />
    </div>
  );
}
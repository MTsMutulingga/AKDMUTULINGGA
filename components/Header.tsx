
import React from 'react';
import { BookIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <BookIcon />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-blue-700">AKD</h1>
            <p className="text-sm text-slate-500 hidden md:block">Asisten Kurikulum Digital</p>
          </div>
        </div>
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          Powered by Gemini
        </a>
      </div>
    </header>
  );
};

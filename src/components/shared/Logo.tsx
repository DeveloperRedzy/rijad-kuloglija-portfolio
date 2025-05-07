import React from 'react';
import { Link } from 'react-scroll';

const Logo: React.FC = () => {
  return (
    <Link
      to="hero"
      smooth={true}
      duration={500}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <img src="/logo.svg" alt="Redzy Logo" className="w-8 h-8" />
      <span className="font-bold text-lg text-slate-800 dark:text-white">
        Redzy<span className="text-primary-600 dark:text-primary-400">.dev</span>
      </span>
    </Link>
  );
};

export default Logo;
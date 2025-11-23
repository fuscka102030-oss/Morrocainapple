import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getLinkClass = (category?: string) => {
    const isActive = category ? currentCategory === category : !currentCategory;
    return `text-sm font-medium transition-colors ${
      isActive 
        ? 'text-black dark:text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
    }`;
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer gap-2" onClick={() => navigate('/')}>
            <svg className="w-5 h-5 text-gray-900 dark:text-white mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.55-.83.96-1.98.81-3.12-1.03.09-2.26.69-2.98 1.53-.63.74-1.17 1.91-.95 2.99 1.13.09 2.52-.48 3.12-1.4z" />
            </svg>
            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Moroccan Apple</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={getLinkClass()}>Store</Link>
            <Link to="/?category=MacBook" className={getLinkClass('MacBook')}>Mac</Link>
            <Link to="/?category=iPad" className={getLinkClass('iPad')}>iPad</Link>
            <Link to="/?category=iPhone" className={getLinkClass('iPhone')}>iPhone</Link>
            <Link to="/?category=Watch" className={getLinkClass('Watch')}>Watch</Link>
            <Link to="/?category=AirPods" className={getLinkClass('AirPods')}>AirPods</Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
               {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
              <User className="h-5 w-5" />
            </button>
            <div className="relative cursor-pointer" onClick={() => alert('Panier simplifié: Voir console pour détails')}>
               <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition" />
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                   {cartCount}
                 </span>
               )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
               {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Store</Link>
            <Link to="/?category=MacBook" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Mac</Link>
            <Link to="/?category=iPad" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">iPad</Link>
            <Link to="/?category=iPhone" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">iPhone</Link>
            <Link to="/?category=Watch" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Watch</Link>
            <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Espace Pro / Admin</Link>
          </div>
        </div>
      )}
    </nav>
  );
};
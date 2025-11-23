import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isReseller?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isReseller = false }) => {
  const displayPrice = isReseller ? product.price * 0.8 : product.price;

  return (
    <div className="group relative bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-50 dark:bg-black/40 h-64 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Quick Add Overlay (Optional visual cue) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link to={`/product/${product.id}`} className="bg-white/90 dark:bg-white text-black px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-all">
              Voir les détails
            </Link>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">{product.category}</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight leading-tight">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 font-light leading-relaxed">{product.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               {isReseller && (
                 <span className="text-xs text-gray-400 line-through mb-0.5">
                   {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(product.price)}
                 </span>
               )}
               <span className="text-lg font-bold text-gray-900 dark:text-white">
                 {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(displayPrice)}
               </span>
               {!isReseller && (
                 <span className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
                   ou {Math.round(displayPrice / 3)} MAD/mois
                 </span>
               )}
            </div>
            
            {/* Action Button - Visual Only since entire card is link, but kept for style */}
            <div className="bg-blue-600 dark:bg-white text-white dark:text-black p-2 rounded-full shadow-lg shadow-blue-200 dark:shadow-none group-hover:bg-blue-700 dark:group-hover:bg-gray-200 transition-colors">
                <Plus className="w-5 h-5" />
            </div>
          </div>
          {isReseller && (
            <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span> Prix Revendeur (-20%)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
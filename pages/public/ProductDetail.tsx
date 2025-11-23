import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Truck, ShieldCheck, Cpu, ArrowLeft } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart } = useApp();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">Retour au store</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <Navbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Gallery */}
          <div className="relative mb-10 lg:mb-0">
            <div className="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-center object-contain p-8 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
              <p className="text-3xl tracking-tight text-gray-900 dark:text-white font-semibold">
                {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(product.price)}
              </p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {product.stock > 0 ? 'En Stock' : 'Rupture'}
              </span>
            </div>

            <div className="prose prose-lg text-gray-500 dark:text-gray-300 mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Caractéristiques</h3>
              <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-6">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                    <Cpu className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center rounded-full border border-transparent px-8 py-4 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg ${
                  isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
                } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAdded ? 'Ajouté au panier' : 'Ajouter au panier'}
              </button>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors">
                  <Truck className="w-6 h-6 text-gray-400 dark:text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Livraison Gratuite</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors">
                  <ShieldCheck className="w-6 h-6 text-gray-400 dark:text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Garantie 2 Ans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
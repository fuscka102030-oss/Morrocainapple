import React from 'react';
import { Navbar } from '../../components/Navbar';
import { ProductCard } from '../../components/ProductCard';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Home: React.FC = () => {
  const { products, heroContent } = useApp();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  // Filter products based on category param
  const filteredProducts = category
    ? products.filter(p => p.category === category)
    : products;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section - Only show on main Store page (no category selected) */}
      {!category && (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black overflow-hidden group">
          {/* Dynamic Image Background with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60"
            style={{ backgroundImage: `url('${heroContent.imageUrl}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md font-light">
              {heroContent.description}
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30">
                {heroContent.ctaText}
              </button>
              <button className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-all">
                En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${category ? 'pt-32 pb-24' : 'py-24'}`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            {category ? category : "Le meilleur d'Apple."}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            {category 
              ? `Découvrez notre gamme ${category} disponible au Maroc.`
              : 'Découvrez notre catalogue complet disponible au Maroc.'
            }
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">Aucun produit trouvé dans cette catégorie.</p>
            <button onClick={() => window.location.href = '/'} className="mt-4 text-blue-600 hover:underline">
              Retour au Store
            </button>
          </div>
        )}
      </section>

      {/* Finance Banner */}
      <section className="bg-gray-100 dark:bg-[#1c1c1e] py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Facilités de paiement</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">Profitez de 0% d'intérêt sur 3 mois pour tout achat supérieur à 5000 MAD. Offre soumise à conditions.</p>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Partenaires Bancaires Marocains</span>
        </div>
      </section>
      
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 text-sm text-center border-t border-gray-800 dark:border-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-8">
            <span className="cursor-pointer hover:text-white transition">Confidentialité</span>
            <span className="cursor-pointer hover:text-white transition">Conditions de vente</span>
            <span className="cursor-pointer hover:text-white transition">Mentions Légales</span>
          </div>
          <p>&copy; 2023 Moroccan Apple. Projet de démonstration Front-end.</p>
        </div>
      </footer>
    </div>
  );
};
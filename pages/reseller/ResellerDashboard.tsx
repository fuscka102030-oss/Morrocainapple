import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/ProductCard';
import { ShoppingCart, Package, LogOut, TrendingUp, Home, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

export const ResellerDashboard: React.FC = () => {
  const { products, currentUser, orders, logout, placeOrder, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  
  // Bulk Order State (Local to Reseller Dashboard for simplicity)
  const [bulkCart, setBulkCart] = useState<{productId: string, qty: number}[]>([]);

  if (!currentUser || currentUser.role !== UserRole.RESELLER) {
     navigate('/login');
     return null;
  }

  const resellerOrders = orders.filter(o => o.userId === currentUser.id);

  const addToBulkCart = (productId: string) => {
      setBulkCart(prev => {
          const exists = prev.find(p => p.productId === productId);
          if (exists) return prev.map(p => p.productId === productId ? {...p, qty: p.qty + 1} : p);
          return [...prev, {productId, qty: 1}];
      });
  };

  const updateBulkQty = (productId: string, qty: number) => {
      if (qty <= 0) {
          setBulkCart(prev => prev.filter(p => p.productId !== productId));
      } else {
          setBulkCart(prev => prev.map(p => p.productId === productId ? {...p, qty} : p));
      }
  };

  const submitOrder = () => {
      if (bulkCart.length > 0) {
          placeOrder(currentUser.id, currentUser.name, bulkCart);
          setBulkCart([]);
          alert('Commande transmise avec succès !');
          setActiveTab('history');
      }
  };

  // Calculate total based on discounted prices
  const cartTotal = bulkCart.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.productId);
      return acc + ((prod ? prod.price * 0.8 : 0) * item.qty);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-[#1c1c1e] shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="bg-blue-600 text-white p-2 rounded-lg mr-3 shadow-lg shadow-blue-500/30"><Package className="w-6 h-6"/></span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Espace Revendeur</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bienvenue, {currentUser.name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg text-center hidden sm:block border border-blue-100 dark:border-blue-800">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Taux de Remise</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">-20%</span>
                    </div>
                    <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2e] transition-colors">
                        {theme === 'light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                    </button>
                    <button onClick={() => navigate('/')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2e] transition-colors" title="Retour au site">
                        <Home className="w-5 h-5" />
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-gray-500 dark:text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2e] transition-colors" title="Déconnexion">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Performance</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Achat</span>
                        <span className="font-bold text-gray-900 dark:text-white">{currentUser.totalPurchases?.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Commandes</span>
                        <span className="font-bold text-gray-900 dark:text-white">{resellerOrders.length}</span>
                    </div>
                </div>

                <nav className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                    <button onClick={() => setActiveTab('catalog')} className={`w-full text-left px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors ${activeTab === 'catalog' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-700 dark:border-blue-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        <Package className="w-5 h-5 mr-3" /> Catalogue Pro
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`w-full text-left px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors ${activeTab === 'history' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-700 dark:border-blue-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        <TrendingUp className="w-5 h-5 mr-3" /> Historique
                    </button>
                </nav>

                {/* Quick Cart */}
                {activeTab === 'catalog' && bulkCart.length > 0 && (
                    <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/50 sticky top-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center"><ShoppingCart className="w-4 h-4 mr-2"/> Commande en cours</h3>
                        <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {bulkCart.map(item => {
                                const prod = products.find(p => p.id === item.productId);
                                return (
                                    <li key={item.productId} className="flex justify-between items-center text-sm">
                                        <span className="truncate w-24 text-gray-700 dark:text-gray-300">{prod?.name}</span>
                                        <div className="flex items-center bg-gray-100 dark:bg-[#2c2c2e] rounded-lg p-0.5">
                                            <button className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1c1c1e] rounded text-xs transition" onClick={() => updateBulkQty(item.productId, item.qty - 1)}>-</button>
                                            <span className="mx-2 font-bold text-gray-900 dark:text-white">{item.qty}</span>
                                            <button className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1c1c1e] rounded text-xs transition" onClick={() => updateBulkQty(item.productId, item.qty + 1)}>+</button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>{cartTotal.toLocaleString()} MAD</span>
                            </div>
                        </div>
                        <button onClick={submitOrder} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-500/30">
                            Valider la commande
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {activeTab === 'catalog' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {products.map(product => (
                            <div key={product.id} className="relative">
                                <ProductCard product={product} isReseller={true} />
                                <button 
                                    onClick={() => addToBulkCart(product.id)}
                                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-10 group"
                                    title="Ajouter au panier revendeur"
                                >
                                    <PlusIcon className="group-active:scale-90 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4 animate-fade-in">
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vos commandes récentes</h2>
                         {resellerOrders.length === 0 ? (
                             <div className="text-center py-12 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">Aucune commande pour le moment.</div>
                         ) : (
                             resellerOrders.map(order => (
                                 <div key={order.id} className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                     <div className="flex flex-col sm:flex-row justify-between mb-4">
                                         <div>
                                             <span className="font-mono text-xs text-gray-400 uppercase tracking-wide">Réf: {order.id}</span>
                                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(order.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                         </div>
                                         <div className="mt-2 sm:mt-0">
                                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                 order.status === 'Livrée' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                                 order.status === 'En Cours' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                             }`}>
                                                 {order.status}
                                             </span>
                                         </div>
                                     </div>
                                     <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                         {order.items.map((item, idx) => (
                                             <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2 last:mb-0">
                                                 <span><span className="font-bold">{item.quantity}x</span> {item.productName}</span>
                                                 <span>{(item.unitPrice * item.quantity).toLocaleString()} MAD</span>
                                             </div>
                                         ))}
                                         <div className="text-right font-bold text-lg mt-4 text-gray-900 dark:text-white pt-2 border-t border-gray-50 dark:border-gray-800 border-dashed">
                                             Total: {order.totalAmount.toLocaleString()} MAD
                                         </div>
                                     </div>
                                 </div>
                             ))
                         )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
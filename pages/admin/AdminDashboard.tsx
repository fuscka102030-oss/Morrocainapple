
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, ShoppingCart, Trash2, Edit, Plus, LogOut, AlertCircle, X, Image as ImageIcon, Globe, LayoutTemplate, Sun, Moon, Shield, Link as LinkIcon, Download, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderStatus, Product, UserRole, HeroContent, User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { products, orders, users, logout, deleteProduct, addProduct, updateProduct, updateOrderStatus, addUser, deleteUser, toggleUserStatus, currentUser, heroContent, updateHeroContent, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'accounts' | 'site'>('overview');
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initial Product Form State
  const initialFormState: Partial<Product> = { 
    name: '', 
    category: 'iPhone', 
    price: 0, 
    purchasePrice: 0, 
    stock: 0, 
    description: '', 
    image: '',
    specs: [] 
  };
  
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  // Account Form State
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [newUser, setNewUser] = useState<{ 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
  }>({ 
    name: '', 
    email: '', 
    password: '', 
    role: UserRole.RESELLER 
  });

  // Hero Form State
  const [heroForm, setHeroForm] = useState<HeroContent>(heroContent);

  useEffect(() => {
    setHeroForm(heroContent);
  }, [heroContent]);

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
     navigate('/login');
     return null;
  }

  // --- Logic Helpers ---

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ ...product });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert("Veuillez remplir les informations essentielles et ajouter une image.");
      return;
    }

    const productData = {
        name: formData.name,
        category: formData.category as any,
        description: formData.description || '',
        price: Number(formData.price),
        purchasePrice: Number(formData.purchasePrice || 0),
        stock: Number(formData.stock || 0),
        image: formData.image,
        specs: formData.specs && formData.specs.length > 0 ? formData.specs : ['High Tech', 'Premium', 'Apple']
    };

    if (editingId) {
      updateProduct({ ...productData, id: editingId, specs: formData.specs || [] } as Product);
    } else {
      addProduct(productData);
    }
    handleCloseModal();
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent(heroForm);
    alert('Bannière mise à jour avec succès !');
  };

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      if(newUser.name && newUser.email && newUser.password) {
          addUser(newUser);
          setShowAccountForm(false);
          setNewUser({ name: '', email: '', password: '', role: UserRole.RESELLER });
      }
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(products, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  // Stats Calculation
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  const salesData = products.map(p => {
      const sales = orders.reduce((acc, order) => {
          const item = order.items.find(i => i.productId === p.id);
          return acc + (item ? item.quantity : 0);
      }, 0);
      return { name: p.name.substring(0, 10) + '...', sales: sales };
  }).sort((a, b) => b.sales - a.sales).slice(0, 5);

  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center px-6 py-3.5 text-sm font-medium transition-colors ${activeTab === id ? 'bg-gray-100 dark:bg-[#1c1c1e] text-black dark:text-white border-r-2 border-black dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1c1c1e] hover:text-gray-900 dark:hover:text-white'}`}
    >
      <Icon className="w-5 h-5 mr-3" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
             <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center mr-2">A</span>
             Admin
          </h1>
          <button onClick={toggleTheme} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             {theme === 'light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
          </button>
        </div>
        <nav className="mt-4 flex-1">
          <NavButton id="overview" icon={BarChart} label="Vue d'ensemble" />
          <NavButton id="products" icon={Package} label="Produits" />
          <NavButton id="orders" icon={ShoppingCart} label="Commandes" />
          <NavButton id="accounts" icon={Users} label="Comptes" />
          <NavButton id="site" icon={LayoutTemplate} label="Gestion Site" />
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <button onClick={() => navigate('/')} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium w-full px-2 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-[#1c1c1e] transition-colors">
                <Globe className="w-4 h-4 mr-2"/> Site Public
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium w-full px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="w-4 h-4 mr-2"/> Déconnexion
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Aperçu de votre activité commerciale.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-green-500 text-xs font-bold">+12.5%</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Chiffre d'affaires</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(totalRevenue)}</p>
              </div>
              
              <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-purple-500 text-xs font-bold">Actif</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Commandes Totales</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{orders.length}</p>
              </div>

              <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-red-500 text-xs font-bold">Attention</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Stock Faible</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{lowStockProducts.length} <span className="text-lg text-gray-400 font-normal">produits</span></p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance des ventes</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2c2c2e' : '#f0f0f0'} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: theme === 'dark' ? '#2c2c2e' : '#f3f4f6'}} 
                              contentStyle={{
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                                backgroundColor: theme === 'dark' ? '#2c2c2e' : '#fff',
                                color: theme === 'dark' ? '#fff' : '#000'
                              }} 
                            />
                            <Bar dataKey="sales" fill={theme === 'dark' ? '#ffffff' : '#1d1d1f'} radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
            <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produits</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gérez votre catalogue et vos stocks.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowExportModal(true)} 
                            className="bg-gray-100 dark:bg-[#1c1c1e] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full text-sm font-medium flex items-center hover:bg-gray-200 dark:hover:bg-[#2c2c2e] transition shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-2" /> Exporter JSON
                        </button>
                        <button 
                            onClick={() => handleOpenModal()} 
                            className="bg-black dark:bg-white dark:text-black text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Nouveau Produit
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1e] shadow-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-[#2c2c2e]">
                            <tr>
                                <th className="p-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produit</th>
                                <th className="p-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
                                <th className="p-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix Public</th>
                                <th className="p-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                <th className="p-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-[#2c2c2e] transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-black overflow-hidden mr-4 border border-gray-200 dark:border-gray-800">
                                                <img src={p.image} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#2c2c2e] text-gray-800 dark:text-gray-200">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(p.price)}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <span className={`text-sm font-medium ${p.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{p.stock} unités</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenModal(p)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4"/>
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(p.id)} 
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
             <div className="animate-fade-in">
                 <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gestion Commandes</h2>
                 <div className="space-y-4">
                     {orders.map(order => (
                         <div key={order.id} className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                 <div>
                                     <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{order.id}</h3>
                                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-[#2c2c2e] px-2 py-0.5 rounded">{new Date(order.date).toLocaleDateString()}</span>
                                     </div>
                                     <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                         <Users className="w-4 h-4 mr-1"/> {order.userName}
                                     </p>
                                 </div>
                                 <div className="mt-4 md:mt-0">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        className={`border-0 cursor-pointer text-sm font-bold px-4 py-2 rounded-full appearance-none pr-8 relative ${
                                            order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                                            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 
                                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}
                                        style={{backgroundImage: 'none'}}
                                     >
                                         {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                     </select>
                                 </div>
                             </div>
                             <div className="bg-gray-50 dark:bg-[#2c2c2e] rounded-xl p-4">
                                 {order.items.map((item, idx) => (
                                     <div key={idx} className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300 last:mb-0">
                                         <span className="font-medium">{item.quantity}x <span className="text-gray-500 dark:text-gray-400 font-normal">{item.productName}</span></span>
                                         <span>{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(item.total)}</span>
                                     </div>
                                 ))}
                                 <div className="border-t border-gray-200 dark:border-gray-600 mt-3 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                     <span>Total</span>
                                     <span>{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(order.totalAmount)}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                     {orders.length === 0 && <p className="text-gray-500 text-center py-8">Aucune commande pour le moment.</p>}
                 </div>
             </div>
        )}

        {activeTab === 'accounts' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Comptes</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Administrateurs et Revendeurs.</p>
                    </div>
                    <button onClick={() => setShowAccountForm(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center hover:bg-purple-700 shadow-lg shadow-purple-200 transition">
                        <Plus className="w-4 h-4 mr-2" /> Créer un compte
                    </button>
                </div>

                {showAccountForm && (
                     <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-800 mb-8 transform transition-all">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4">Nouvel Utilisateur</h4>
                        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nom</label>
                                <input className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e] p-3 rounded-lg mt-1 focus:ring-purple-500 focus:border-purple-500 text-black dark:text-white" placeholder="Nom complet" onChange={e => setNewUser({...newUser, name: e.target.value})} required/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
                                <input type="email" className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e] p-3 rounded-lg mt-1 focus:ring-purple-500 focus:border-purple-500 text-black dark:text-white" placeholder="email@domaine.com" onChange={e => setNewUser({...newUser, email: e.target.value})} required/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mot de passe</label>
                                <input type="password" className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e] p-3 rounded-lg mt-1 focus:ring-purple-500 focus:border-purple-500 text-black dark:text-white" placeholder="••••••••" onChange={e => setNewUser({...newUser, password: e.target.value})} required/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rôle</label>
                                <select 
                                    className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e] p-3 rounded-lg mt-1 focus:ring-purple-500 focus:border-purple-500 text-black dark:text-white"
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                    value={newUser.role}
                                >
                                    <option value={UserRole.RESELLER}>Revendeur</option>
                                    <option value={UserRole.ADMIN}>Administrateur</option>
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
                                <button type="button" onClick={() => setShowAccountForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-200 font-medium">Annuler</button>
                                <button type="submit" className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-medium">Créer le compte</button>
                            </div>
                        </form>
                     </div>
                )}

                <div className="grid gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                                <div className={`p-4 rounded-2xl mr-4 ${user.role === UserRole.ADMIN ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'}`}>
                                    {user.role === UserRole.ADMIN ? <Shield className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                                        {user.name}
                                        {currentUser.id === user.id && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">(Vous)</span>}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex w-full md:w-auto justify-between md:justify-end gap-8 items-center">
                                {user.role === UserRole.RESELLER && (
                                    <>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Remise</p>
                                            <p className="font-bold text-green-600 text-lg">20%</p>
                                        </div>
                                        <div className="text-right border-l pl-8 border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Vol. Achat</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(user.totalPurchases || 0)}</p>
                                        </div>
                                    </>
                                )}
                                
                                <div className="ml-4 flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                                        {user.role === UserRole.ADMIN ? 'Admin' : (user.isActive ? 'Actif' : 'Bloqué')}
                                    </span>
                                    {/* Prevent deleting yourself */}
                                    {currentUser.id !== user.id && (
                                        <button 
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Supprimer le compte"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'site' && (
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                  <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion du Site</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Personnalisez la bannière principale (Hero Section).</p>
                  </div>
              </div>

              <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 max-w-4xl">
                  <form onSubmit={handleSaveHero} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Contenu Textuel</h4>
                          <div className="space-y-6">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Titre Principal</label>
                                  <input 
                                      type="text" 
                                      value={heroForm.title}
                                      onChange={e => setHeroForm({...heroForm, title: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-bold text-lg"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description / Sous-titre</label>
                                  <textarea 
                                      rows={3}
                                      value={heroForm.description}
                                      onChange={e => setHeroForm({...heroForm, description: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white resize-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texte du Bouton (CTA)</label>
                                  <input 
                                      type="text" 
                                      value={heroForm.ctaText}
                                      onChange={e => setHeroForm({...heroForm, ctaText: e.target.value})}
                                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-medium"
                                  />
                              </div>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Image de Fond</h4>
                          <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lien Image (URL)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={heroForm.imageUrl}
                                        onChange={e => setHeroForm({...heroForm, imageUrl: e.target.value})}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://exemple.com/image.jpg"
                                    />
                                </div>
                              </div>

                              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e]">
                                  {heroForm.imageUrl ? (
                                      <img src={heroForm.imageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                          <ImageIcon className="w-8 h-8 mb-2" />
                                          <p className="text-sm">Aperçu de l'image</p>
                                      </div>
                                  )}
                              </div>
                              <p className="text-xs text-gray-400 text-center">Collez l'URL d'une image hébergée.</p>
                          </div>
                          
                          <div className="mt-8 flex justify-end">
                              <button 
                                  type="submit"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex justify-center items-center"
                              >
                                  Enregistrer les modifications
                              </button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
        )}

        {/* Modal for Export JSON */}
        {showExportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setShowExportModal(false)}
            ></div>
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] border border-gray-200 dark:border-gray-700">
               <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                   <div>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exportation des Données</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sauvegarde manuelle pour déploiement.</p>
                   </div>
                   <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-black dark:hover:text-white"><X className="w-6 h-6"/></button>
               </div>
               <div className="p-8 overflow-y-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
                     <h4 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-2 flex items-center"><AlertCircle className="w-4 h-4 mr-2"/> Important - Déploiement Manuel</h4>
                     <p className="text-blue-700 dark:text-blue-400 text-sm leading-relaxed">
                        Puisque ce site est statique (sans base de données serveur), vos changements sont actuellement stockés uniquement dans votre navigateur.
                        <br/><br/>
                        Pour rendre ces changements <strong>permanents pour tout le monde</strong> :
                        <ol className="list-decimal ml-5 mt-2 space-y-1">
                          <li>Copiez le code JSON ci-dessous.</li>
                          <li>Ouvrez le fichier <code>constants.ts</code> dans votre code source.</li>
                          <li>Remplacez le contenu de la variable <code>INITIAL_PRODUCTS</code> par ce code.</li>
                          <li>Redéployez votre site (commit & push).</li>
                        </ol>
                     </p>
                  </div>

                  <div className="relative">
                    <pre className="bg-gray-100 dark:bg-[#2c2c2e] text-gray-800 dark:text-gray-200 p-4 rounded-xl text-xs font-mono overflow-auto h-64 border border-gray-200 dark:border-gray-700 custom-scrollbar">
                        {JSON.stringify(products, null, 2)}
                    </pre>
                    <button 
                      onClick={handleCopyJSON}
                      className="absolute top-4 right-4 bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {copySuccess ? <Check className="w-3 h-3 mr-1 text-green-500"/> : <Copy className="w-3 h-3 mr-1"/>}
                      {copySuccess ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
               </div>
               <div className="px-8 py-5 bg-gray-50 dark:bg-[#2c2c2e] border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <button onClick={() => setShowExportModal(false)} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Fermer</button>
               </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Product */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div 
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                    onClick={handleCloseModal}
                ></div>
                <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-[#1c1c1e] sticky top-0 z-20">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {editingId ? 'Modifier le produit' : 'Nouveau produit'}
                        </h3>
                        <button 
                            onClick={handleCloseModal}
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <form id="productForm" onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            
                            {/* Left Col: Image Upload */}
                            <div className="lg:col-span-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">Lien Image (URL)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={e => setFormData({...formData, image: e.target.value})}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="https://exemple.com/produit.jpg"
                                        />
                                    </div>
                                </div>

                                <div className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2c2c2e]`}>
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center mb-3">
                                                <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aperçu Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Col: Details */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du modèle</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-medium placeholder-gray-400"
                                        placeholder="Ex: iPhone 15 Pro Max"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catégorie</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.category}
                                                onChange={e => setFormData({...formData, category: e.target.value as any})}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all appearance-none text-gray-900 dark:text-white font-medium"
                                            >
                                                <option value="iPhone">iPhone</option>
                                                <option value="MacBook">MacBook</option>
                                                <option value="iPad">iPad</option>
                                                <option value="Watch">Apple Watch</option>
                                                <option value="AirPods">AirPods</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock Disponible</label>
                                        <input 
                                            type="number" 
                                            value={formData.stock}
                                            onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-medium"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix Public (MAD)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={formData.price}
                                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-bold"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-4 top-3 text-gray-400 font-medium text-sm">DHS</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix Achat (MAD)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={formData.purchasePrice || ''}
                                                onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})}
                                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white font-medium"
                                                placeholder="Optionnel"
                                            />
                                            <span className="absolute right-4 top-3 text-gray-400 font-medium text-sm">DHS</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea 
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 transition-all text-gray-900 dark:text-white text-sm resize-none"
                                        placeholder="Décrivez les caractéristiques principales du produit..."
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 bg-gray-50 dark:bg-[#2c2c2e] border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={handleCloseModal}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            form="productForm"
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all transform active:scale-95"
                        >
                            {editingId ? 'Mettre à jour' : 'Enregistrer le produit'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

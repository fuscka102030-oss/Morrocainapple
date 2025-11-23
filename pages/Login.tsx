import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = login(email, password);
    if (user) {
      if (user.role === UserRole.ADMIN) navigate('/admin');
      else if (user.role === UserRole.RESELLER) navigate('/reseller');
      else navigate('/');
    } else {
      setError('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-300">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour au site
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Portail Accès</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Espace sécurisé pour administrateurs et revendeurs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1c1c1e] py-8 px-4 shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 sm:rounded-2xl sm:px-10 transition-colors duration-300">
          {error && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
               {error}
             </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white sm:text-sm transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
              >
                Connexion
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
                Problème de connexion ? Contactez le support IT.
            </p>
        </div>
      </div>
    </div>
  );
};
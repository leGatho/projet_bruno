import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

function LoginPage() {
  // États pour stocker les informations de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Utilisation du contexte d'authentification
  const { login, loading } = useAuth();
  
  // Hook de navigation pour rediriger l'utilisateur
  const navigate = useNavigate();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      // Appel à notre fonction de connexion du contexte
      const { success, error: loginError } = await login(email, password);
      
      if (!success) {
        throw loginError;
      }
      
      // Si la connexion a réussi, rediriger vers la page de jeu
      navigate('/game');
      
    } catch (err) {
      console.error('Erreur de connexion:', err);
      
      // Messages d'erreur plus spécifiques selon l'erreur
      if (err.message?.includes('Invalid login')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Une erreur est survenue lors de la connexion: ' + (err.message || 'Erreur inconnue'));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Connexion</h1>
          <p className="mt-2 text-gray-600">Connectez-vous pour jouer à trouver Bruno</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center">
          <p className="mt-2">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 
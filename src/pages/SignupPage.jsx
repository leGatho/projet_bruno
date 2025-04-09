import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

function SignupPage() {
  // États pour stocker les informations d'inscription
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Utilisation du contexte d'authentification
  const { signup, loading } = useAuth();
  
  // Hook de navigation pour rediriger l'utilisateur
  const navigate = useNavigate();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!email || !password || !confirmPassword || !pseudo) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      // Appel à notre fonction d'inscription du contexte
      const { success, error: signupError } = await signup(email, password);
      
      if (!success) {
        throw signupError;
      }
      
      // Afficher le message de succès
      setSuccess(true);
      
      // Dans un cas réel, vous pourriez stocker les métadonnées comme le pseudo
      // dans une table dédiée ou utiliser les metadonnées de l'utilisateur
      
      // Rediriger vers login après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      
      // Messages d'erreur plus spécifiques selon l'erreur
      if (err.message?.includes('email')) {
        setError('Cet email est déjà utilisé ou n\'est pas valide');
      } else if (err.message?.includes('password')) {
        setError('Mot de passe invalide');
      } else {
        setError('Une erreur est survenue lors de l\'inscription: ' + (err.message || 'Erreur inconnue'));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Inscription</h1>
          <p className="mt-2 text-gray-600">Créez un compte pour jouer à trouver Bruno</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
            Inscription réussie ! Vous allez être redirigé vers la page de connexion...
          </div>
        )}
        
        {!success && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700">
                Pseudo
              </label>
              <input
                id="pseudo"
                name="pseudo"
                type="text"
                required
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre pseudo"
              />
            </div>
            
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </div>
          </form>
        )}
        
        <div className="text-sm text-center">
          <p className="mt-2">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage; 
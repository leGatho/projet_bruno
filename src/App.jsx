import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { AuthProvider, useAuth } from './lib/AuthContext'

// Composant de route protégée qui redirige vers la connexion si non authentifié
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Composant de navigation avec gestion de l'état d'authentification
function Navigation() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // La redirection sera gérée automatiquement par les routes protégées
  };
  
  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/game">Jeu</Link></li>
        {user ? (
          <>
            <li className="ml-auto">
              <span className="text-white">Bonjour, {user.email}</span>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/signup">Inscription</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/game" 
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

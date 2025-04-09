import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, signUpUser, logoutUser } from './supabaseClient';

// Création du contexte d'authentification
const AuthContext = createContext(null);

/**
 * Fournisseur du contexte d'authentification
 * Ce composant enveloppe l'application et fournit l'état d'authentification à tous les composants enfants
 */
export function AuthProvider({ children }) {
  // État pour stocker l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État pour suivre si l'authentification est en cours de chargement
  const [loading, setLoading] = useState(true);

  // Vérifier si un utilisateur est déjà connecté lors du chargement de l'application
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Récupérer l'utilisateur actuel depuis Supabase
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  /**
   * Fonction pour connecter un utilisateur
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await loginUser(email, password);
      
      if (error) throw error;
      
      if (data && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      
      return { success: false, error: new Error('Utilisateur non trouvé') };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour inscrire un utilisateur
   */
  const signup = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signUpUser(email, password);
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction pour déconnecter l'utilisateur
   */
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await logoutUser();
      
      if (error) throw error;
      
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Valeur du contexte à fournir aux composants enfants
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * Exemple d'utilisation: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}

export default AuthContext; 
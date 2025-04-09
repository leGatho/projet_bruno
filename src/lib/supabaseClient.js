// Importation de la bibliothèque Supabase
import { createClient } from '@supabase/supabase-js';

// URL et clé d'API de ton projet Supabase
const supabaseUrl = 'https://qctluskkvfjjnghcwpgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdGx1c2trdmZqam5naGN3cGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzczMTksImV4cCI6MjA1OTYxMzMxOX0.Ag57Ezup2obz3miH30qYMKmSPdt_4I0douuwgdqW3m8';

// Création de l'instance Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fonction pour inscrire un nouvel utilisateur
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise} - Une promesse avec le résultat de l'inscription
 */
export const signUpUser = async (email, password) => {
  try {
    // Appel à l'API Supabase pour créer un nouvel utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // Si une erreur survient, on la lance pour qu'elle soit attrapée par le composant
    if (error) throw error;

    // Retour des données en cas de succès
    return { data, error: null };
  } catch (error) {
    // En cas d'erreur, on la retourne pour traitement par le composant
    console.error('Erreur lors de l\'inscription:', error.message);
    return { data: null, error };
  }
};

/**
 * Fonction pour connecter un utilisateur existant
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise} - Une promesse avec le résultat de la connexion
 */
export const loginUser = async (email, password) => {
  try {
    // Appel à l'API Supabase pour connecter l'utilisateur
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Si une erreur survient, on la lance pour qu'elle soit attrapée par le composant
    if (error) throw error;

    // Retour des données en cas de succès
    return { data, error: null };
  } catch (error) {
    // En cas d'erreur, on la retourne pour traitement par le composant
    console.error('Erreur lors de la connexion:', error.message);
    return { data: null, error };
  }
};

/**
 * Fonction pour déconnecter l'utilisateur
 * @returns {Promise} - Une promesse avec le résultat de la déconnexion
 */
export const logoutUser = async () => {
  try {
    // Appel à l'API Supabase pour déconnecter l'utilisateur
    const { error } = await supabase.auth.signOut();
    
    // Si une erreur survient, on la lance
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error.message);
    return { error };
  }
};

/**
 * Fonction pour récupérer l'utilisateur actuellement connecté
 * @returns {Object} - L'utilisateur actuel ou null
 */
export const getCurrentUser = async () => {
  try {
    // Récupère la session active actuelle
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return data.session ? data.session.user : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
    return null;
  }
};

// Export de l'instance Supabase pour une utilisation directe si nécessaire
export default supabase; 
import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gameImage from '../assets/game/game-image.jpg';
import brunoImage from '../assets/game/bruno.svg';

function GamePage() {
  // État pour stocker les coordonnées du dernier clic
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
  // État pour savoir si le personnage a été trouvé
  const [characterFound, setCharacterFound] = useState(false);
  // État pour afficher ou masquer la zone invisible (pour le développement)
  const [showHiddenZone, setShowHiddenZone] = useState(false);
  // État pour stocker la zone cachée (position aléatoire)
  const [hiddenZone, setHiddenZone] = useState(null);

  // Fonction pour générer une nouvelle position aléatoire pour la zone cachée
  const generateRandomHiddenZone = () => {
    // Taille de la zone (5% de l'image)
    const zoneSize = 5;
    
    // Génère une position aléatoire (en laissant une marge de 5% sur les bords)
    const xMin = Math.random() * (95 - zoneSize);
    const yMin = Math.random() * (95 - zoneSize);
    
    return {
      xMin,
      xMax: xMin + zoneSize,
      yMin,
      yMax: yMin + zoneSize
    };
  };

  // Génère une nouvelle zone cachée au chargement du composant
  useEffect(() => {
    setHiddenZone(generateRandomHiddenZone());
  }, []);

  // Fonction qui vérifie si le clic est dans la zone cachée
  const isInHiddenZone = (x, y) => {
    if (!hiddenZone) return false;
    
    return (
      x >= hiddenZone.xMin && 
      x <= hiddenZone.xMax && 
      y >= hiddenZone.yMin && 
      y <= hiddenZone.yMax
    );
  };

  // Fonction qui gère le clic sur l'image
  const handleImageClick = (event) => {
    // Récupérer les coordonnées relatives à l'image
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculer les pourcentages pour avoir des coordonnées relatives
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Mettre à jour l'état avec les nouvelles coordonnées
    setClickCoordinates({ x: xPercent, y: yPercent });
    
    // Afficher les coordonnées dans la console comme demandé
    console.log(`Clic aux coordonnées: x=${xPercent.toFixed(2)}%, y=${yPercent.toFixed(2)}%`);
    
    // Vérifier si le clic est dans la zone cachée
    if (isInHiddenZone(xPercent, yPercent)) {
      setCharacterFound(true);
    }
  };

  // Fonction pour basculer l'affichage de la zone cachée
  const toggleHiddenZone = () => {
    setShowHiddenZone(!showHiddenZone);
  };

  // Fonction pour recommencer le jeu avec une nouvelle position aléatoire
  const resetGame = () => {
    setCharacterFound(false);
    setHiddenZone(generateRandomHiddenZone());
  };

  return (
    <div className="game-page">
      <h1 className="text-2xl font-bold mb-4">Trouve le personnage caché</h1>
      
      {/* Bouton temporaire pour afficher/masquer les bordures autour de Bruno */}
      <button 
        onClick={toggleHiddenZone}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors"
      >
        {showHiddenZone ? "Masquer les bordures" : "Afficher les bordures"}
      </button>
      
      {/* Wrapper pour permettre le zoom et le déplacement */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent>
          <div className="image-container relative" onClick={handleImageClick}>
            <img 
              src={gameImage} 
              alt="Image du jeu" 
              className="w-full h-auto max-h-screen object-contain"
            />
            
            {/* Image de Bruno qui est toujours visible */}
            {hiddenZone && (
              <div 
                className={`absolute z-20 ${showHiddenZone ? 'border-4 border-red-500' : ''}`}
                style={{
                  left: `${hiddenZone.xMin}%`,
                  top: `${hiddenZone.yMin}%`,
                  width: `${hiddenZone.xMax - hiddenZone.xMin}%`,
                  height: `${hiddenZone.yMax - hiddenZone.yMin}%`,
                  backgroundColor: showHiddenZone ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                  pointerEvents: 'none', // Pour que les clics passent à travers
                }}
              >
                <img 
                  src={brunoImage} 
                  alt="Bruno"
                  className="w-full h-full"
                  style={{
                    objectFit: 'contain',
                    opacity: 1
                  }}
                />
              </div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Message de succès quand Bruno est trouvé */}
      {characterFound && (
        <div className="success-message mt-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
          <h2 className="text-xl font-bold">Bravo, tu as trouvé Bruno !</h2>
          <button 
            onClick={resetGame}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Recommencer
          </button>
        </div>
      )}

      {/* Affichage des dernières coordonnées (optionnel pour le développement) */}
      <div className="coordinates-display mt-4 p-2 bg-gray-100 rounded">
        <p>Dernier clic: x={clickCoordinates.x.toFixed(2)}%, y={clickCoordinates.y.toFixed(2)}%</p>
        {showHiddenZone && hiddenZone && (
          <p className="text-red-500 mt-1">
            Position de Bruno: x={hiddenZone.xMin.toFixed(2)}% à {hiddenZone.xMax.toFixed(2)}%, 
            y={hiddenZone.yMin.toFixed(2)}% à {hiddenZone.yMax.toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}

export default GamePage; 
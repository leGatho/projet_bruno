import { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gameImage from '../assets/game/game-image.png';
import brunoImage from '../assets/game/Bruno.png';

function GamePage() {
  // État pour stocker les coordonnées du dernier clic
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
  // État pour savoir si le personnage a été trouvé
  const [characterFound, setCharacterFound] = useState(false);
  // État pour afficher ou masquer la zone invisible (pour le développement)
  const [showHiddenZone, setShowHiddenZone] = useState(false);
  // État pour stocker la zone cachée (position aléatoire)
  const [hiddenZone, setHiddenZone] = useState(null);
  // Référence au conteneur de l'image
  const imageContainerRef = useRef(null);
  // Référence à l'image principale
  const mainImageRef = useRef(null);
  // Référence à l'image de Bruno
  const brunoImageRef = useRef(null);

  // Dimensions fixes de Bruno en pixels
  const brunoSize = { width: 28, height: 42 };

  // Fonction pour générer une nouvelle position aléatoire pour la zone cachée
  const generateRandomHiddenZone = () => {
    // Génère une position aléatoire (en laissant une marge sur les bords)
    // On utilise 95% comme limite pour éviter que Bruno ne sorte de l'écran
    const xMin = Math.random() * 90; // Réduit à 90% pour éviter les bords
    const yMin = Math.random() * 90;
    
    return {
      xMin,
      yMin
    };
  };

  // Génère une nouvelle zone cachée au chargement du composant
  useEffect(() => {
    setHiddenZone(generateRandomHiddenZone());
  }, []);

  // Fonction qui vérifie si le clic est sur Bruno
  const isClickOnBruno = (x, y) => {
    if (!hiddenZone || !brunoImageRef.current) return false;
    
    // Récupérer les dimensions réelles de l'image principale
    const mainImage = mainImageRef.current;
    if (!mainImage) return false;
    
    const mainImageRect = mainImage.getBoundingClientRect();
    const mainImageWidth = mainImageRect.width;
    const mainImageHeight = mainImageRect.height;
    
    // Calculer les coordonnées réelles de Bruno en pixels
    const brunoLeftPx = (hiddenZone.xMin / 100) * mainImageWidth;
    const brunoTopPx = (hiddenZone.yMin / 100) * mainImageHeight;
    const brunoRightPx = brunoLeftPx + brunoSize.width;
    const brunoBottomPx = brunoTopPx + brunoSize.height;
    
    // Convertir les coordonnées du clic de pourcentage à pixels
    const clickXPx = (x / 100) * mainImageWidth;
    const clickYPx = (y / 100) * mainImageHeight;
    
    // Vérifier si le clic est dans les limites de Bruno
    return (
      clickXPx >= brunoLeftPx && 
      clickXPx <= brunoRightPx && 
      clickYPx >= brunoTopPx && 
      clickYPx <= brunoBottomPx
    );
  };

  // Fonction qui gère le clic sur l'image
  const handleImageClick = (event) => {
    // Récupérer le conteneur d'image et l'image elle-même
    const container = imageContainerRef.current;
    const image = mainImageRef.current;
    if (!container || !image) return;
    
    // Récupérer les dimensions de l'image affichée
    const imgRect = image.getBoundingClientRect();
    
    // Récupérer les coordonnées relatives à l'image réelle, pas au conteneur
    const x = event.clientX - imgRect.left;
    const y = event.clientY - imgRect.top;
    
    // Calculer les pourcentages par rapport à l'image visible
    const xPercent = (x / imgRect.width) * 100;
    const yPercent = (y / imgRect.height) * 100;
    
    // Mettre à jour l'état avec les nouvelles coordonnées
    setClickCoordinates({ x: xPercent, y: yPercent });
    
    // Afficher les coordonnées dans la console
    console.log(`Clic aux coordonnées: x=${xPercent.toFixed(2)}%, y=${yPercent.toFixed(2)}%`);
    
    // Vérifier si le clic est sur Bruno
    if (isClickOnBruno(xPercent, yPercent)) {
      setCharacterFound(true);
    }
  };

  // Fonction pour basculer l'affichage des bordures de la zone cachée
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
      <h1 className="text-2xl font-bold mb-4">Trouve Bruno caché dans l'image</h1>
      
      {/* Bouton temporaire pour afficher/masquer les bordures */}
      <button 
        onClick={toggleHiddenZone}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors"
      >
        {showHiddenZone ? "Masquer les bordures" : "Afficher les bordures"}
      </button>
      
      {/* Wrapper pour permettre le zoom et le déplacement */}
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        wheel={{ step: 0.2 }}
        centerOnInit={true}
        limitToBounds={true}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent 
          wrapperStyle={{ 
            width: '100%', 
            height: '80vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000'
          }}
          contentStyle={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Conteneur d'image avec position relative pour les coordonnées des clics */}
          <div 
            ref={imageContainerRef}
            className="image-container relative w-full h-full" 
            onClick={handleImageClick}
            style={{ 
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
          >
            {/* Image principale comme base */}
            <img 
              ref={mainImageRef}
              src={gameImage} 
              alt="Image du jeu" 
              className="w-full h-full"
              style={{ 
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            
            {/* Image de Bruno - toujours visible */}
            {hiddenZone && (
              <div 
                className={`absolute ${showHiddenZone ? 'border-2 border-red-500' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${hiddenZone.xMin}%`,
                  top: `${hiddenZone.yMin}%`,
                  width: `${brunoSize.width}px`,
                  height: `${brunoSize.height}px`,
                  zIndex: 50
                }}
              >
                <img 
                  ref={brunoImageRef}
                  src={brunoImage} 
                  alt="Bruno"
                  className="w-full h-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
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
            Position de Bruno: x={hiddenZone.xMin.toFixed(2)}%, y={hiddenZone.yMin.toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}

export default GamePage; 
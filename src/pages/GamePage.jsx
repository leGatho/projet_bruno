import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gameImage from '../assets/game/game-image.jpg';

function GamePage() {
  // État pour stocker les coordonnées du dernier clic
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

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
  };

  return (
    <div className="game-page">
      <h1 className="text-2xl font-bold mb-4">Trouve le personnage caché</h1>
      
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
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Affichage des dernières coordonnées (optionnel pour le développement) */}
      <div className="coordinates-display mt-4 p-2 bg-gray-100 rounded">
        <p>Dernier clic: x={clickCoordinates.x.toFixed(2)}%, y={clickCoordinates.y.toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default GamePage; 
import React from 'react';
import { FiX } from 'react-icons/fi';
import UnityGameComponent from './UnityGameComponent';

// En GameModal.jsx
const GameModal = ({ isOpen, onClose, gameUrl }) => {
  if (!isOpen || !gameUrl) return null;

  const pathPart = gameUrl.split('?')[0];
  const gameName = pathPart.split('/').pop();
  const sid = new URLSearchParams(gameUrl.split('?')[1]).get('sid');

  return (
    // ESTE CONTENEDOR ES EL QUE HACE LA MAGIA DEL MODAL
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[80vh] bg-zinc-900 rounded-4xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
        >
          {/* Aquí iría tu icono FiX */}
          X
        </button>

        {/* Aquí va el componente del juego */}
        <UnityGameComponent gameName={gameName} sessionId={sid} />
      </div>
    </div>
  );
};

export default GameModal;
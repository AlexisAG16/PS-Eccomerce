import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

const defaultStyles = {
  overlay: {
    backgroundColor: 'rgba(26, 82, 118, 0.7)', // Un poco más oscuro para resaltar
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex', // Usamos flex para ayudar al centrado
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px', // 👈 ESTO garantiza que el modal no toque los bordes de la pantalla
  },
  content: {
    position: 'relative', // Cambiado de absolute para que trabaje con el flex del padre
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0', // Quitamos el padding del library
    width: '100%',
    maxWidth: '550px',
    maxHeight: '100%', // 👈 Obliga al modal a no ser más alto que el overlay (con su padding)
    overflow: 'visible',
    outline: 'none',
    margin: '0 auto',
  }
};

export const AdminModal = ({ isOpen, onClose, title, subtitle, children, maxWidth = '550px' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: { ...defaultStyles.overlay },
        content: { ...defaultStyles.content, maxWidth }
      }}
      closeTimeoutMS={300}
      contentLabel={title || "Formulario Patrician Software"}
      bodyOpenClassName="modal-open"
      ariaHideApp={false} // Evita advertencias si no configuraste el app element
    >
      {/* Contenedor Principal con Scroll si el contenido es muy largo */}
      <div className="bg-white relative shadow-2xl rounded-[3rem] w-full flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-2 z-30" />

        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-secondary transition-colors z-40 cursor-pointer"
        >
          <FiX size={24} />
        </button>

        {/* HEADER FIJO */}
        {(title || subtitle) && (
          <header className="p-10  border-b border-gray-50 shrink-0">
            {subtitle && (
              <p className="text-brand-secondary text-[9px] font-black uppercase tracking-[0.4em] mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="text-2xl font-black text-brand-primary uppercase italic tracking-tighter leading-none">
              {title}
            </h2>
          </header>
        )}

        {/* CONTENIDO CON SCROLL INTERNO */}
        <div className="p-10 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </Modal>
  );
};

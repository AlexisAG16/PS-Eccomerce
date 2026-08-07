import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

const defaultStyles = {
  overlay: {
    backgroundColor: 'rgba(8, 13, 26, 0.82)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    width: '100%',
    maxWidth: '550px',
    maxHeight: '100%',
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
      ariaHideApp={false}
    >
      <div className="bg-brand-surface text-brand-text relative shadow-2xl rounded-[3rem] w-full flex flex-col max-h-[90vh] border border-brand-border">
        <div className="absolute top-0 left-0 w-full h-2 z-30 bg-brand-highlight" />

        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 text-brand-text-muted hover:text-brand-secondary transition-colors z-40 cursor-pointer"
        >
          <FiX size={24} />
        </button>

        {(title || subtitle) && (
          <header className="p-10 border-b border-brand-border shrink-0">
            {subtitle && (
              <p className="text-brand-highlight text-[9px] font-black uppercase tracking-[0.4em] mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="text-2xl font-black text-brand-text uppercase italic tracking-tighter leading-none">
              {title}
            </h2>
          </header>
        )}

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </Modal>
  );
};

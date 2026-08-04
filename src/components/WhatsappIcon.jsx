import { FaWhatsapp } from 'react-icons/fa';

const WhatsappIcon = () => {
  const phoneNumber = "5491122222266";
  const message = encodeURIComponent("¡Hola! Me gustaría realizar una consulta.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25d366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '35px',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
        zIndex: 9999,
        textDecoration: 'none'
      }}
    >
      {/* 2. USA EL COMPONENTE DE REACT ICONS AQUÍ */}
      <FaWhatsapp />
    </a>
  )
}

export default WhatsappIcon;

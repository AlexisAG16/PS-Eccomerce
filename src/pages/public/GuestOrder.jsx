import React, { useState } from 'react';

const GuestOrder = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Procesando pedido de invitado:", formData);
    // Aquí rediriges a la pasarela de pago (Stripe, PayPal, etc.)
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Finalizar Compra (Invitado)</h1>
      <p style={{ color: '#666' }}>No necesitas cuenta. Solo dinos dónde enviar tu pedido.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section>
          <h3>Contacto</h3>
          <input 
            type="email" name="email" placeholder="Correo electrónico" 
            value={formData.email} onChange={handleChange} required 
            style={inputStyle}
          />
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>Dirección de Envío</h3>
          <input 
            type="text" name="fullName" placeholder="Nombre completo" 
            value={formData.fullName} onChange={handleChange} required 
            style={inputStyle}
          />
          <input 
            type="text" name="address" placeholder="Calle y número" 
            value={formData.address} onChange={handleChange} required 
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" name="city" placeholder="Ciudad" 
              value={formData.city} onChange={handleChange} required 
              style={{ ...inputStyle, flex: 2 }}
            />
            <input 
              type="text" name="zipCode" placeholder="Código Postal" 
              value={formData.zipCode} onChange={handleChange} required 
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <input 
            type="tel" name="phone" placeholder="Teléfono de contacto" 
            value={formData.phone} onChange={handleChange} required 
            style={inputStyle}
          />
        </section>

        <button type="submit" style={{ 
          backgroundColor: '#27ae60', color: 'white', padding: '15px', 
          border: 'none', borderRadius: '5px', fontSize: '1.1em', cursor: 'pointer' 
        }}>
          Continuar al Pago
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
  boxSizing: 'border-box'
};

export default GuestOrder;

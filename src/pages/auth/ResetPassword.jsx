import React, { useState } from 'react'

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    if(password === confirmPassword) {
      console.log("Contraseña cambiada a:", password);
      // Aquí envías la nueva clave a tu base de datos
    } else {
      alert("Las contraseñas no coinciden");
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h2>Crea tu nueva contraseña</h2>
      <form onSubmit={handleReset}>
        <input 
          type="password" 
          placeholder="Nueva contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <br /><br />
        <input 
          type="password" 
          placeholder="Confirma tu contraseña" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <br /><br />
        <button type="submit">Actualizar contraseña</button>
      </form>
    </div>
  )
}

export default ResetPassword

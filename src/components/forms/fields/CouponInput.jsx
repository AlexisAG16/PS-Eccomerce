import { useState } from 'react';
import { FaCheck, FaTimes, FaTag } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import api from '../../../api/axiosConfig';

const CouponInput = ({ onApply, cart }) => { // 1. Recibe el cart por props
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const validateCoupon = async () => {
    if (!code) return;
    setLoading(true);
    try {
      // 2. Usamos 'code' (el estado real) y 'cart' (la prop)
      const res = await api.post('/coupons/validate', {
        code: code,
        cart: cart
      });

      // 3. Accedemos a res.data
      onApply(res.data); // Pasamos todo el objeto de respuesta
      setStatus('success');
    } catch (error) {
      console.error("Error validando:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-surface p-6 rounded-4xl border border-brand-border mt-6">
      <label className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest ml-1 mb-2 block">
        ¿Tienes un código de descuento?
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus(null); }}
            className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-brand-highlight font-bold uppercase text-brand-text placeholder:text-brand-text-muted"
            placeholder="INGRESA CÓDIGO"
          />
        </div>
        <button
          onClick={validateCoupon}
          disabled={loading || status === 'success'}
          className="bg-brand-primary text-brand-text px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all disabled:opacity-50 border border-brand-border"
        >
          {loading ? <ClipLoader size={12} color="#fff" /> : 'Validar'}
        </button>
      </div>

      {status === 'success' && (
        <p className="text-green-300 text-[10px] font-bold mt-2 flex items-center gap-2">
          <FaCheck /> Cupón aplicado correctamente
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-300 text-[10px] font-bold mt-2 flex items-center gap-2">
          <FaTimes /> Código inválido o expirado
        </p>
      )}
    </div>
  );
};

export default CouponInput;

import { useState, useEffect, useContext } from 'react';
import { FiGift, FiPlay } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import GameModal from '../GameModal';

const RedemptionGallery = ({ onRedeemSuccess }) => {
  // Usamos 'updatePoints' desde tu AuthContext recién modificado
  const { user, updatePoints } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);

  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState(null);

  const userPoints = Number(user?.points || 0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get('/rewards?isActive=true&limit=20');
        setRewards(res.data.data.data || []);
      } catch (err) {
        console.error("Error fetching rewards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleRedeem = async (reward) => {
    const cost = Number(reward.pointsCost);

    if (userPoints < cost) {
      return Swal.fire({
        icon: 'error',
        title: 'Puntos insuficientes',
        text: `Te faltan ${cost - userPoints} puntos.`,
        confirmButtonColor: '#6c6bc8',
      });
    }

    // 🎯 VALIDACIÓN EXCLUSIVA PARA PREMIOS TIPO MINIJUEGO
    if (reward.isGame) {
      try {
        const gameName = reward.gameName || 'ruleta';

        // Llamamos al endpoint de verificación que ya lee el token
        const checkPlays = await api.get(`/games/user/${user._id}/plays/${gameName}`);

        // 💡 REGLA DE NEGOCIO: Si "played" es true pero detectamos que el usuario 
        // tiene compras pendientes o queremos proteger el flujo de reconexión:
        if (checkPlays.data.played && reward.pointsCost > 0) {
          // Aquí podés decidir si permitís re-jugar infinitamente pagando o si lo derivás.
          // Si tu backend maneja un contador de "compras", se evalúa acá. 
          // De momento, si querés evitar que compre duplicado si se le cayó la pantalla:
          console.log("Sesiones registradas hoy para este juego:", checkPlays.data);
        }
      } catch (err) {
        console.error("Error al validar historial de canje:", err);
      }
    }

    // --- RESTO DEL FLUJO DE CANJE QUE YA USÁS ---
    const result = await Swal.fire({
      title: reward.isGame ? '¿Jugar ahora?' : '¿Confirmar canje?',
      text: reward.isGame
        ? `Vas a apostar ${cost} puntos en "${reward.title}"`
        : `Vas a canjear ${cost} puntos por "${reward.title}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6c6bc8',
      cancelButtonColor: '#d33',
      confirmButtonText: reward.isGame ? '¡Jugar!' : '¡Sí, lo quiero!',
    });

    if (result.isConfirmed) {
      setRedeemingId(reward._id);
      try {
        const response = await api.post(`/rewards/redeem/${reward._id}`);
        const data = response.data.data;

        updatePoints(data.remainingPoints);

        if (data.type === 'REDIRECT_TO_GAME') {
          setGameUrl(`${window.location.origin}${data.url}`);
          setIsGameOpen(true);
        } else {
          await Swal.fire({
            icon: 'success',
            title: '¡Canje exitoso!',
            text: 'Tu cupón ya está disponible en tu perfil.',
            timer: 3000,
            showConfirmButton: false
          });
          if (onRedeemSuccess) onRedeemSuccess(data.remainingPoints);
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: err.response?.data?.message || "No pudimos procesar el canje.",
        });
      } finally {
        setRedeemingId(null);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center py-20">
      <ClipLoader color="#6c6bc8" size={30} />
    </div>
  );

  return (
    <section className="mt-12">
      <div className="mb-8">
        <h3 className="text-2xl font-black italic text-brand-secondary uppercase tracking-tighter leading-none">
          Canjeá tus <span className="text-brand-primary">Patrician Software Points</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const rewardCost = Number(reward.pointsCost);
          const canAfford = userPoints >= rewardCost;
          const isProcessing = redeemingId === reward._id;

          return (
            <div key={reward._id} className={`relative bg-white p-8 rounded-[2.5rem] border-2 flex flex-col items-center overflow-hidden transition-all ${canAfford ? 'border-gray-50' : 'opacity-75 grayscale'}`}>
              <div className="absolute -right-4 -top-4 text-brand-surface text-8xl rotate-12 z-0">
                {reward.isGame ? <FiPlay /> : <FiGift />}
              </div>

              <div className={`relative z-10 w-20 h-20 rounded-full mb-6 flex items-center justify-center text-2xl shadow-inner ${canAfford ? 'bg-brand-surface text-brand-primary' : 'bg-gray-100'}`}>
                {reward.isGame ? <FiPlay /> : (reward.config?.discountType === 'percentage' ? `${reward.config.value}%` : '🎁')}
              </div>

              <div className="relative z-10 text-center grow">
                <h4 className="font-black text-gray-800 uppercase italic text-lg leading-tight mb-2">{reward.title}</h4>
                <div className="inline-flex items-center gap-1.5 mb-6 bg-brand-surface px-4 py-1.5 rounded-full border">
                  <span className="font-black text-sm italic text-brand-primary">{rewardCost}</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase">Points</span>
                </div>
              </div>

              <button
                onClick={() => handleRedeem(reward)}
                disabled={!canAfford || isProcessing}
                className="w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] bg-brand-primary text-white hover:bg-brand-secondary transition-all disabled:bg-gray-200"
              >
                {isProcessing ? <ClipLoader size={12} color="#ffffff" /> : reward.isGame ? 'Jugar ahora' : 'Confirmar Canje'}
              </button>
            </div>
          );
        })}
      </div>

      <GameModal
        isOpen={isGameOpen}
        onClose={() => {
          setIsGameOpen(false);
          setGameUrl(null); // Limpiamos al cerrar
        }}
        // Pasamos el gameUrl, pero si es null, el componente sabrá qué hacer
        gameUrl={gameUrl}
      />
    </section>
  );
};

export default RedemptionGallery;

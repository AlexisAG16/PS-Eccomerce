import { useNavigate } from "react-router";
import { GiSpinningWheel, GiCardPlay } from "react-icons/gi"; // Íconos de juegos

const GameZonePromo = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para los juegos disponibles
  const games = [
    {
      id: 'ruleta',
      name: 'La Ruleta Patrician Software',
      description: '¡Girá y ganá puntos extra cada día!',
      icon: <GiSpinningWheel />,
      color: 'bg-[#ff6b6b]', // Un color vibrante para el juego
    },
    {
      id: 'memotest',
      name: 'Patrician Software MemoChallenge',
      description: 'Encontrá los pares y sumá multiplicadores.',
      icon: <GiCardPlay />,
      color: 'bg-[#4ecdc4]', // Otro color vibrante
    },
  ];

  return (
    <section className="bg-brand-surface p-8 rounded-4xl shadow-inner mb-12 border border-brand-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-brand-highlight text-xs uppercase font-black tracking-[0.2em]">
            Diversión Asegurada
          </p>
          <h3 className="text-brand-highlight text-3xl font-black italic tracking-tighter">
            Patrician Software Game Zone
          </h3>
        </div>
        <p className="text-brand-text-muted text-sm max-w-md sm:text-right">
          Usá tus puntos para jugar o participá en los desafíos diarios para multiplicar tu saldo. ¡Próximamente más juegos!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-brand-bg/70 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6 group cursor-pointer border border-brand-border"
            onClick={() => navigate(`/tienda-puntos/juego/${game.id}`)}
          >
            {/* Ícono del Juego con Fondo de Color */}
            <div className={`${game.color} w-20 h-20 rounded-2xl flex items-center justify-center text-5xl text-brand-text shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
              {game.icon}
            </div>

            {/* Info del Juego */}
            <div className="flex flex-col flex-1">
              <h4 className="text-brand-text font-bold text-lg uppercase tracking-tight">
                {game.name}
              </h4>
              <p className="text-brand-text-muted text-sm mb-3">
                {game.description}
              </p>
              <button className="self-start bg-brand-primary text-brand-text px-5 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent transition-colors shadow">
                Jugar Ahora
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameZonePromo;

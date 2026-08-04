import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const TextCarousel = () => {
  const navigate = useNavigate();

  const slides = [
    {
      text: 'Soluciones en climatización e ingeniería termomecánica.',
    },
    {
      text: 'Climatización, servicios y eficiencia energética.',
    },
    {
      text: 'Instalación, mantenimiento y confort para tu hogar.',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const changeSlide = (newIndex) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(newIndex);
      setFade(true);
    }, 250);
  };

  const nextSlide = () => {
    setCurrent((prev) => {
      const next = (prev + 1) % slides.length;
      return next;
    });
  };

  const prevSlide = () => {
    setCurrent((prev) => {
      const next = (prev - 1 + slides.length) % slides.length;
      return next;
    });
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      nextSlide();
      setFade(true);
    }, 250);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      prevSlide();
      setFade(true);
    }, 250);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 250);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="
    relative w-full mx-auto mb-10 
    max-w-[260px]
    sm:max-w-[470px]
    md:max-w-[580px] 
    lg:max-w-[650px]
    xl:max-w-[700px]
  ">
      {/* Flecha izquierda */}
      <button
        onClick={handlePrev}
        className="absolute left-[-8px] sm:left-[-18px] md:left-[-40px] top-1/2 -translate-y-1/2 z-20
                 bg-white/90 hover:bg-white text-[#0B4F6C]
                 w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11
                 rounded-full shadow-lg flex items-center justify-center
                 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <FaChevronLeft className="text-[10px] sm:text-sm md:text-base" />
      </button>

      {/* Caja azul */}
      <div
        className="relative bg-[#0B4F6C] rounded-xl md:rounded-2xl shadow-2xl
                 px-4 sm:px-6 md:px-8
                 pt-3 sm:pt-4 md:pt-5
                 pb-10 sm:pb-12 md:pb-14
                 text-center"
      >
        {/* Línea decorativa - Más pequeña en pantallas bajas */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div className="w-8 sm:w-12 md:w-16 h-[1.5px] bg-white/50 rounded-full"></div>
        </div>

        {/* Texto - Ajuste de tamaño para 1366x620 */}
        <h2
          className={`text-white font-light leading-snug
                   text-xs sm:text-base md:text-xl lg:text-[1.6rem]
                   max-w-[90%] mx-auto
                   transition-opacity duration-300
                   min-h-[48px] sm:min-h-[60px] md:min-h-[80px]
                   flex items-center justify-center
                   ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          {slides[current].text}
        </h2>

        {/* Botón naranja - Un poco más compacto */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-16px] sm:bottom-[-18px] md:bottom-[-20px]">
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-orange-400 hover:bg-orange-500 cursor-pointer
                     text-white font-black
                     py-1.5 sm:py-2 md:py-2.5
                     px-4 sm:px-6 md:px-8
                     rounded-xl md:rounded-2xl
                     transition-all duration-300 active:scale-95 shadow-md
                     uppercase tracking-wider
                     text-[9px] sm:text-[10px] md:text-xs
                     whitespace-nowrap"
          >
            Ver Catálogo
          </button>
        </div>
      </div>

      {/* Flecha derecha */}
      <button
        onClick={handleNext}
        className="absolute right-[-8px] sm:right-[-18px] md:right-[-40px] top-1/2 -translate-y-1/2 z-20
                 bg-white/90 hover:bg-white text-[#0B4F6C]
                 w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11
                 rounded-full shadow-lg flex items-center justify-center
                 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <FaChevronRight className="text-[10px] sm:text-sm md:text-base" />
      </button>

      {/* Puntitos - Más cerca para ahorrar espacio vertical */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] sm:bottom-[-48px] flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`rounded-full transition-all duration-300 ${current === index
              ? 'bg-[#0B4F6C] w-2.5 h-2.5 sm:w-3 sm:h-3 scale-110'
              : 'bg-[#0B4F6C]/30 w-2 h-2 sm:w-2.5 sm:h-2.5'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TextCarousel;
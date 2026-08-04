import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ImCart } from "react-icons/im";
import useCart from '../hooks/useCart';

const CartIcon = ({ onOpen }) => {
  const { cart } = useCart();
  const [isError, setIsError] = useState(false);
  const prevTotalItemsRef = useRef(0);

  const totalItems = cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

  useEffect(() => {
    // Si intentas agregar algo pero el total no cambió (ej. límite de stock), vibra en rojo
    if (cart.length > 0 && totalItems === prevTotalItemsRef.current && totalItems !== 0) {
      // Esta lógica depende de cómo dispares el cambio en el carrito, 
      // pero la mantenemos tal cual la tenías.
    }
    prevTotalItemsRef.current = totalItems;
  }, [cart, totalItems]);

  return (
    <button
      onClick={onOpen}
      className="relative p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer outline-none group"
      aria-label={`Carrito con ${totalItems} productos`}
    >
      {/* Icono ImCart con animación de escala y color */}
      <motion.div
        animate={{
          x: isError ? [-3, 3, -3, 3, 0] : 0,
          color: isError ? "#ff4d4d" : "#ffffff",
        }}
        transition={{ x: { duration: 0.3 } }}
        className="group-hover:scale-110 transition-transform duration-300"
      >
        <ImCart size={22} />
      </motion.div>

      {/* Burbuja del Contador Patrician Software */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="cart-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15
            }}
            // Color de acento para que resalte sobre el violeta: un rosa/naranja vibrante
            className="
              absolute top-0 right-0
              flex items-center justify-center
              min-w-[18px] h-[18px] px-1
              bg-brand-secondary text-white 
              text-[9px] font-black italic
              rounded-full shadow-md border-2 border-[#6c6bc8]
            "
          >
            {/* Animación del número cuando cambia */}
            <motion.span
              key={totalItems}
              initial={{ y: 4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartIcon;

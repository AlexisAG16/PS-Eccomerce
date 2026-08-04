import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CarritoCompras = ({ isOpen, onClose }) => {
  const {
    cart,
    removeItem,
    clearCart,
    total,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return toast.warning("El carrito esta vacio");
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10000 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-bg/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative w-full max-w-md h-full bg-brand-surface shadow-2xl flex flex-col border-l border-brand-border"
          >
            <div className="p-6 flex justify-between items-center border-b border-brand-border">
              <div>
                <p className="text-[9px] text-brand-highlight font-black uppercase tracking-[0.25em] mb-1">
                  E-commerce
                </p>
                <h2 className="text-xl font-black text-brand-text uppercase">
                  Tu Pedido
                </h2>
              </div>
              <button onClick={onClose} className="cursor-pointer text-brand-text-muted hover:text-brand-highlight transition-colors">
                <AiOutlineClose size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                cart.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 bg-brand-bg p-3 rounded-2xl border border-brand-border"
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-16 h-20 object-contain bg-white rounded-xl"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs uppercase truncate text-brand-text">
                        {product.productName}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => decreaseQuantity(product.id)} className="cursor-pointer w-7 h-7 rounded-lg bg-brand-surface text-brand-text hover:bg-brand-accent transition-colors">-</button>
                        <span className="font-bold text-xs text-brand-text">{product.quantity}</span>
                        <button onClick={() => increaseQuantity(product.id)} className="cursor-pointer w-7 h-7 rounded-lg bg-brand-surface text-brand-text hover:bg-brand-accent transition-colors">+</button>
                      </div>

                      <p className={`text-sm font-bold mt-1 ${product.isWholesaleApplied ? "text-brand-success" : "text-brand-highlight"}`}>
                        ${product.subtotal.toLocaleString("es-AR")}
                        {product.isWholesaleApplied && <span className="text-[10px] ml-2 font-black uppercase">Precio mayorista</span>}
                      </p>

                      <div className="bg-brand-surface rounded-xl p-2 text-[9px] font-bold space-y-0.5 mt-1 border border-brand-border">
                        <div className="flex justify-between text-brand-text-muted">
                          <span>Precio x menor:</span>
                          <span>${product.price.toLocaleString("es-AR")} c/u</span>
                        </div>

                        {product.priceWholesale && (
                          <div className="flex justify-between text-brand-text">
                            <span>Precio x mayor:</span>
                            <span className="font-black">${product.priceWholesale.toLocaleString("es-AR")} c/u</span>
                          </div>
                        )}
                      </div>

                      {!product.isWholesaleApplied && product.priceWholesale && (
                        <p className="text-[8px] font-bold text-brand-highlight uppercase tracking-wider mt-1 pl-1">
                          Lleva 10 unidades totales para aplicar precio mayorista
                        </p>
                      )}
                    </div>

                    <button onClick={() => removeItem(product.id)} className="text-brand-text-muted hover:text-brand-danger transition-colors cursor-pointer">
                      <AiOutlineDelete size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-brand-text-muted font-bold text-sm py-8">
                  El carrito esta vacio
                </p>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-border bg-brand-primary/40">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Total</span>
                  <span className="font-black text-2xl text-brand-highlight">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    className="border border-brand-border text-brand-text py-3 rounded-xl text-xs font-bold uppercase transition-colors hover:bg-brand-surface cursor-pointer"
                  >
                    Limpiar
                  </button>

                  <button
                    onClick={handleCheckout}
                    className="bg-brand-accent text-white py-3 rounded-xl text-xs font-bold uppercase transition-transform hover:bg-brand-accent-hover hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CarritoCompras;

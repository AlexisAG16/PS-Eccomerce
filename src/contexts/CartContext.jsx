import { createContext, useEffect, useState } from 'react';

// 1. Definir contexto
export const CartContext = createContext();

// 2. crear provider
export const CartProvider = ({ children }) => { // 'children' son los elementos hijos que se colocan dentro del componente en el JSX.
  const [cart, setCart] = useState(getInitialCart);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}> {/* // hace accesible el valor { cart, setCart } a todos los componentes hijos que lo consuman mediante el hook useContext(CartContext). */}
      {children}
    </CartContext.Provider>
  );
};

// Función para cargar desde localStorage
export const getInitialCart = () => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');

    return storedCart ? JSON.parse(storedCart) : [];
  }

  return [];
};
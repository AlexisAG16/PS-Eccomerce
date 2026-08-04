import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { mapProductToCartItem } from "../utils/cartMapper";

const useCart = () => {
  const { cart, setCart } = useContext(CartContext);

  // =========================
  // VALIDADOR CENTRAL
  // =========================
  const canUpdateQuantity = (item, newQty) => {
    if (item.productType === "QUOTE") return false;
    if (item.maxPurchaseQty && newQty > item.maxPurchaseQty) return false;
    if (item.minPurchaseQty && newQty < item.minPurchaseQty) return false;
    if (item.trackStock && newQty > item.stock) return false;
    return true;
  };

  // 📈 Unidades totales en todo el carrito
  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ==========================================
  // 📈 LOGÍSTICA DE PRECIOS DINÁMICOS AUTOMÁTICOS
  // ==========================================
  const cartWithPrices = cart.map(item => {

    // 🎯 REGLA DE DESBLOQUEO: 
    // Opción A: Desbloquea si el TOTAL de cosas en el carrito es >= 10
    const isWholesaleUnlocked = totalUnits >= 10 && item.priceWholesale !== null && item.priceWholesale !== undefined;

    // Opción B (Por si querés que sea 10 unidades DE ESE MISMO PRODUCTO):
    // const isWholesaleUnlocked = item.quantity >= 10 && item.priceWholesale !== null && item.priceWholesale !== undefined;

    // Si se desbloqueó por volumen, toma el precio mayorista. Si no, queda el normal.
    const currentUnitPrice = isWholesaleUnlocked ? item.priceWholesale : item.price;

    return {
      ...item,
      price: item.price,
      priceWholesale: item.priceWholesale,
      activeUnitPrice: currentUnitPrice,
      subtotal: currentUnitPrice * item.quantity,
      isWholesaleApplied: isWholesaleUnlocked
    };
  });

  // =========================
  // ADD ITEM
  // =========================
  const addItem = (product) => {
    const item = mapProductToCartItem(product);
    const exists = cart.find(p => p.id === item.id);

    if (exists) {
      const newQty = exists.quantity + 1;
      if (!canUpdateQuantity(exists, newQty)) return;

      setCart(cart.map(p =>
        p.id === item.id ? { ...p, quantity: newQty } : p
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  // =========================
  // INCREMENTAR / DECREMENTAR
  // =========================
  const increaseQuantity = (id) => {
    setCart(cart.map(item => {
      if (item.id !== id) return item;
      const newQty = item.quantity + 1;
      if (!canUpdateQuantity(item, newQty)) return item;
      return { ...item, quantity: newQty };
    }));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item => {
      if (item.id !== id) return item;
      const newQty = item.quantity - 1;
      if (!canUpdateQuantity(item, newQty)) return item;
      return { ...item, quantity: newQty };
    }));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Totales basados en la mutación dinámica
  const total = cartWithPrices.reduce((acc, item) => acc + item.subtotal, 0);

  const getOrderItems = () => {
    return cartWithPrices.map(item => ({
      productId: item.id,
      categoryId: item.categoryId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.activeUnitPrice,
      subtotal: item.subtotal
    }));
  };

  return {
    cart: cartWithPrices,
    rawCart: cart,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    total,
    totalUnits,
    isWholesaleActive: cartWithPrices.some(i => i.isWholesaleApplied), // Devuelve true si al menos uno mutó
    getOrderItems
  };
};

export default useCart;
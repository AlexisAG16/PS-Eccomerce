export const mapProductToCartItem = (product) => ({
  id: product._id,
  productName: product.productName,
  price: Number(product.finalPrice || product.priceRetail || 0),

  // 👑 EL COHETE QUE FALTABA ACÁ: Mapeamos el precio mayorista desde la DB
  priceWholesale: product.priceWholesale ? Number(product.priceWholesale) : null,

  image: product.images?.[0]?.xs || "",
  quantity: Number(product.minPurchaseQty) || 1,

  // 🔥 EL FIX AQUÍ: Extraemos el ID limpio sin importar si viene poblado o no
  categoryId: typeof product.categoriesId?.[0] === 'object'
    ? product.categoriesId[0]._id
    : product.categoriesId?.[0] || null,

  minPurchaseQty: Number(product.minPurchaseQty) || 1,
  maxPurchaseQty: product.maxPurchaseQty ? Number(product.maxPurchaseQty) : null,
  trackStock: product.trackStock ?? true,
  stock: Number(product.stock) ?? 0,
  productType: product.productType
});
import GameZonePromo from "../../components/point_shop/GameZonePromo";
import PointsWallet from "../../components/point_shop/PointsWallet";
import RedemptionGallery from "../../components/point_shop/RedemptionCard";

const PointsShop = () => {
  return (
    <div className="pb-10 px-4 max-w-7xl mx-auto min-h-screen">
      {/* 1. Header de la Tienda: Saldo de puntos estilo "Billetera" */}
      <PointsWallet />

      {/* 2. Sección de Juegos: Banner colorido y animado */}
      {/* <GameZonePromo /> */}

      {/* 3. Catálogo de Canjes: Cupones y beneficios */}
      <RedemptionGallery />
    </div>
  );
};

export default PointsShop;
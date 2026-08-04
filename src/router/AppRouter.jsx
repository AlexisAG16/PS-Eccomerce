import { Routes, Route, Navigate, Outlet } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// --- Public Pages ---
import Home from "../pages/public/ProductoMenuHome.jsx";
import Catalogo from "../pages/public/Catalogo.jsx"
import ProductDetail from "../pages/public/ProductDetail";
import CategoryDetail from "../pages/public/CategoryDetail";
import CarritoCompras from "../pages/public/CarritoCompras";
import GuestOrder from "../pages/public/GuestOrder";
import OrderSuccess from "../pages/public/OrderSuccess";
import OrderFailed from "../pages/public/OrderFailed";
import OrderPage from "../pages/public/OrderPage.jsx";
import CheckoutPage from "../pages/public/CheckoutPage.jsx";

// --- Auth Pages ---
import Login from "../pages/auth/Login";
import MyProfile from "../pages/auth/MyProfile.jsx";
import OrderTrackingPage from "../pages/public/OrderTrackingPage.jsx";
import ResetPassword from "../pages/public/ResetPassword.jsx";

// --- Admin Pages ---
import AdminDetailAffiliates from "../pages/private/detail/AdminDetailAffiliates.jsx";
import AdminAffiliates from "../pages/private/dashboard/AdminAffiliates.jsx";
import AdminCoupons from "../pages/private/dashboard/AdminCoupons.jsx";
import AdminDetailCoupons from "../pages/private/detail/AdminDetailCoupons.jsx";
import AdminUsers from "../pages/private/dashboard/AdminUsers.jsx";
import AdminDetailUser from "../pages/private/detail/AdminDetailUser.jsx";

// UI
import AdminTitle from "../components/ui/AdminTitle.jsx";

// --- Error Pages ---
import NotFound from "../pages/NotFound";
import ForbiddenPage from "../pages/ForbiddenPage";
import ForgotPassword from "../pages/public/ForgotPassword.jsx";
import AdminBrandDetail from "../pages/private/detail/AdminBrandDetail.jsx";
import Register from "../components/Register.jsx";
import PointsShop from "../pages/public/PointsShop.jsx";
import AdminProductDetail from "../pages/private/detail/AdminProductDetail.jsx";
import AdminProducts from "../pages/private/dashboard/AdminProducts.jsx";
import AdminBrands from "../pages/private/dashboard/AdminBrands.jsx";
import AdminOrderDetail from "../pages/private/detail/AdminOrderDetail.jsx";
import AdminFullOrders from "../pages/private/dashboard/AdminFullOrders.jsx";
import AdminShippingDetail from "../pages/private/detail/AdminShippingDetail.jsx";
import AdminShippings from "../pages/private/dashboard/AdminShippings.jsx";
import AdminPaymentDetail from "../pages/private/detail/AdminPaymentDetail.jsx";
import AdminPayments from "../pages/private/dashboard/AdminPayments.jsx";
import AdminCategoryDetail from "../pages/private/detail/AdminCategoryDetail.jsx";
import AdminCategories from "../pages/private/dashboard/AdminCategories.jsx";
import AdminDiscountDetail from "../pages/private/detail/AdminDetailDiscounts.jsx";
import AdminDiscounts from "../pages/private/dashboard/AdminDiscounts.jsx";
import AdminDashboard from "../pages/private/dashboard/AdminDashboard.jsx";
import AdminMinigameDashboard from "../pages/private/dashboard/AdminMinigameDashboard.jsx";
import AdminLogDashboard from "../pages/private/dashboard/AdminLogDashboard.jsx";
import AdminDetailMinigame from "../pages/private/detail/AdminDetailMinigame.jsx";
import AdminDetailLog from "../pages/private/detail/AdminDetailLog.jsx";
import MyOrders from "../pages/auth/MyOrders.jsx";
import { useAffiliateTracker } from "../hooks/useAffiliateTracker.js";
import AdminRewardsDashboard from "../pages/private/dashboard/AdminRewardsDashboard.jsx";
import AdminDetailRewards from "../pages/private/detail/AdminDetailRewards.jsx";
import AdminConfig from "../pages/private/AdminConfig.jsx";

const HeaderSpacer = ({ variant = 'default' }) => {
  const heights = {
    default: "h-25 md:h-40",
    small: "h-20 md:h-32",
    admin: "h-48 md:h-60"
  };

  return <div className={`${heights[variant]} w-full block`} />;
};

const PublicLayoutWithSpacer = () => (
  <>
    <HeaderSpacer />
    <Outlet />
  </>
);

const AppRouter = () => {
  useAffiliateTracker();

  return (
    <Routes>
      {/* 0. TRACKS */}
      <Route path="/track/:orderId" element={<OrderTrackingPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />}/>
        

      {/* 1. RUTAS PÚBLICAS (Con Navbar de cliente) */}
      <Route element={<MainLayout />}>

        {/* RUTAS CON ESPACIADO  */}
        <Route element={<PublicLayoutWithSpacer />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="productos/:slug" element={<ProductDetail />} />
          <Route path="categoria/:id" element={<CategoryDetail />} />
          <Route path="carrito" element={<CarritoCompras />} />

          {/* Rutas que requieren estar logueado pero NO son de admin */}
          <Route path="checkout-invitado" element={<GuestOrder />} />
          <Route path="checkout" element={<OrderPage />} />
          <Route path="orden/recibo/:orderId" element={<CheckoutPage />} />
          <Route path="pago-exitoso" element={<OrderSuccess />} />
          <Route path="pago-fallido" element={<OrderFailed />} />
          <Route path="mis-ordenes" element={<MyOrders />} />

          {/* Tienda de Puntos */}
          <Route path="tienda-puntos" element={<PointsShop />} />

          <Route element={<ProtectedRoute />}>
            <Route path="mi-perfil" element={<MyProfile />} />
          </Route>
        </Route>
      </Route>

      {/* 3. RUTAS DE ADMINISTRACIÓN (Protegidas y con Layout de Admin) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin', 'operator']} />}>
        <Route element={<MainLayout />}>
          <Route element={<PublicLayoutWithSpacer />}>
            <Route element={<AdminTitle />} >
              {/* RUTAS CON ESPACIADO  */}
              {/* CRUDS */}
              {/* PRODUCTOS */}
              {/* <Route path="/admin/productos/crear" element={<ProductForm />} />
              <Route path="/admin/productos/editar/:id" element={<ProductForm />} /> */}
              <Route path="/admin/productos/detalle/:id" element={<AdminProductDetail />} />
              <Route path="/admin/productos/:pageNumber?" element={<AdminProducts />} />
              {/* MARCAS */}
              <Route path="/admin/marcas/:pageNumber?" element={<AdminBrands />} />
              <Route path="/admin/marcas/detalle/:id" element={<AdminBrandDetail />} />
              {/* ORDENES */}
              <Route path="/admin/ordenes/detalle/:id" element={<AdminOrderDetail />} />
              {/* <Route path="/admin/ordenes/:pageNumber?" element={<AdminOrders />} /> */}
              <Route path="/admin/ordenes/:pageNumber?" element={<AdminFullOrders />} /> {/* ADMIN ORDERS COMPLETO */}
              {/* PAGOS */}
              <Route path="/admin/pagos/detalle/:id" element={<AdminPaymentDetail />} />
              <Route path="/admin/pagos/:pageNumber?" element={<AdminPayments />} />
              {/* CATEGORIES */}
              {/* <Route path="/admin/categorias/crear" element={<CategoryForm />} />
              <Route path="/admin/categorias/editar/:id" element={<CategoryForm />} /> */}
              <Route path="/admin/categorias/detalle/:id" element={<AdminCategoryDetail />} />
              <Route path="/admin/categorias/:pageNumber?" element={<AdminCategories />} />
              {/* DESCUENTOS */}
              <Route path="/admin/descuentos/detalle/:id" element={<AdminDiscountDetail />} />
              <Route path="/admin/descuentos/:pageNumber?" element={<AdminDiscounts />} />
              {/* usuarios */}
              <Route path="/admin/usuarios/detalle/:id" element={<AdminDetailUser />} />
              <Route path="/admin/usuarios/:pageNumber?" element={<AdminUsers />} />
              {/* cupones */}
              <Route path="/admin/cupones/detalle/:id" element={<AdminDetailCoupons />} />
              <Route path="/admin/cupones/:pageNumber?" element={<AdminCoupons />} />
              {/* minijuegos */}
              <Route path="/admin/minijuegos/detalle/:id" element={<AdminDetailMinigame />} />
              <Route path="/admin/minijuegos/:pageNumber?" element={<AdminMinigameDashboard />} />
              {/* tienda de puntos */}
              <Route path="/admin/premios/detalle/:id" element={<AdminDetailRewards />} />
              <Route path="/admin/premios/:pageNumber?" element={<AdminRewardsDashboard />} />
              {/* auditoría */}
              <Route path="/admin/auditoria/detalle/:id" element={<AdminDetailLog/>} />
              <Route path="/admin/auditoria/:pageNumber?" element={<AdminLogDashboard />} />
              {/* ESTADISTICAS */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* CONFIG */}
              <Route path="/admin/config" element={<AdminConfig />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin', 'operator', 'carrier']} />}>
        <Route element={<MainLayout />}>
          <Route element={<PublicLayoutWithSpacer />}>
            <Route element={<AdminTitle />} >
              {/* ENVIOS */}
              <Route path="/admin/envios/detalle/:id" element={<AdminShippingDetail />} />
              <Route path="/admin/envios/:pageNumber?" element={<AdminShippings />} />
              {/* afiliados */}
              <Route path="/admin/afiliados/detalle/:id" element={<AdminDetailAffiliates />} />
              <Route path="/admin/afiliados/:pageNumber?" element={<AdminAffiliates />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* 4. MANEJO DE ERRORES */}
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/unauthorized" element={<ForbiddenPage />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}

export default AppRouter

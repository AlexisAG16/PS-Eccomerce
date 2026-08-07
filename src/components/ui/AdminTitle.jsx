import { Link, Outlet, useLocation } from "react-router";
import AccesosDirectosAdmin from "./AccesosDirectosAdmin";

const AdminTitle = () => {
  const { pathname } = useLocation();

  // 1. Lógica para generar el Título y la Descripción según la URL
  const getPageInfo = (path) => {
    if (path.includes('productos')) return { title: "Gestión de Stock", desc: "Base de datos de productos activa" };
    if (path.includes('ordenes')) return { title: "Libro de Órdenes", desc: "Monitoreo de pedidos en tiempo real" };
    if (path.includes('envios')) return { title: "Logística y Envíos", desc: "Seguimiento de despachos" };
    if (path.includes('dashboard')) return { title: "Panel Operativo", desc: "Terminal de estadísticas online" };
    if (path.includes('categorias')) return { title: "Categorías", desc: "Organización del catálogo" };
    if (path.includes('marcas')) return { title: "Marcas", desc: "Gestión de fabricantes" };
    if (path.includes('pagos')) return { title: "Pasarela de Pagos", desc: "Registro de transacciones" };
    if (path.includes('descuentos')) return { title: "Promociones", desc: "Gestión de cupones y ofertas" };
    if (path.includes('cupones')) return { title: "Cupones", desc: "Gestión de cupones" };
    if (path.includes('afiliados')) return { title: "Afiliados", desc: "Administración de afiliados" };
    if (path.includes('usuarios')) return { title: "Usuarios", desc: "Administración de usuarios registrados" };
    if (path.includes('premios')) return { title: "Premios", desc: "Gestión de recompensas" };
    if (path.includes('minijuegos')) return { title: "Minijuegos", desc: "Gestión de minijuegos" };
    if (path.includes('auditoria')) return { title: "Auditoría", desc: "Registro de auditoría" };
    return { title: "Administración", desc: "Panel de gestión central" };
  };

  const { title, desc } = getPageInfo(pathname);

  // 2. Generar Breadcrumbs automáticamente desde el path
  // Ejemplo: /admin/productos/editar/123 -> ["productos", "editar", "123"]
  const pathSegments = pathname.split('/').filter(seg => seg !== '' && seg !== 'admin');

  return (
    <main className="p-6 min-h-screen bg-brand-bg text-brand-text">
      <AccesosDirectosAdmin/>
      <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-brand-border pb-8">
        <div className="flex-1">
          <nav className="flex items-center gap-2 text-[10px] text-brand-text-muted uppercase tracking-[0.2em] mb-4 overflow-x-auto whitespace-nowrap">
            <Link to="/admin/dashboard" className="hover:text-brand-highlight transition-colors">Dashboard</Link>

            {pathSegments.map((segment, index) => {
              // Si el segmento es "detalle", no lo renderizamos en el breadcrumb
              if (segment === 'detalle') return null;

              const url = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;

              // Si el segmento es un ID de Mongo (24 caracteres), ponemos "Detalle"
              const label = segment.length > 20 ? "Ver Detalle" : segment;

              return (
                <div key={url} className="flex items-center gap-2">
                  <span className="text-brand-text-muted/50">/</span>
                  {isLast ? (
                    <span className="text-brand-highlight font-black italic">{label}</span>
                  ) : (
                    <Link to={url} className="hover:text-brand-highlight transition-colors">{label}</Link>
                  )}
                </div>
              );
            })}
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-brand-text uppercase italic tracking-tighter leading-none">
            {title}
          </h1>
        </div>

        <div className="flex items-center">
          <div className="bg-brand-primary text-brand-text px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] italic shadow-xl shadow-brand-primary/20 flex items-center gap-3 border border-brand-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {desc}
          </div>
        </div>
      </header>

      {/* Aquí se renderizarán todas las páginas de Admin */}
      <Outlet />
    </main>
  );
};

export default AdminTitle;

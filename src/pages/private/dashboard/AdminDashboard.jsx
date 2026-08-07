import { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../contexts/AuthContext';
import { FiLock } from 'react-icons/fi';

const AdminDashboard = () => {
  const { can, loading: authLoading, user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    summary: null,
    sales: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    if (!can('read:orders')) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAllStats = async () => {
      try {
        setLoading(true);
        const [resSummary, resSales, resTop] = await Promise.all([
          api.get('/stats/summary', { signal: controller.signal }),
          api.get('/stats/sales-chart', { signal: controller.signal }),
          api.get('/stats/top-products', { signal: controller.signal })
        ]);

        setStats({
          summary: resSummary.data.data,
          sales: resSales.data.data,
          topProducts: resTop.data.data
        });
      } catch (error) {
        if (error.name !== 'CanceledError') console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();

    return () => controller.abort();
  }, [authLoading, user, can]);

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-brand-bg">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );

  if (!can('read:orders')) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 bg-brand-surface rounded-2xl border border-brand-border shadow-inner">
        <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mb-6">
          <FiLock className="text-4xl text-brand-text-muted/60" />
        </div>
        <h2 className="text-xl font-black uppercase text-brand-text tracking-tighter">Area Restringida</h2>
        <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mt-2 max-w-xs text-center leading-relaxed">
          Tu nivel de acceso actual no permite visualizar metricas de rendimiento comercial.
        </p>
        <button
          onClick={() => window.location.href = '/admin/envios'}
          className="mt-8 px-8 py-4 bg-brand-accent text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-brand-accent-hover hover:scale-105 transition-transform"
        >
          Ir a Gestion de Envios
        </button>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <ClipLoader color="#3b82f6" size={60} />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-brand-text-muted animate-pulse">
        Sincronizando metricas comerciales...
      </p>
    </div>
  );

  const totalSales = stats.sales?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;
  const totalOrders = stats.sales?.reduce((acc, item) => acc + (item.orderCount || 0), 0) || 0;
  const lowStockItems = stats.summary?.lowStockItems || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section className="lg:col-span-12 bg-brand-primary text-brand-text p-8 rounded-2xl shadow-xl border border-brand-border">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-highlight mb-3">Panel comercial</p>
        <h1 className="text-3xl font-black tracking-tight">Resumen operativo sin graficos</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-text-muted">
          Vista simplificada para revisar ventas, ordenes y productos con bajo stock sin depender de visualizaciones.
        </p>
      </section>

      <section className="lg:col-span-4 bg-brand-surface p-6 rounded-2xl shadow-xl border border-brand-border">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted mb-2">Ingresos</p>
        <p className="text-3xl font-black text-brand-text">${totalSales.toLocaleString('es-AR')}</p>
      </section>

      <section className="lg:col-span-4 bg-brand-surface p-6 rounded-2xl shadow-xl border border-brand-border">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted mb-2">Ordenes</p>
        <p className="text-3xl font-black text-brand-text">{totalOrders.toLocaleString('es-AR')}</p>
      </section>

      <section className="lg:col-span-4 bg-brand-surface p-6 rounded-2xl shadow-xl border border-brand-border">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted mb-2">Stock critico</p>
        <p className="text-3xl font-black text-brand-danger">{lowStockItems.length}</p>
      </section>

      <section className="lg:col-span-6 bg-brand-surface p-8 rounded-2xl shadow-xl border border-brand-border">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted mb-6">Productos destacados por venta</h2>
        <div className="space-y-3">
          {stats.topProducts?.length > 0 ? (
            stats.topProducts.map((product) => (
              <div key={product._id || product.name} className="flex items-center justify-between gap-4 border-b border-brand-border pb-3">
                <span className="text-sm font-bold text-brand-text line-clamp-1">{product.name}</span>
                <span className="text-xs font-black text-brand-accent">{product.salesCount} ventas</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] uppercase font-black text-brand-text-muted/60">Sin datos de ventas</p>
          )}
        </div>
      </section>

      <section className="lg:col-span-6 bg-brand-surface p-8 rounded-2xl shadow-xl border border-brand-border">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted mb-6">Alertas de stock</h2>
        <div className="space-y-3">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <div key={item._id || item.name} className="flex items-center justify-between gap-4 border-b border-brand-border pb-3">
                <span className="text-sm font-bold text-brand-text line-clamp-1">{item.name}</span>
                <span className="text-xs font-black text-brand-danger">{item.stock} unidades</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] uppercase font-black text-brand-text-muted/60">Sin alertas activas</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import InfoRow from "../../../components/detail/InfoRow";
import { FiActivity, FiLayers, FiUser, FiMapPin, FiCpu, FiClock } from "react-icons/fi";

const AdminLogDetail = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLog = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/logs/${id}`);
      setLog(response.data.data);
    } catch (error) {
      toast.error("Error al obtener el registro de auditoría");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-brand-bg">
      <ClipLoader color="#6064bf" size={50} />
      <p className="mt-4 text-[10px] font-black text-brand-text uppercase tracking-widest italic animate-pulse">Consultando archivos de auditoría...</p>
    </div>
  );

  if (!log) return <div className="pt-40 text-center uppercase font-black italic text-brand-text">Log no encontrado</div>;

  return (
    <AdminDetailLayout
      title={log.action}
      subtitle={`ID de Evento: ${log._id}`}
    // No hay headerActions porque los logs no se editan
    >
      {/* MÉTRICAS RÁPIDAS */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <MetricItem label="Entidad" value={log.entity} icon={FiLayers} colorClass="text-brand-text" />
        <MetricItem label="Usuario IP" value={log.ip || "Local"} icon={FiMapPin} colorClass="text-brand-text" />
        <MetricItem label="Fecha" value={new Date(log.createdAt).toLocaleDateString()} icon={FiClock} colorClass="text-brand-text" />
        <MetricItem label="Admin" value={log.adminId?.firstName || "Sistema"} icon={FiUser} colorClass="text-brand-text" />
      </div>

      {/* COLUMNA IZQUIERDA: DIFERENCIA DE DATOS (EL "DIFF") */}
      <main className="lg:col-span-8 space-y-6">
        <DetailCard title="Comparativa de Cambios (JSON Diff)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VALOR ANTERIOR */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Estado Anterior</span>
              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 overflow-x-auto">
                <pre className="text-[11px] font-mono text-red-700">
                  {log.details?.oldValue ? JSON.stringify(log.details.oldValue, null, 2) : "// Sin datos previos"}
                </pre>
              </div>
            </div>

            {/* VALOR NUEVO */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Estado Nuevo</span>
              <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 overflow-x-auto">
                <pre className="text-[11px] font-mono text-green-700">
                  {log.details?.newValue ? JSON.stringify(log.details.newValue, null, 2) : "// Sin cambios registrados"}
                </pre>
              </div>
            </div>
          </div>
        </DetailCard>

        <DetailCard title="Metadatos Adicionales">
          <pre className="text-xs bg-ps-claro/10 p-6 rounded-3xl text-brand-text border border-brand-secondary/20">
            {JSON.stringify(log.metadata || {}, null, 2)}
          </pre>
        </DetailCard>
      </main>

      {/* DERECHA: INFORMACIÓN DEL AGENTE Y ENTORNO */}
      <aside className="lg:col-span-4 space-y-6">
        <DetailCard title="Responsable" dark>
          <InfoRow label="Nombre" value={`${log.adminId?.firstName || 'Auto'} ${log.adminId?.lastName || 'Process'}`} dark />
          <InfoRow label="Email" value={log.adminId?.email || "system@Patrician Softwaregame.com"} dark />
          <InfoRow label="ID de Referencia" value={log.entityId || "N/A"} dark />
        </DetailCard>

        <DetailCard title="Dispositivo y Origen">
          <div className="flex items-start gap-4 p-2">
            <FiCpu className="text-brand-text mt-1" size={24} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-brand-text mb-1">User Agent</span>
              <p className="text-[11px] leading-relaxed text-brand-text italic">
                {log.userAgent || "No registrado"}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-secondary/20">
            <InfoRow label="Protocolo IP" value={log.ip} />
            <InfoRow label="Timestamp" value={new Date(log.createdAt).toLocaleTimeString()} />
          </div>
        </DetailCard>
      </aside>
    </AdminDetailLayout>
  );
};

export default AdminLogDetail;

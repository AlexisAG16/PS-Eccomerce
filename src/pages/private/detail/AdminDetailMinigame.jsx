import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Unity } from "react-unity-webgl";
import { toast } from "react-toastify";
import api from "../../../api/axiosConfig";
import { AuthContext } from "../../../contexts/AuthContext";
import { RouletteSectionInput, WeightListInput } from "./AdminMinigameInputs";
import { MINIGAMES_CONFIG } from "../../../config/minigamesConfig";
import { useUnityGame } from "../../../hooks/useUnityGame";

const renderField = (field, config, updateConfigField) => {
  // ✅ CORRECCIÓN: Resuelve dinámicamente si el path es "matchPoints" o "config.time3Stars"
  const getValueByPath = (obj, path) => {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let current = obj.config; // Arrancamos parados dentro del objeto config de tu DB

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      // Si el path repite "config.", lo salteamos para no duplicar la ruta
      if (part === 'config') continue;
      current = current[part];
    }
    return current;
  };

  const value = getValueByPath(config, field.path);

  switch (field.type) {
    case 'weight-list':
      // Le pasamos el array de premios (config.config.prizes) directo al input mutado
      return (
        <WeightListInput
          value={value || []}
          onChange={(val) => updateConfigField(field.path, val)}
        />
      );

    case 'roulette-section':
      // OJO: Si 'sections' en tu DB es un array, tenemos que renderizar un selector por cada porción de la ruleta
      return (
        <div className="space-y-3">
          {Array.isArray(value) ? (
            value.map((section, idx) => (
              <div key={idx} className="relative border-l-4 border-indigo-500 pl-2">
                <span className="text-[9px] font-black text-indigo-400 block mb-1">Porción #{idx + 1}</span>
                <RouletteSectionInput
                  value={section}
                  onChange={(updatedSection) => {
                    const newSections = [...value];
                    newSections[idx] = updatedSection;
                    updateConfigField(field.path, newSections);
                  }}
                />
              </div>
            ))
          ) : (
            // Fallback por si tu esquema de ruleta fuera un objeto único de configuración global
            <RouletteSectionInput
              value={value}
              onChange={(val) => updateConfigField(field.path, val)}
            />
          )}
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          step={field.step || 1}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none font-bold text-zinc-800"
          value={value ?? 0}
          onChange={(e) => updateConfigField(field.path, parseFloat(e.target.value) || 0)}
        />
      );

    default:
      return <span className="text-xs text-gray-400 italic">Tipo de campo no soportado</span>;
  }
};

const AdminDetailMinigame = () => {
  const { id } = useParams();
  const { user, loading: userLoading } = useContext(AuthContext); // Corrección: userLoading
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const gameInfo = MINIGAMES_CONFIG[id];

  const { unityProvider, isLoaded, loadingProgression } = useUnityGame(id, {
    userId: user?._id,
    userRole: user?.role?.name
  });

  // CARGA DE CONFIGURACIÓN
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/games/config/${id}`);
        if (response.data && response.data[id]) {
          setConfig(response.data[id]);
        } else {
          toast.error("Configuración no encontrada para este juego");
        }
      } catch (error) {
        toast.error("Error al cargar configuración");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchConfig();
  }, [id]);

  // ACTUALIZACIÓN DINÁMICA DEL ESTADO
  const updateConfigField = (path, newValue) => {
    setConfig(prev => {
      const updatedConfig = { ...prev };

      if (path.includes('.')) {
        // Es un campo anidado (ej: "config.time3Stars")
        const parts = path.split('.');
        let current = updatedConfig.config = { ...updatedConfig.config };

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (part === 'config') continue; // Evitamos duplicar la raíz
          current[part] = { ...current[part] };
          current = current[part];
        }

        const lastPart = parts[parts.length - 1];
        current[lastPart] = newValue;
      } else {
        // Es un campo plano tradicional (ej: "matchPoints")
        updatedConfig.config = {
          ...updatedConfig.config,
          [path]: newValue
        };
      }

      return updatedConfig;
    });
  };

  // PERSISTENCIA EN BACKEND
  const handleSaveConfig = async () => {
    try {
      const { _id, updatedAt, createdAt, ...cleanConfig } = config;
      const response = await api.put(`/games/config/${id}`, cleanConfig);

      if (response.data && response.data.config) {
        // ✅ Forzamos al estado de React a usar lo que el backend realmente guardó
        setConfig(response.data.config);
        toast.success("¡Configuración guardada e impactada en tiempo real!");
      }
    } catch (error) {
      toast.error("Error al guardar cambios");
    }
  };

  if (userLoading || loading) return <div className="p-10 text-center font-bold text-indigo-600">Cargando panel de control...</div>;
  if (!gameInfo) return <div className="p-10 text-center">Juego no registrado en la configuración.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-zinc-800 uppercase tracking-tight">
            Control de Juego: <span className="text-indigo-600">{gameInfo.title}</span>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* VISOR DE UNITY */}
          <div
            className="flex-1 bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden relative border-4 border-white"
            style={{ aspectRatio: gameInfo.aspectRatio || "16/9", maxHeight: "75vh" }}
          >
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 z-10">
                <div className="w-64 bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                  />
                </div>
                <p className="text-xs uppercase tracking-widest font-bold animate-pulse">Cargando Assets...</p>
              </div>
            )}
            <Unity unityProvider={unityProvider} className="w-full h-full" />
          </div>

          {/* EDITOR DINÁMICO */}
          <div className="w-full lg:w-[400px] flex flex-col">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-black mb-4 border-b pb-2 text-zinc-400 uppercase tracking-tighter">Parámetros del Sistema</h2>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {gameInfo.fields.map((field) => (
                  <div key={field.path}>
                    <label className="block text-[11px] font-black text-indigo-400 uppercase mb-2 tracking-widest">
                      {field.label}
                    </label>

                    {/* Aquí usas la función centralizada */}
                    {renderField(field, config, updateConfigField)}

                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailMinigame;
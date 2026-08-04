import { useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";

export const useUnityGame = (gameName, additionalData = {}) => {
  // 1. Inyección de variables globales para Unity
  useEffect(() => {
    window.unityUserId = additionalData.userId;
    window.unitySessionId = additionalData.sessionId;
    window.unityUserRole = additionalData.userRole || 'Usuario';
    window.VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1";
  }, [additionalData]);

  // 2. Configuración centralizada de rutas
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: `/minigames/${gameName}/Build/${gameName}.loader.js`,
    dataUrl: `/minigames/${gameName}/Build/${gameName}.data.br`,
    frameworkUrl: `/minigames/${gameName}/Build/${gameName}.framework.js.br`,
    codeUrl: `/minigames/${gameName}/Build/${gameName}.wasm.br`,
    decompressorUrl: null,
  });

  return { unityProvider, isLoaded, loadingProgression };
};
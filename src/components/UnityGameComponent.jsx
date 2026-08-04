import { useContext, useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { AuthContext } from "../contexts/AuthContext";
import { useUnityGame } from "../hooks/useUnityGame";

const UnityGameComponent = ({ gameName, sessionId }) => {
  const { user } = useContext(AuthContext);

  const { unityProvider, isLoaded, loadingProgression } = useUnityGame(gameName, {
    userId: user?._id,
    sessionId: sessionId,
    userRole: user?.role?.name
  });

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white z-10">
          <div className="w-64 bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${Math.round(loadingProgression * 100)}%` }}
            />
          </div>
          <p className="text-xs uppercase tracking-widest font-bold">Cargando...</p>
        </div>
      )}
      <Unity unityProvider={unityProvider} className="w-full h-full" />
    </div>
  );
};

export default UnityGameComponent;
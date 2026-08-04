import { useContext } from "react"
import { CiLogout } from "react-icons/ci";
import { AuthContext } from "../../contexts/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button
      onClick={() => logout()}
      className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition shadow-lg flex items-center justify-center border border-gray-100 cursor-pointer group relative"
      title="Cerrar Sesión"
    >
      <CiLogout size={22} />
      {/* Tooltip opcional para Logout */}
      <span className="absolute top-14 right-0 scale-0 group-hover:scale-100 transition-all bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
        Cerrar Sesión
      </span>
    </button>
  )
}
export default LogoutButton
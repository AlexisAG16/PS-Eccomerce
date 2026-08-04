import { useNavigate } from "react-router";

const VerMasButton = ({ texto = "Ver más", to = "/catalogo" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="inline-flex items-center justify-center bg-brand-highlight text-brand-primary font-semibold text-[11px] sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg shadow-sm hover:opacity-90 transition cursor-pointer"
    >
      {texto}
    </button>
  );
};

export default VerMasButton;

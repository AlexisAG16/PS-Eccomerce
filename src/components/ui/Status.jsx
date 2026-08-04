const BadgeStatus = ({ status }) => {
  const styles = {
    "en camino": "bg-blue-100 text-blue-800",
    "retirar en tienda": "bg-purple-100 text-purple-800",
    "entregado": "bg-green-100 text-green-800",
    "fallido": "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status.toLowerCase()]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default BadgeStatus;
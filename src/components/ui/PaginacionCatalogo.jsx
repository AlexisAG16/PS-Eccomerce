const PaginacionCatalogo = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-12 p-6 bg-brand-surface border border-brand-border rounded-2xl shadow-xl shadow-black/20">
      <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest mb-4 md:mb-0">
        Mostrando <span className="text-brand-highlight">{pagination.total > 0 ? pagination.page * 15 - 14 : 0}</span>
        - <span className="text-brand-highlight">{Math.min(pagination.page * 15, pagination.total)}</span>
        de <span className="text-brand-highlight">{pagination.total}</span> productos
      </p>

      <div className="flex gap-3 items-center">
        <button
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="px-6 py-2 bg-brand-primary border border-brand-border text-brand-text rounded-xl disabled:opacity-30 hover:bg-brand-accent transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <div className="bg-brand-bg px-5 py-2 rounded-xl border border-brand-border shadow-inner">
          <span className="text-[10px] font-black text-brand-text uppercase">
            {pagination.page} <span className="mx-1 opacity-20">/</span> {pagination.totalPages}
          </span>
        </div>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="px-6 py-2 bg-brand-primary border border-brand-border text-brand-text rounded-xl disabled:opacity-30 hover:bg-brand-accent transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PaginacionCatalogo;

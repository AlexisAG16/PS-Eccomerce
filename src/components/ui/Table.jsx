import { Link } from 'react-router';
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai";
import { MdRestore } from "react-icons/md";

const DefaultCell = ({ col, value, row, route }) => {
  if (value === null || value === undefined) return <span className="text-gray-300">-</span>;

  if (col.format === "date") {
    const date = new Date(value);
    return (
      <div className="flex flex-col leading-tight">
        <span className="text-gray-700 font-medium">{date.toLocaleDateString('es-AR')}</span>
        <span className="text-[10px] text-gray-400">{date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
      </div>
    );
  }

  if (col.format === "currency") {
    return <span className="font-mono font-bold text-gray-700">${value?.toLocaleString('es-AR')}</span>;
  }

  if (col.field === "_id") {
    return (
      <Link
        to={`${route}/detalle/${value}`}
        className="text-brand-primary font-mono text-[10px] rounded flex flex-col items-center group/id"
      >
        #{value.slice(-6)}
        <span className='hover:underline rounded-2xl p-1 font-bold bg-brand-primary text-brand-surface text-center uppercase text-[8px] transition-colors'>
          Ver Detalles
        </span>
      </Link>
    );
  }

  if (col.format === "image") {
    const images = Array.isArray(value) ? value : [value];
    const displayImages = images.slice(0, 3);

    return (
      <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
        {displayImages.map((img, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-50 shrink-0"
          >
            <img
              src={img?.xs || img || "https://via.placeholder.com/100"}
              alt={`p-${i}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        {images.length > 3 && (
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm">
            <span className="text-[8px] font-black text-gray-500">+{images.length - 3}</span>
          </div>
        )}
      </div>
    );
  }

  if (col.format === "categories-tags") {
    if (!value || value.length === 0) return <span className="text-gray-300 italic text-[10px]">Sin categoría</span>;

    return (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        {value.map((cat, index) => (
          <Link
            key={cat._id}
            to={`/admin/categorias/${cat._id}`}
            onClick={(e) => e.stopPropagation()}
            className={`text-[9px] font-black px-2.5 py-1 rounded-lg transition-all uppercase border flex items-center 
            ${index === 0
                ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white'
                : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-brand-primary'}`}
          >
            {index === 0 && <span className="mr-1 text-[10px]">●</span>}
            {cat.categoryName}
          </Link>
        ))}
      </div>
    );
  }

  return <span className="text-gray-600">{value?.toString()}</span>;
};

const GenericTable = ({
  columns, data, route, onEdit, onDelete, pagination, loading, handleFilterChange, filters, isEditable = true, isDeletable = true }) => {

  const getValue = (obj, path) => {
    if (!path) return null;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const onPageChange = (newPage) => {
    handleFilterChange('page', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (col) => {
    if (!col.field || col.sortable === false) return;

    const isCurrentField = filters?.sortBy === col.field;
    const newOrder = (isCurrentField && filters?.order === 'asc') ? 'desc' : 'asc';

    handleFilterChange({
      sortBy: col.field,
      order: newOrder
    });
  };

  return (
    <div className="overflow-x-auto bg-brand-bg rounded-4xl shadow-sm border border-brand-secondary/30">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-brand-primary">
          <tr>
            {columns.map((col, index) => {
              const isSorted = filters?.sortBy === col.field;
              return (
                <th
                  key={index}
                  className={`p-5 font-black text-brand-surface text-[10px] uppercase tracking-[0.2em] border-b border-white/5 transition-colors relative group 
    ${(!col.field || col.sortable === false) ? 'cursor-default' : 'cursor-pointer hover:bg-white/10'}`}
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <span className={`text-[10px] transition-all ${isSorted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-30'}`}>
                      {filters?.order === 'asc' && isSorted ? '▲' : '▼'}
                    </span>
                  </div>
                </th>
              );
            })}
            {(isEditable || isDeletable) && (
              <th className="p-5 font-black text-brand-surface text-[10px] uppercase tracking-[0.2em] text-right border-b border-white/5"> Acciones </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-brand-secondary/20">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row._id}
                className={`
    transition-all duration-300 group
    ${row.isActive === false ? 'opacity-50 grayscale bg-brand-bg/50' : 'bg-white'}
    hover:bg-ps-claro/20
  `}
              >
                {columns.map((col, index) => {
                  const value = getValue(row, col.field);
                  return (
                    <td key={index} className="p-5 text-sm transition-colors group-hover:bg-brand-primary/5">
                      {col.render ? (
                        col.render(value, row, handleFilterChange)
                      ) : (
                        <DefaultCell col={col} value={value} row={row} route={route} />
                      )}
                    </td>
                  );
                })}

                {(isEditable || isDeletable) && (
                  <td className="p-5 text-right space-x-4 border-l-2 border-transparent group-hover:border-brand-primary transition-colors group-hover:bg-brand-primary/5">
                    {isEditable && (
                      onEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="text-brand-primary hover:text-brand-text cursor-pointer transition-colors"
                        >
                          <AiTwotoneEdit size={20} />
                        </button>
                      ) : (
                        <Link
                          to={`${route}/editar/${row._id}`}
                          className="text-brand-primary hover:text-brand-text transition-colors"
                        >
                          <AiTwotoneEdit size={20} />
                        </Link>
                      )
                    )}

                    <button
                      className='text-brand-primary hover:text-brand-text cursor-pointer transition-colors'
                      onClick={() => onDelete(row._id, row.categoryName || row.name || "este registro", row.isActive)}
                    >
                      {row.isActive !== false ? <AiTwotoneDelete size={20} /> : <MdRestore size={20} />}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-24 text-center">
                <div className="flex flex-col items-center opacity-30 text-brand-text">
                  <span className="text-4xl mb-2">🔍</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No hay datos para mostrar</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!loading && pagination?.totalPages > 1 && (
        <div className="flex justify-between items-center p-6 bg-ps-claro/10 border-t border-brand-secondary/20 rounded-b-4xl">
          <p className="text-[10px] text-brand-text font-black uppercase tracking-widest">
            Sincronizados <span className="text-brand-primary">{data.length}</span> de <span className="text-brand-primary">{pagination.total}</span>
          </p>

          <div className="flex gap-2 items-center">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:shadow-md transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
              title="Primero"
            >
              «
            </button>

            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-4 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:shadow-md transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-inner">
              <span className="text-[10px] font-black text-brand-primary uppercase">
                {pagination.page} <span className="mx-1 opacity-20">/</span> {pagination.totalPages}
              </span>
            </div>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-4 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:shadow-md transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
            >
              Siguiente
            </button>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange(pagination.totalPages)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:shadow-md transition-all text-[10px] font-black uppercase tracking-tighter cursor-pointer disabled:cursor-not-allowed"
              title="Último"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTable;

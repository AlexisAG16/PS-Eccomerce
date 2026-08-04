const AdminDetailLayout = ({ title, subtitle, headerActions, children }) => (
  <div className="animate-fadeIn">
    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-2">{subtitle}</p>
        <h1 className="text-4xl font-black text-brand-primary uppercase italic tracking-tighter leading-none">{title}</h1>
      </div>
      <div className="flex gap-3 no-print">{headerActions}</div>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {children}
    </div>
  </div>
);

export default AdminDetailLayout;
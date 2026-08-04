const ContactForm = () => {
  return (
    <div
      id="contacto"
      className="bg-brand-surface p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto w-full border border-brand-border scroll-mt-40"
    >
      <p className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.28em] mb-3">
        Contacto
      </p>
      <h2 className="text-xl font-black tracking-tight text-brand-text mb-2 uppercase">
        Hablemos de tu catalogo
      </h2>
      <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">
        Dejanos tus datos y una idea general del proyecto para preparar una propuesta visual adaptable.
      </p>

      <form className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="NOMBRE"
          className="w-full bg-brand-bg border border-brand-border py-3 px-4 rounded-xl text-[14px] font-bold outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-brand-text-muted text-brand-text"
          required
        />

        <input
          type="email"
          placeholder="EMAIL"
          className="w-full bg-brand-bg border border-brand-border py-3 px-4 rounded-xl text-[14px] font-bold outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-brand-text-muted text-brand-text"
          required
        />

        <textarea
          placeholder="MENSAJE"
          className="w-full bg-brand-bg border border-brand-border py-3 px-4 rounded-xl text-[14px] font-bold h-24 resize-none outline-none focus:ring-1 focus:ring-brand-accent placeholder:text-brand-text-muted text-brand-text"
          required
        />

        <button
          type="submit"
          className="mt-1 w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] cursor-pointer"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default ContactForm;

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);

export const DatePickerField = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">{label}</label>
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date)}
        dateFormat="dd/MM/yyyy"
        locale="es"
        placeholderText="dd/mm/aaaa"
        className="w-full border-2 border-brand-border bg-brand-bg text-brand-text placeholder:text-brand-text-muted rounded-xl p-3 outline-none focus:border-brand-highlight"
      />
    </div>
  );
};

import { Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneField = ({ control, name, label }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest ml-1">{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ validate: (val) => !val || isValidPhoneNumber(val) }}
      render={({ field: { onChange, value } }) => (
        <PhoneInput
          international
          defaultCountry="AR"
          value={value}
          onChange={onChange}
          className="border-2 border-brand-border rounded-2xl p-4 focus-within:border-brand-highlight outline-none font-bold text-brand-text shadow-sm transition-all"
        />
      )}
    />
  </div>
);

export default PhoneField;

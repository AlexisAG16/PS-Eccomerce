import { Controller } from "react-hook-form";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";

const PhoneController = ({ control, name, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="phone-input-container">
            <IntlTelInput
              // Usamos el prop 'value' para controlar el estado. 
              // Si value es undefined, pasamos un string vacío "" para que no falle.
              value={value || ""}
              onChangeNumber={(val) => onChange(val)}
              initialCountry="ar"
              nationalMode={false}
              // separateDialCode={true}
              className="w-full"
            />
          </div>
        )}
      />
    </div>
  );
};

export default PhoneController;
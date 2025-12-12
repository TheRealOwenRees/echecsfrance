import { useState } from "react";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Control, useController } from "react-hook-form";

interface DateCalendarProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const DateCalendar = ({ control, name, label }: DateCalendarProps) => {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const [open, setOpen] = useState(false);

  const handleSelect = (newDate: Date) => {
    onChange(newDate);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm shadow-sm focus:border-b-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
        value={value ? format(value, "dd MMMM yyyy", { locale: fr }) : ""}
        onClick={() => setOpen((prev) => !prev)}
        placeholder="Sélectionner une date"
      />
      {open && (
        <div className="absolute z-10 mt-1 translate-x-[-50%] transform bg-white shadow-lg md:translate-x-0">
          <Calendar onChange={handleSelect} date={value} locale={fr} />
        </div>
      )}
    </div>
  );
};

export default DateCalendar;

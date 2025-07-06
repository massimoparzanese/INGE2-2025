import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CalendarioFechaNacimiento({
  value,
  onChange,
  placeholder = 'Selecciona la fecha',
  maxDate = new Date(),
  minDate = null,
  yearRange = 100
}) {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      placeholderText={placeholder}
      className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
      dateFormat="dd/MM/yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      maxDate={maxDate}
      minDate={minDate}
      yearDropdownItemNumber={yearRange}
      popperPlacement="top-start"
    />
  );
}

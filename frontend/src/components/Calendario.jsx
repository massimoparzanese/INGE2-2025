import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MiCalendario({setFec = {}, minimo = null}) {
  const [fecha, setFecha] = useState(null);
  const hoy = minimo || new Date();
  return (
    <div className='pt-4'>
      <DatePicker
        selected={fecha}
        minDate={hoy}
        onChange={(date) => {
            setFecha(date) 
            setFec(date)}}
        placeholderText="Selecciona una fecha"
        className="border rounded p-2"
        dateFormat="dd/MM/yyyy"
      />
      {fecha && <p>Fecha seleccionada: {fecha.toLocaleDateString()}</p>}
    </div>
  );
}

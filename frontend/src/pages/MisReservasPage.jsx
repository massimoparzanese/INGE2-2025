import { useState } from "react";
import AgregarConductorModal from "../components/AgregarConductorModal";
const reservas = [
  {
    id: 1,
    patente: 'ABC123',
    fechaInicio: '2025-06-10',
    fechaFin: '2025-06-12',
    estado: 'activa',
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      capacidad: 5,
      foto: 'https://via.placeholder.com/150?text=Toyota+Corolla',
    },
    conductor: null,
  },
  {
    id: 2,
    patente: 'XYZ789',
    fechaInicio: '2025-06-05',
    fechaFin: '2025-06-07',
    estado: 'cancelada',
    vehiculo: {
      marca: 'Ford',
      modelo: 'Fiesta',
      capacidad: 4,
      foto: 'https://via.placeholder.com/150?text=Ford+Fiesta',
    },
    conductor: null,
  },
];

export default function MisReservas() {
  const cancelarReserva = (id) => {
    console.log('Cancelar reserva con ID:', id);
  };
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Historial de Reservas</h2>
      <section className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
      <div className="space-y-6">
        {reservas.map((reserva) => (
          <div
            key={reserva.id}
            className={`flex flex-col md:flex-row gap-4 items-start p-4 rounded-xl border transition-shadow hover:shadow ${
              reserva.estado === 'cancelada'
                ? 'bg-red-100 border-red-300'
                : 'bg-white border-gray-200'
            }`}
          >
            <img
              src={reserva.vehiculo.foto}
              alt={`${reserva.vehiculo.marca} ${reserva.vehiculo.modelo}`}
              className="w-36 h-24 object-cover rounded-lg border"
            />

            <div className="flex-1 space-y-1">
              <p className="text-lg font-semibold text-gray-800">
                {reserva.vehiculo.marca} {reserva.vehiculo.modelo} - {reserva.vehiculo.capacidad} personas
              </p>
              <p className="text-sm text-gray-700">
                Patente: <span className="font-medium">{reserva.patente}</span>
              </p>
              <p className="text-sm text-gray-700">
                Desde: {reserva.fechaInicio} | Hasta: {reserva.fechaFin}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                Estado:{' '}
                <span
                  className={`font-semibold ${
                    reserva.estado === 'cancelada'
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {reserva.estado}
                </span>
              </p>

              {reserva.conductor  ? (
                <p className="text-sm text-gray-700">
                  Conductor: <span className="font-medium">{reserva.conductor.nombre}</span> (DNI: {reserva.conductor.dni})
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">Sin conductor asignado</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2 md:mt-0 md:ml-auto">
              {reserva.estado === 'activa' && (
                <button
                  onClick={() => cancelarReserva(reserva.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Cancelar
                </button>
              )}
              {!reserva.conductor && reserva.estado !== 'cancelada' && (
                <button
                  onClick={() => setModalAbierto(true)}
                  className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Agregar Conductor
                </button>
              )}
            </div>
          </div>
        ))}
        {modalAbierto && (
                <AgregarConductorModal
                  onCerrar={() => setModalAbierto(false)}
                />
              )}
      </div>
      </section>
    </div>
  );
}

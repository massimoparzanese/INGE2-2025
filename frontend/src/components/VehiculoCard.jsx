//CHEQUEAR SI SE USA, SINO BORRAR

import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextFunct';

export default function VehiculoCard({ vehiculo, onDelete }) {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <div className="p-4 rounded-lg border cursor-pointer flex gap-4 items-center transition-all">
      <img
        src={vehiculo.foto}
        alt={vehiculo.Modelo?.nombre || 'Vehículo'}
        className="w-34 h-16 object-cover rounded-md border"
      />
      <div>
        <p className="font-semibold text-lg">{vehiculo.Modelo?.Marca?.nombre}</p>
        <p className="text-sm text-gray-600">Modelo: {vehiculo.Modelo?.nombre}</p>
        <p className="text-sm text-gray-600">Año: {vehiculo.anio}</p>
        <p className="text-sm text-gray-600">Capacidad: {vehiculo.capacidad} personas</p>
        <p className="text-sm text-gray-600">Precio por día (USD): {vehiculo.precio}</p>
        <p className="text-sm text-gray-600">Km: {vehiculo.kms}</p>
        <p className="text-sm text-gray-600">Sucursal: {vehiculo.sucursal}</p>
      </div>

      {/* Acción de administración solo para admins */}
      {isAuthenticated && role === 'admin' && (
        <div className="relative w-full right-0 grid col-span-4 z-10">
          <div className="absolute right-0 flex gap-2 -translate-y-2">
            <Link
              to={`/admin/editar-vehiculo/${vehiculo.patente}`}
              className="px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300"
            >
              <PencilIcon />
            </Link>
            <div
              className="px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:cursor-pointer hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300"
              onClick={() => onDelete(vehiculo.patente)}
            >
              <Trash2Icon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
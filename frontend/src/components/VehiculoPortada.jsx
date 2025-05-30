import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Link} from 'react-router-dom';
export default function VehiculoPortada(vehiculo, i){
    console.log(vehiculo)
    const handleDeleteWarning = (vehiculo) => {
        const [confirmationModal, setConfirmationModal] = useState(false);
        const [targetVehiculo, setTargetVehiculo] = useState({});

        // Abrir modal de confirmación para eliminar la novedad
        setTargetVehiculo(vehiculo);
        setConfirmationModal(true);
    }
    return (
        <div
                  key={i}
                  className={`p-4 rounded-lg border cursor-pointer flex gap-4 items-center transition-all`}
                >
                  <img
                    src={vehiculo.vehiculo.foto}
                    alt={vehiculo.vehiculo.modelo}
                    className="w-34 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-semibold text-lg">{vehiculo.vehiculo.modelo}</p>
                    <p className="text-sm text-gray-600">Capacidad:{vehiculo.vehiculo.capacidad}</p>
                    <p className="text-sm text-gray-600">Km: {vehiculo.vehiculo.kms}</p>
                    <p className="text-sm text-gray-600">{vehiculo.vehiculo.sucursal}</p>
                  </div>
                  <div className={`relative w-full right-0 grid col-span-4 z-10`}>
                    <div className={`absolute right-0 flex gap-2 -translate-y-2`}>
                        <Link to={`/`}
                            state={{ vehiculo: vehiculo }}  // Pasa el objeto 'content' completo
                            className={`px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300`}>
                            <PencilIcon />
                        </Link>
                        <div className={`px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:cursor-pointer hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300`} onClick={() => handleDeleteWarning(vehiculo)}>
                            <Trash2Icon />
                        </div>
                    </div>
                </div>
        </div>
    )

}
import {useState, useEffect} from "react";
import Calendario from "../components/Calendario.jsx"
import { useSucursalesFetch } from "../hooks/useSucursalesFetch.jsx";
export default function FormReserva (){
  const {sucursales,cargando} = useSucursalesFetch();
  const [fechaInicio, setFechaInicio] = useState(false);
  const [fechaFin, setFechaFin] = useState(false);
   const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [accept, setAccept] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const handleSeleccionar = (sucursal) => {
    setSucursalSeleccionada(sucursal);
  };
  useEffect(() => {
    if(!accept && !sucursalSeleccionada && !fechaInicio && !fechaFin) return;
      const fetchVehiculos = async () => {
        try {
          const response = await fetch(`http://localhost:3001/reservas/disponibles`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sucursal: sucursalSeleccionada.nombre,
              fechaInicio: fechaInicio,
              fechaFin: fechaFin
            }),
          });

          if (!response.ok) throw new Error('Error en la respuesta de la API');

          const data = await response.json();

          if (data) {
            setVehicles(data.disponibles || []);
          }
        } catch (e) {
          console.error('Error al obtener vehiculos:', e);
        }
      };

      fetchVehiculos();
    }, [accept, sucursalSeleccionada, fechaInicio, fechaFin]);

    return(
     
    <div className="flex justify-center items-center min-h-screen ">
    <div className="bg-green-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <h2 className="text-xl font-semibold mb-4">Reservar un Vehículo</h2>
       {!accept ? (
      <>
       

        {cargando ? (
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Cargando sucursales...</p>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : sucursales.length > 0 ? (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {sucursales.map(sucursal => (
              <li
                key={sucursal.nombre}
                onClick={() => handleSeleccionar(sucursal)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  sucursalSeleccionada === sucursal
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium">{sucursal.nombre}</p>
                <p className="text-sm text-gray-600">{sucursal.direccion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-medium">No hay sucursales disponibles</p>
        )}

        {sucursalSeleccionada && (
          <>
            <div className="mt-4 p-4 bg-blue-100 rounded-md text-center">
              <p className="text-blue-700 font-medium">
                Sucursal seleccionada: {sucursalSeleccionada.nombre}
              </p>
              <p className="text-sm text-blue-600">{sucursalSeleccionada.direccion}</p>
            </div>
            <Calendario setFec={setFechaInicio} />
          </>
        )}

        {fechaInicio && (
          <Calendario setFec={setFechaFin} minimo={fechaInicio} />
        )}

        {fechaFin && (
          <button
            onClick={() => setAccept(true)}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Aceptar
          </button>
        )}
      </>
    ) : (
      <div className="text-center">
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {vehicles.map(vehicle => (
            <li
              key={vehicle.modelo + vehicle.kms} // Usá otra clave si no usás la patente
              onClick={() => handleSeleccionar(vehicle)}
              className="p-4 rounded-lg border cursor-pointer transition-colors border-gray-200 hover:bg-gray-100 flex gap-4"
            >
              <img
                src={vehicle.foto}
                alt={`Foto del ${vehicle.Modelo.marca} ${vehicle.modelo}`}
                className="w-32 h-20 object-cover rounded"
              />
              <div>
                <p className="font-medium text-lg">{vehicle.Modelo.marca} {vehicle.modelo}</p>
                <p className="text-sm text-gray-600">Capacidad: {vehicle.capacidad} personas</p>
                <p className="text-sm text-gray-600">Kilómetros: {vehicle.kms.toLocaleString()} km</p>
              </div>
            </li>
          ))}
        </ul>

      </div>
    )}
      </div>
    </div>


  
  )
}


import {useState, useEffect} from "react";
import Calendario from "../components/Calendario.jsx"
export default function FormReserva (){
  const [fechaInicio, setFechaInicio] = useState(false);
  const [fechaFin, setFechaFin] = useState(false);
    const [sucursales, setSucursales] = useState([]);
    const [cargando, setCargando] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  useEffect(() => {
      const fetchSucursales = async () => {
        setCargando(true);
  
        try {
          const response = await fetch('http://localhost:3001/sucursales', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          const data = await response.json();
          // data.metaData es el array que buscás
          setSucursales(data.metaData || []);
        } catch (e) {
          console.log("cagamo"+ e)
        } finally {
          setCargando(false);
        }
      };
  
      fetchSucursales();
    }, []);
  const handleSeleccionar = (sucursal) => {
    setSucursalSeleccionada(sucursal);
  };
    return(
     
    <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-green-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative pointer-events-auto">

        <h2 className="text-xl font-semibold mb-4">Rerservar un Vehículo</h2>

        {cargando ? (
          <p className="text-xl font-semibold mb-4">Cargando sucursales...</p>
        ) : (<>
        <p>Sucursales Disponibles</p>
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
          </>
        )}
        {sucursalSeleccionada && (
            <>
          <div className="mt-4 p-4 bg-blue-100 rounded-md text-center">
            <p className="text-blue-700 font-medium">
              Sucursal seleccionada: {sucursalSeleccionada.nombre}
            </p>
            <p className="text-sm text-blue-600">{sucursalSeleccionada.direccion}</p>
          </div>
            <Calendario setFec={setFechaInicio}/>
        </>
        )}
        {fechaInicio && (
            <Calendario setFec={setFechaFin} minimo={fechaInicio}/>
        )}
        {fechaFin && (
            <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Aceptar
            </button>
        )}
      </div>
    </div>


  
  )
}


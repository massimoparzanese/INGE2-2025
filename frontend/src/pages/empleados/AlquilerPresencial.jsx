import { useEffect, useState } from "react"
import Calendario from "../../components/Calendario.jsx"
import { useAuth } from "../../context/AuthContext";
export default function AlquilerPresencial(){
    const { user } = useAuth();
    const [fechaFin,setFechaFin] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

    const handleSeleccionarVehiculo = (vehicle) => {
    setVehiculoSeleccionado(vehicle);
    };
    const handleAccept = async () =>{
        if(user){
            try {
            
            const response = await fetch(`http://localhost:3001/reservas/disponibles-presencial`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                email: user,
                fechaFin: fechaFin
                }),
            });

            if (!response.ok) throw new Error('Error en la respuesta de la API');

            const data = await response.json();
            console.log(data)
            if (data) {
                setVehicles(data.disponible || []);
                console.log(JSON.stringify(data));
            }
            } catch (e) {
            console.error('Error al obtener vehiculos:', e);
            }
      }
      else{
      return
      }
    }
    return (
        <>
        <section className="flex justify-center items-center min-h-screen pt-20 ">
            <aside className="bg-[#1e2a38] text-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            {vehicles.length === 0 && (
                <>
                <h2 className="text-xl font-semibold mb-4">Bienvenido</h2>
                <p className="text-xs font-semibold mb-2">
                    ¿En qué fechas desea ver vehículos disponibles?
                </p>
                 <Calendario setFec={setFechaFin} minimo={Date.now()} />
                 {fechaFin && (
                <div className="pt-4">
                <button
                    onClick={() => {
                    handleAccept();
                    }}
                    className="mb-4 px-4 py-2 bg-blue-400 text-white rounded-2xl transition cursor-pointer"
                >
                    Ver vehículos disponibles
                </button>
                </div>
                )}
                </>
            )}
                
               <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 px-4">
                {vehicles.map(vehicle => (
                    <li
                    key={vehicle.patente}
                    onClick={() => handleSeleccionarVehiculo(vehicle)}
                    className={`group relative cursor-pointer rounded-2xl border-4 border-[#7c1212] overflow-hidden shadow-lg transition-transform duration-300
                        ${
                        vehiculoSeleccionado?.patente === vehicle.patente
                            ? 'ring-2 ring-yellow-400'
                            : 'hover:scale-105'
                        }`}
                    style={{ backgroundColor: '#430505' }}
                    >
                    {/* Imagen grande */}
                    <img
                        src={vehicle.foto}
                        alt={`Foto del ${vehicle.Modelo.marca} ${vehicle.modelo}`}
                        className="w-full h-72 object-cover"
                    />

                    {/* Capa oscura al hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center px-4 text-white text-center">
                        <p className="font-bold text-lg mb-1">
                        {vehicle.Modelo.marca} {vehicle.modelo}
                        </p>
                        <p className="text-sm">💲 {vehicle.precio} USD / día</p>
                        <p className="text-sm">🕒 Año: {vehicle.anio}</p>
                        <p className="text-sm">👥 Capacidad: {vehicle.capacidad} personas</p>
                        <p className="text-sm">🛣 {vehicle.kms.toLocaleString()} km</p>
                    </div>

                    {/* Pie tipo leyenda */}
                    <div className="absolute bottom-0 w-full text-center text-xs text-gray-100 bg-[#7c1212] py-1 font-semibold tracking-wide">
                        {vehicle.Modelo.marca} - {vehicle.modelo}
                    </div>
                    </li>
                ))}
                </ul>


            </aside>
        </section>
        </>
    )
}
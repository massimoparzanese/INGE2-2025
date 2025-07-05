import { useState } from "react"
import Calendario from "../../components/Calendario.jsx"
import { useAuth } from "../../context/AuthContext";
export default function AlquilerPresencial(){
    const { user } = useAuth();
    const [fechaFin,setFechaFin] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    fechaNacimiento: '',
    adicionales: []
    });


    const handleSeleccionarVehiculo = (vehicle) => {
    setVehiculoSeleccionado(vehicle);
    };
   const handleAccept = async () => {
    if (user) {
        try {
            setIsLoading(true);
            setBusquedaRealizada(true);
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
            console.log(JSON.stringify(data))
            setVehicles(data.disponible || []);
        } catch (e) {
            console.error('Error al obtener vehículos:', e);
        } finally {
            setIsLoading(false);
        }
    }
};
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    };
    const toggleAdicional = (opcion) => {
    setFormData((prev) => ({
        ...prev,
        adicionales: prev.adicionales.includes(opcion)
        ? prev.adicionales.filter((item) => item !== opcion)
        : [...prev.adicionales, opcion],
    }));
    };



    return (
        <section className="flex justify-center items-center min-h-screen pt-20 ">
            <aside className="bg-[#1e2a38] text-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                {/* Mostrar calendario si no hay vehículos o si no se buscó aún */}
                {(vehicles.length === 0 && !isLoading) || !busquedaRealizada ? (
                <>
                    {busquedaRealizada && vehicles.length === 0 && (
                    <p className="text-red-300 text-sm font-semibold mb-2">
                        No hay vehículos disponibles en esa fecha. Intente con otra.
                    </p>
                    )}
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
                ) : (
                    <>
                    {isLoading && busquedaRealizada && (
                    <p className="mt-2 text-sm text-blue-300 animate-pulse">
                        Buscando autos disponibles...
                    </p>
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
                        <img
                        src={vehicle.foto}
                        alt={`Foto del ${vehicle.Modelo.marca} ${vehicle.modelo}`}
                        className="w-full h-72 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center px-4 text-white text-center">
                        <p className="font-bold text-lg mb-1">
                            {vehicle.Modelo.marca} {vehicle.modelo}
                        </p>
                        <p className="text-sm">💲 {vehicle.precio} USD / día</p>
                        <p className="text-sm">Patente: {vehicle.patente}</p>
                        <p className="text-sm">🕒 Año: {vehicle.anio}</p>
                        <p className="text-sm">👥 Capacidad: {vehicle.capacidad} personas</p>
                        <p className="text-sm">🛣 {vehicle.kms.toLocaleString()} km</p>
                        </div>
                        <div className="absolute bottom-0 w-full text-center text-xs text-gray-100 bg-[#7c1212] py-1 font-semibold tracking-wide">
                        {vehicle.Modelo.marca} - {vehicle.modelo}
                        </div>
                    </li>
                    ))}
                </ul>
                </>
                )}
                {vehiculoSeleccionado && (
                    <div className="mt-6 p-4 bg-[#2c3e50] rounded-lg shadow-inner space-y-4">
                        <h3 className="text-lg font-semibold text-white">Complete los datos para continuar:</h3>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm text-white">
                            DNI
                            <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
                            />
                        </label>

                        <label className="text-sm text-white">
                            Nombre completo
                            <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
                            />
                        </label>

                        <label className="text-sm text-white">
                            Fecha de nacimiento
                            <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
                            />
                        </label>
                        </div>

                        <div className="mt-4">
                        <p className="text-sm font-semibold text-white mb-2">Adicionales:</p>
                        <div className="flex flex-col gap-1 text-white text-sm">
                            {['Silla de bebe', 'Tanque lleno', 'Seguro ($100 USD)'].map((opcion) => (
                            <label key={opcion}>
                                <input
                                type="checkbox"
                                checked={formData.adicionales.includes(opcion)}
                                onChange={() => toggleAdicional(opcion)}
                                className="mr-2"
                                />
                                {opcion}
                            </label>
                            ))}
                        </div>
                        </div>
                    </div>
                    )}

            </aside>
            </section>

    )
}
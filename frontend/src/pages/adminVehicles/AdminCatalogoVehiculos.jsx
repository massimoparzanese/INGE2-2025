import {useState, useEffect} from "react";
import VehiculoPortada from "../../components/VehiculoPortada";
export default function AdminCatalogoVehiculos (){
    const [vehiculos, setVehiculos] = useState([]);
      const [cargando, setCargando] = useState(true);
    const [filtroModelo, setFiltroModelo] = useState("");
      useEffect(() => {
        
        const fetchVehiculos = async () => {
            try {
            const response = await fetch('http://localhost:3001/vehiculos/todos', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            const data = await response.json();
            setVehiculos(data.metaData || []);
        } catch (e) {
          console.error('Error al obtener sucursales:', e);
        } finally {
          setCargando(false);
        }
        }
        fetchVehiculos();
      },[])
     
        // Filtra los vehículos para la barra de busqueda
        const vehiculosFiltrados = vehiculos.filter(v =>
        v.modelo.toLowerCase().includes(filtroModelo.toLowerCase())
        );
      return (
        <div className="flex justify-center items-center h-screen bg-red-800">
        <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-2xl font-bold mb-6 text-red-700">Vehículos de la Empresa</h2>

        <input
          type="text"
          placeholder="Buscar por modelo..."
          value={filtroModelo}
          onChange={(e) => setFiltroModelo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {cargando ? (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Cargando vehículos...</p>
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
              {vehiculosFiltrados.map((vehiculo, i) => (
                <VehiculoPortada vehiculo={vehiculo} i={i}/>
              ))}
              {vehiculosFiltrados.length === 0 && (
                <p className="text-center font-medium text-gray-500">No hay vehículos con ese modelo</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>

      );
}
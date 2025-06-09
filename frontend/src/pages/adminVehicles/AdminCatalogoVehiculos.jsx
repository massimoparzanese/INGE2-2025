import {useState, useEffect, useContext} from "react";
import VehiculoPortada from "../../components/VehiculoPortada";
import { Plus } from "lucide-react";
import { AuthContext } from "../../context/AuthContextFunct";
export default function AdminCatalogoVehiculos (){
  const { isAuthenticated, role } = useContext(AuthContext);
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [inputModelo, setInputModelo] = useState("");
    const [inputMarca, setInputMarca] = useState("");
    const [filtroModelo, setFiltroModelo] = useState("");
    const [filtroMarca, setFiltroMarca] = useState("");

    const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);
      useEffect(() => {
        
        const fetchVehiculos = async () => {
            try {
            const response = await fetch('http://localhost:3001/vehiculos/todos', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            const data = await response.json();
            console.log("Vehículos recibidos desde backend:", JSON.stringify(data.metaData, null, 2));
            setVehiculos(data.metaData || []);
        } catch (e) {
          console.error('Error al obtener sucursales:', e);
        } finally {
          setCargando(false);
        }
        }
        fetchVehiculos();
      },[])
     

        // Eliminar Vehículo
        const eliminarVehiculo = async (patente) => {
          const confirmar = window.confirm("¿Confirmas que quieres eliminar el vehículo?");
          if (!confirmar) return;

          try{
            const response = await fetch(`http://localhost:3001/vehiculos/patente/${patente}`, {
              method: 'DELETE',
              credentials: 'include',
            });

            let data = null;

            try{
              data = await response.json();
            }catch (jsonError){
            }

            if (response.ok){
              alert("Vehículo eliminado correctamente");
              setVehiculos(prev => prev.filter(v => v.patente !== patente));
            }else{
              alert("Error al eliminar: " + data.message);
            }
          } catch (error){
            console.error("Error al eliminar vehiculo: " + error);
            alert ("Error en la eliminación");
          }
        }

        // Filtra los vehículos para la barra de busqueda
        const vehiculosFiltrados = vehiculos.filter(v =>
  v.Modelo.nombre.toLowerCase().includes(filtroModelo.toLowerCase()) &&
  v.Modelo.Marca.nombre.toLowerCase().includes(filtroMarca.toLowerCase())
);


      return (
        <div className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10">

        <div className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
          {
            isAuthenticated /*&& role === 'admin'*/ &&(
           <button className="absolute top-4 right-4 text-white hover:text-red-700 bg-green-500 rounded-4xl transition-colors">
            <Plus className="w-8 h-8 " />
          </button>
          )} 
        <h2 className="text-2xl font-bold mb-4 text-red-700">Vehículos de la Empresa</h2>
        {vehiculos.length !== 0 && !cargando && (
        <>
        <input
            type="text"
            placeholder="Buscar por marca..."
            value={inputMarca}
            onChange={(e) => setInputMarca(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            placeholder="Buscar por modelo..."
            value={inputModelo}
            onChange={(e) => setInputModelo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-x-4">
          <button
            onClick={() => {
              setFiltroModelo(inputModelo);
              setFiltroMarca(inputMarca);
            }}
            className="w-1/4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={() => {
              setFiltroModelo('');
              setFiltroMarca('');
              setInputMarca('')
              setInputModelo('')
            }}
            className="w-1/4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Limpiar filtros
          </button>
          </div>
        </>
      )}

        

        {cargando ? (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Cargando vehículos...</p>
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 pt-4">
              {vehiculosFiltrados.map((vehiculo, i) => (
                <VehiculoPortada
                key={i}
                vehiculo={vehiculo}
                onDelete={eliminarVehiculo}
                />
              ))}
              {vehiculos.length === 0 && !cargando &&(
                <p className="font-medium">La empresa no cuenta con vehiculos para listar.</p>
              )}
              {vehiculosFiltrados.length === 0 && vehiculos.length > 0 && (
                <p className="font-medium">No hay vehículos que coincidan con los filtros seleccionados</p>
              )}
            </div>
          </>
        )}
        
      </div>
    </div>

      );
}
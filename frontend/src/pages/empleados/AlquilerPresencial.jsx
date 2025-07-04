import { useEffect, useState, useContext } from "react"
import Calendario from "../../components/Calendario.jsx"
import { AuthContext } from "../../context/AuthContextFunct.jsx";
export default function AlquilerPresencial(){
    const [fechaFin,setFechaFin] = useState(null);
    const [accept, setAccept] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if(accept && user){
            const fetchVehiculos = async () => {
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

          if (data) {
            setVehicles(data.disponible || []);
            console.log(JSON.stringify(data));
          }
        } catch (e) {
          console.error('Error al obtener vehiculos:', e);
        }
      };
       
        fetchVehiculos();
       }
        
    },[accept, fechaFin, user]);
    return (
        <>
        <section className="flex justify-center items-center min-h-screen pt-20 ">
            <aside className="bg-green-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Bienvenido</h2>
                <p className="text-xs font-semibold mb-2">
                    ¿En qué fechas desea ver vehículos disponibles?
                </p>
                 <Calendario setFec={setFechaFin} minimo={Date.now()} />
                 {fechaFin && (
                <div className="pt-4">
                <button
                    onClick={() => setAccept(true)}
                    className="mb-4 px-4 py-2 bg-blue-400 text-white rounded-2xl transition cursor-pointer"
                >
                    Ver vehículos disponibles
                </button>
                </div>
                )}
            </aside>
        </section>
        </>
    )
}
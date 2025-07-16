import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ListaVehiculosSucursal from "../../components/ListarVehiculosSucursal";

export default function VehiculosParaDevolverPage() {
  const { user, role } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerVehiculosParaDevolver = async () => {
      if (!user) {
        console.log("No hay usuario logueado.");
        setCargando(false);
        return;
      }

      try {
        console.log("mail que se envia: " + user);
        const response = await fetch("http://localhost:3001/vehiculos/para-devolver", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email: user })
            });

            if (!response.ok) throw new Error("Error al obtener los vehículos.");

            const data = await response.json();
            setVehiculos(data.metaData || []);
      } catch (error) {
        console.error("Error al obtener vehículos para devolver:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculosParaDevolver();
  }, [user]);

  //if (cargando) return <p>Cargando vehículos para devolver...</p>; //NO ANDA
  return (
     <>
          {role === 'empleado' ? (
            cargando ? (
              <div className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10">
        
                <div className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-4">Cargando vehiculos pendientes para entregar...</p>
                      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  </div>
              </div>
            ) : (
              <ListaVehiculosSucursal vehiculos={vehiculos} titulo = "Vehículos de la sucursal para devolver" mensajeVacio="No hay autos para devolver." />
            )
            ) : (
              <div className="p-6">
                <p className="text-white-500">Solo los empleados pueden ver esta información</p>
              </div>
            )}
        
    </>
    /*
    <div>
      <h1>Autos pendientes para devolver</h1>
      <ListaVehiculosSucursal vehiculos={vehiculos} titulo = "Vehículos de la sucursal para devolver" mensajeVacio="No hay autos pendientes de entrega." />
    </div>*/
  );
}

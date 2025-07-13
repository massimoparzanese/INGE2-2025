import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ListaVehiculosSucursal from "../../components/ListarVehiculosSucursal";

export default function VehiculosSucursalPage (){
  const { user, role } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerVehiculosSucursal = async () => {
      if (!user) {
        console.log("No hay usuario logueado o falta email.");
        setCargando(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/vehiculos/por-email-empleado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ email: user })
        });

        if (!response.ok) throw new Error("Error al obtener los vehículos.");

        const data = await response.json();
        console.log("📦 Respuesta completa:", data);
        console.log("📁 metaData:", data.metaData);
        setVehiculos(data.metaData || []);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculosSucursal();
  }, [user]);

  //if (cargando) return <p>Cargando vehículos de la sucursal...</p>; Esta línea queda eliminada porque generaba error
  //if (role?.rol?.trim() !== "empleado") return <p>Solo los empleados pueden ver esta información.</p>; Esta línea también generaba error

  return (
    <>
    {role === 'empleado' ? (
    cargando ? (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 pt-12 items-center justify-center flex flex-col text-white"></h2>
        <p className='text-white'>Cargando vehículos de la sucursal...</p>
      </div>
    ) : (
      <ListaVehiculosSucursal vehiculos={vehiculos} />
    )
    ) : (
      <div className="p-6">
        <p className="text-white-500">Solo los empleados pueden ver esta información</p>
      </div>
    )}

  </>
  )
};


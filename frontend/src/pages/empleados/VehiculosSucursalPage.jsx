import { useEffect, useState } from "react";
import axios from "axios";
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
        const response = await axios.post(
          "http://localhost:3001/vehiculos/por-email-empleado",
          { email: user },  // Aquí usamos el email directamente
          { withCredentials: true }
        );

        console.log("📦 Respuesta completa:", response.data);
        console.log("📁 metaData:", response.data.metaData);
        setVehiculos(response.data.metaData || []);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculosSucursal();
  }, [user]);

  //if (cargando) return <p>Cargando vehículos de la sucursal...</p>;
  //if (role?.rol?.trim() !== "empleado") return <p>Solo los empleados pueden ver esta información.</p>;

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


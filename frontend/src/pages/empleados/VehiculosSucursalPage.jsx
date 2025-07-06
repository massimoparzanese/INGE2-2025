import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ListaVehiculosSucursal from "../../components/ListarVehiculosSucursal";

const VehiculosSucursalPage = () => {
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
          { email: user },
          { withCredentials: true }
        );

        console.log("📦 Respuesta completa:", response.data); //BORRAR
        console.log("📁 metaData:", response.data.metaData); //BORRAR
        setVehiculos(response.data.metaData || []);
        console.log("🧪 Primer vehículo recibido:", response.data.metaData[0]); //BORRAR
        console.log("🧪 Lista completa:", response.data.metaData); //BORRAR
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculosSucursal();
  }, [user]);

  if (cargando) return <p>Cargando vehículos de la sucursal...</p>;
  if (role?.rol?.trim() !== "empleado") return <p>Solo los empleados pueden ver esta información.</p>;

  console.log(vehiculos[0]); //BORRAR

  return <ListaVehiculosSucursal vehiculos={vehiculos} />;
};

export default VehiculosSucursalPage;

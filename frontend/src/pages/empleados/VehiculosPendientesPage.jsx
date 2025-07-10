import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ListaVehiculosSucursal from "../../components/ListarVehiculosSucursal";

export default function VehiculosPendientesPage() {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerVehiculosPendientes = async () => {
      if (!user) {
        console.log("No hay usuario logueado.");
        setCargando(false);
        return;
      }

      try {
        console.log("mail que se envia: " + user);
        const response = await fetch("http://localhost:3001/vehiculos/pendientes", {
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
        console.error("Error al obtener vehículos pendientes:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculosPendientes();
  }, [user]);

  if (cargando) return <p>Cargando vehículos pendientes...</p>;

  return (
    <div>
      <h1>Autos pendientes para entregar</h1>
      <ListaVehiculosSucursal vehiculos={vehiculos} titulo = "Vehículos de la sucursal pendientes de entrega" mensajeVacio="No hay autos pendientes de entrega." />
    </div>
  );
}

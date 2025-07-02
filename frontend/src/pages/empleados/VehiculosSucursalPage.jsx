import ListaVehiculosSucursal from "../../components/ListarVehiculosSucursal";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const VehiculosSucursalPage = () => {
  const { user } = useAuth();
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosEmpleado = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:3000/usuario/${user.id}`);
        const { idpersona, rol } = res.data;

        if (rol !== "empleado") {
          setIdEmpleado(null);
        } else {
          setIdEmpleado(idpersona);
        }
      } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
        setIdEmpleado(null);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosEmpleado();
  }, [user]);

  if (cargando) return <p>Cargando información del empleado...</p>;

  if (!idEmpleado) return <p>Solo los empleados pueden ver los vehículos de su sucursal.</p>;

  return <ListaVehiculosSucursal idempleado={idEmpleado} />;
};

export default VehiculosSucursalPage;

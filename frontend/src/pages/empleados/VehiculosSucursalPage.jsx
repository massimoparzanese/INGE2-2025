import ListaVehiculosSucursal from "../../components/ListaVehiculosSucursal";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import supabase from "../../supabase";

const VehiculosSucursalPage = () => {
  const { user } = useAuth(); // ← tu contexto de usuario logueado
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const buscarEmpleado = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("Persona")
        .select("idpersona, rol")
        .eq("id", user.id) // "id" debe ser el campo que relaciona con Auth
        .maybeSingle();

      if (error || !data || data.rol !== "empleado") {
        setCargando(false);
        return;
      }

      setIdEmpleado(data.idpersona);
      setCargando(false);
    };

    buscarEmpleado();
  }, [user]);

  if (cargando) return <p>Cargando información del empleado...</p>;

  if (!idEmpleado) return <p>Solo los empleados pueden ver los vehículos de su sucursal.</p>;

  return <ListaVehiculosSucursal idempleado={idEmpleado} />;
};

export default VehiculosSucursalPage;

import { useEffect, useState } from "react";

export default function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch("http://localhost:3001/empleados/obtener/empleados", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error en la respuesta de la API");

        const data = await response.json();
        console.log("Empleados recibidos desde backend:", JSON.stringify(data, null, 2));
        setEmpleados(data.personas || []);
      } catch (e) {
        console.error("Error al obtener empleados:", e);
      } finally {
        setCargando(false);
      }
    };

    fetchEmpleados();
  }, []);

  return { empleados, cargando };
}
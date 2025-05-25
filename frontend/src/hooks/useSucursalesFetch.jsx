import { useState, useEffect } from "react";
let cacheSucursales = null;

export function useSucursalesFetch() {
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (cacheSucursales) {
      setSucursales(cacheSucursales);
      setCargando(false);
    } else {
      const fetchSucursales = async () => {
        try {
          const response = await fetch('http://localhost:3001/sucursales', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          const data = await response.json();
          cacheSucursales = data.metaData || [];
          setSucursales(cacheSucursales);
        } catch (e) {
          console.error('Error al obtener sucursales:', e);
        } finally {
          setCargando(false);
        }
      };

      fetchSucursales();
    }
  }, []);

  return { sucursales, cargando };
}

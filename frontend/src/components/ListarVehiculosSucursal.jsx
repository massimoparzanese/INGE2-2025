import { useEffect, useState } from "react";
import axios from "axios";

const ListaVehiculosSucursal = ({ idempleado }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/vehiculos/por-empleado/${idempleado}`);
        const { message, metaData } = res.data;

        if (!metaData || metaData.length === 0) {
          setMensaje(message || "No se encontraron vehículos.");
        } else {
          setVehiculos(metaData);
        }
      } catch (err) {
        console.error(err);
        setMensaje("Error al obtener los vehículos.");
      } finally {
        setCargando(false);
      }
    };

    fetchVehiculos();
  }, [idempleado]);

  if (cargando) return <p>Cargando vehículos...</p>;
  if (mensaje) return <p>{mensaje}</p>;

  return (
    <div>
      <h2>Vehículos de tu sucursal</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {vehiculos.map((v) => (
          <div key={v.patente} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
            <img src={v.foto} alt="Vehículo" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <p><strong>Patente:</strong> {v.patente}</p>
            <p><strong>Marca:</strong> {v.Modelo?.Marca?.nombre}</p>
            <p><strong>Modelo:</strong> {v.Modelo?.nombre}</p>
            <p><strong>Capacidad:</strong> {v.capacidad} personas</p>
            <p><strong>Kilómetros:</strong> {v.kms} km</p>
            <p><strong>Año:</strong> {v.anio}</p>
            <p><strong>Precio:</strong> ${v.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaVehiculosSucursal;

import React from "react";

const ListaVehiculosSucursal = ({ vehiculos }) => {
  if (!vehiculos || vehiculos.length === 0) {
    return <p>No se encontraron vehículos.</p>;
  }

  return (
    <div>
      <h2>Vehículos pendientes para entregar</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {vehiculos.map((v) => (
          <div
            key={v.patente}
            style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}
          >
            <img
              src={v.foto}
              alt="Vehículo"
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <p>
              <strong>Patente:</strong> {v.patente}
            </p>
            <p>
              <strong>Marca:</strong> {v.Modelo?.Marca?.nombre}
            </p>
            <p>
              <strong>Modelo:</strong> {v.Modelo?.nombre}
            </p>
            <p>
              <strong>Capacidad:</strong> {v.capacidad} personas
            </p>
            <p>
              <strong>Kilómetros:</strong> {v.kms} km
            </p>
            <p>
              <strong>Año:</strong> {v.anio}
            </p>
            <p>
              <strong>Precio:</strong> ${v.precio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaVehiculosSucursal;

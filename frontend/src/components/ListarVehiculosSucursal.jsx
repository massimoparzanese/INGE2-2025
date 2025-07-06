import React, { useEffect } from "react";

export default function ListaVehiculosSucursal ({ vehiculos }) {
  useEffect (() => {
    console.log("autillos")
    console.log(vehiculos)
  },[vehiculos])
  if (!vehiculos || vehiculos.length === 0) {
    return <p className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10">No se encontraron vehículos.</p>;
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10">
      <h2 className="text-white">Vehículos pendientes para entregar</h2>
      <div className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
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


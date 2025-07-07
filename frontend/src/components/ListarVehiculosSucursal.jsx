import React, { useEffect } from "react";

export default function ListaVehiculosSucursal({ vehiculos }) {
  useEffect(() => {
    console.log("🧾 Lista de vehículos de sucursal:");
    console.log(vehiculos);
  }, [vehiculos]);

  if (!vehiculos || vehiculos.length === 0) {
    return (
      <p className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10 text-white">
        No se encontraron vehículos.
      </p>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-red-800 p-4 pt-20 pb-10">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Vehículos de la Sucursal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehiculos.map((v) => (
            <div
              key={v.patente}
              className="flex gap-4 items-center border rounded-lg p-4"
            >
              <img
                src={v.foto}
                alt={`Foto de ${v.Modelo?.Marca?.nombre} ${v.Modelo?.nombre}`}
                className="w-36 h-24 object-cover rounded-md border"
              />
              <div>
                <p className="font-semibold text-lg">{v.Modelo?.Marca?.nombre}</p>
                <p className="text-sm text-gray-600">Modelo: {v.Modelo?.nombre}</p>
                <p className="text-sm text-gray-600">Año: {v.anio}</p>
                <p className="text-sm text-gray-600">Capacidad: {v.capacidad} personas</p>
                <p className="text-sm text-gray-600">Precio por día (USD): ${v.precio}</p>
                <p className="text-sm text-gray-600">Km: {v.kms}</p>
                <p className="text-sm text-gray-600">Patente: {v.patente}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

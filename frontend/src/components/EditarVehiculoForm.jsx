import { useState, useEffect } from "react";

export default function EditarVehiculoForm({ patenteSeleccionada, onVolver }){
    const [vehiculo, setVehiculo] = useState({
        modelo: "",
        foto: "",
        capacidad: "",
        kms: "",
        sucursal: "",
        precio: "",
    });

    useEffect(() => {
        async function fetchVehiculo() {
            try {
                const res = await fetch(`http://localhost:3001/vehiculos/${patenteSeleccionada}`);
                console.log("🧪 Solicitando:", `/vehiculos/${patenteSeleccionada}`);
                const json = await res.json();
                setVehiculo(json.metaData);
            } catch (err) {
                console.error("Error al obtener datos del vehículo:", err);
           }
        }

        if (patenteSeleccionada){
            fetchVehiculo();
        }

    }, [patenteSeleccionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehiculo({ ...vehiculo, [name]: value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch(`http://localhost:3001/vehiculos/${patenteSeleccionada}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehiculo),
      });

      const json = await res.json();
      alert(json.message);
      if (onVolver) onVolver();
            } catch (err) {
            alert("Error al actualizar vehículo");
            console.error(err);
        }
    };

   return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Editar vehículo: {patenteSeleccionada}</h2>

      <div className="mb-4">
        <label className="block mb-1">Modelo</label>
        <input
          type="text"
          name="modelo"
          value={vehiculo.modelo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Foto (URL)</label>
        <input
          type="text"
          name="foto"
          value={vehiculo.foto}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Capacidad</label>
        <input
          type="number"
          name="capacidad"
          value={vehiculo.capacidad}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Kilómetros</label>
        <input
          type="number"
          name="kms"
          value={vehiculo.kms}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Sucursal</label>
        <input
          type="text"
          name="sucursal"
          value={vehiculo.sucursal}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Precio por día</label>
        <input
          type="number"
          name="precio"
          value={vehiculo.precio}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          step="0.01"
          min="0"
        />
      </div>


      <div className="flex justify-between">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar cambios
        </button>
        <button type="button" onClick={onVolver} className="text-gray-600 hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );

}
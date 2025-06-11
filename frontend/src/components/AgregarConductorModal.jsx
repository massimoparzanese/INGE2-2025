import { useState } from "react";
export default function AgregarConductorModal({onCerrar}){
const [formData, setFormData] = useState({
    dni: '',
    nombreCompleto: '',
    fechanacimiento: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {

  }
    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Fondo oscurecido */}
  <div
    className="absolute inset-0 bg-transparent bg-opacity-40 pointer-events-auto"
    onClick={onCerrar}
  ></div>

  {/* Contenido del modal */}
  <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10 pointer-events-auto">
    <button
      onClick={onCerrar}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      aria-label="Cerrar modal"
    >
      ×
    </button>

    <h2 className="text-xl font-semibold mb-4 text-red-600">Agregar conductor</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre completo */}
      <div>
        <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          type="text"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleChange}
          placeholder="Juan Pérez"
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>

      {/* DNI */}
      <div>
        <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
          DNI
        </label>
        <input
          type="number"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          placeholder="12345678"
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>

      {/* Fecha de asignación */}
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
          Fecha de asignación
        </label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Agregar conductor
        </button>
      </div>
    </form>
  </div>
</div>

    )
}
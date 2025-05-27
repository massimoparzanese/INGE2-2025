import { useState } from 'react';
import { useAgregarVehiculo } from '../hooks/useAgregarVehiculo';

const AgregarVehiculo = () => {
  const [form, setForm] = useState({
    marca: "",  
    modelo: "",
    anio: "",
    patente: "",
    estado: "",
    imagenUrl: "",  // nuevo campo
  });

  const { agregarVehiculo, mensaje, cargando } = useAgregarVehiculo();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await agregarVehiculo(form);
    if (exito) {
      setForm({
        marca: "",  
        modelo: "",
        anio: "",
        patente: "",
        estado: "",
        imagenUrl: "",
      });
      setMostrarFormulario(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url('/e3b929eb-c37d-4ff6-8cdf-87a8420463fb.png')` }}
    >
      {mostrarFormulario && (
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
        >
          <input
            type="text"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            placeholder="Marca"
            className="w-full p-2 border rounded"
            required pattern="[A-Za-z\s]+"
            title="Solo letras y espacios"
            />
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="anio"
            value={form.anio}
            onChange={handleChange}
            placeholder="Año"
            className="w-full p-2 border rounded"
            min="1960"
            max={new Date().getFullYear()}
            required
          />
          <input
            type="text"
            name="patente"
            value={form.patente}
            onChange={handleChange}
            placeholder="Patente"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione estado</option>
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
          <input
            type="url"
            name="imagenUrl"
            value={form.imagenUrl}
            onChange={handleChange}
            placeholder="URL de la imagen"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
          >
            Confirmar
          </button>
        </form>
      )}

      {mensaje && (
        <p className="mt-4 bg-white bg-opacity-80 text-black py-2 px-4 rounded shadow">
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default AgregarVehiculo;



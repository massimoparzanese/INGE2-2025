import { useState } from 'react';
import { useAgregarVehiculo } from '../hooks/useAgregarVehiculo';

const AgregarVehiculo = () => { //formulario vacio
    const [form, setForm] = useState({
        marca: "",  
        modelo: "",
        año: "",
        patente: "",
        estado: "",
    });

    const { agregarVehiculo, mensaje, cargando } = useAgregarVehiculo();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // actualiza el formulario al escribir
    const handleChange = (e) => {
        const{ name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value}));
    };

    // envia el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const exito = await agregarVehiculo(form);
        if(exito){
            setForm({
                marca: "",  
                modelo: "",
                año: "",
                patente: "",
                estado: "",
            })
            setMostrarFormulario(false);
        }
    }

    // estilo (despues seguro hay que cambiarlo para que sea exactamente igual en todas partes)
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url('/e3b929eb-c37d-4ff6-8cdf-87a8420463fb.png')` }}
    >
      <button
        onClick={() => setFormVisible(!formVisible)}
        className="mb-4 bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        {formVisible ? "Cancelar" : "Agregar vehículo"}
      </button>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
        >
          <input
            type="text"
            name="marca"
            value={vehiculo.marca}
            onChange={handleChange}
            placeholder="Marca"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="modelo"
            value={vehiculo.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="anio"
            value={vehiculo.anio}
            onChange={handleChange}
            placeholder="Año"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="patente"
            value={vehiculo.patente}
            onChange={handleChange}
            placeholder="Patente"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="estado"
            value={vehiculo.estado}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
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
import { useState } from 'react';
import { useAgregarVehiculo } from '../hooks/useAgregarVehiculo';
import { useSucursalesFetch } from "../hooks/useSucursalesFetch";
const AgregarVehiculo = () => {
  const { sucursales, cargando } = useSucursalesFetch();
  const [sucursalSeleccionada] = useState(null);
  const [form, setForm] = useState({
    marca: "",  
    modelo: "",
    anio: "",
    patente: "",
    foto: "",  // nuevo campo
    precio:0,
    sucursal:'',
    politica: 0,
    capacidad:0,
    kms:0
  });

  const { agregarVehiculo, mensaje } = useAgregarVehiculo();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await agregarVehiculo(form);
    if (exito.status < 400) {
      setForm({
        marca: "",  
        modelo: "",
        anio: "",
        patente: "",
        foto: "",
        precio: 0,
        sucursal:'',
        politica: 0,
        capacidad:0,
        kms:0,
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
          <p>Marca</p>
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
            <p>Modelo</p>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="Estado">Año</label>
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
          <label htmlFor="patente">Patente</label>
          <input
            type="text"
            name="patente"
            value={form.patente}
            onChange={handleChange}
            placeholder="Patente"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="precio">Precio por día (en USD)</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="Foto">Ingrese una imagen</label>
          <input
            type="url"
            name="foto"
            value={form.imagenUrl}
            onChange={handleChange}
            placeholder="URL de la imagen"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="capacidad">Capacidad</label>
          <input
            type="number"
            name="capacidad"
            value={form.capacidad}
            onChange={handleChange}
            placeholder="capacidad"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="kms">Kilometraje</label>
          <input
            type="number"
            name="kms"
            value={form.kms}
            onChange={handleChange}
            placeholder="kilometraje"
            className="w-full p-2 border rounded"
            required
          />
          {cargando ? (
            <p>Cargando sucursales...</p>
          )
           : (
            <>
                  <label htmlFor="sucursal">Selecciona una sucursal:</label>
                    <select
                      id="sucursal"
                      name="sucursal"
                      value={form.sucursal}
                      className="w-full p-2 border rounded"
                      onChange={handleChange}
                    >
                      <option value="">-- Seleccionar --</option>
                      {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </option>
                      ))}
                    </select>
            </>
            
          )}
          <label htmlFor="politica">Politica de Reembolso</label>
                    <select
                      id="politica"
                      name="politica"
                      value={form.politica}
                      className="w-full p-2 border rounded"
                      onChange={handleChange}
                    >
                      <option value="">-- Seleccionar --</option>
                      <option key={0} value={0}>
                          0
                        </option>
                        <option key={20} value={20}>
                          20
                        </option>
                        <option key={100} value={100}>
                          100
                        </option>
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



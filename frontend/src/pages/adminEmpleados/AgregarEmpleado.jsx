import { useState } from "react";
import { useSucursalesFetch } from "../../hooks/useSucursalesFetch";
;

export default function AgregarEmpleado() {
  const { sucursales, cargando } = useSucursalesFetch();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    email: "",
    sucursal: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const agregarEmpleado = async (empleado) => {
    setEnviando(true);
    try {
      const response = await fetch("http://localhost:3001/empleados/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });

      const result = await response.json();
      console.log(result);
      setMensaje(result.message);
      return response.status;
    } catch (error) {
      setMensaje("Error inesperado, intente más tarde");
      return false;
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await agregarEmpleado(form);
    if (exito < 400) {
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        nacimiento: "",
        email: "",
        sucursal: "",
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
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="dni">DNI</label>
          <input
            type="text"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="DNI"
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="nacimiento">Fecha de nacimiento</label>
          <input
            type="date"
            name="nacimiento"
            value={form.nacimiento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          {cargando ? (
            <p>Cargando sucursales...</p>
          ) : (
            <>
              <label htmlFor="sucursal">Selecciona una sucursal:</label>
              <select
                id="sucursal"
                name="sucursal"
                value={form.sucursal}
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
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
          <button
            type="submit"
            className="bg-red-600 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Confirmar"}
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
}
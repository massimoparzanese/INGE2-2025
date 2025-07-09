import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useObtenerEmpleados from "../../hooks/useObtenerEmpleados";
import { useSucursalesFetch } from "../../hooks/useSucursalesFetch";

export default function EditarEmpleado() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const { empleados, cargando: cargandoEmpleados } = useObtenerEmpleados();
  const { sucursales, cargando: cargandoSucursales } = useSucursalesFetch();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechanacimiento: "",
    email: "",
    sucursal: "",
    rol: "empleado",
  });

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (cargandoEmpleados || !dni) return;

    const emp = empleados.find((e) => String(e.dni) === String(dni));

    if (emp) {
      setForm({
        nombre: emp.nombre,
        apellido: emp.apellido,
        dni: emp.dni,
        fechanacimiento: emp.fechanacimiento,
        email: emp.email,
        sucursal: emp.Pertenece?.[0]?.idsucursal ?? "",
        rol: "empleado",
      });
    }
  }, [cargandoEmpleados, empleados, dni]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch(`http://localhost:3001/empleados/${dni}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const json = await res.json();
      setMensaje(json.message || "Empleado actualizado correctamente.");
      setTimeout(() => navigate("/admin/listado-empleados"), 2000);
    } catch (err) {
      setMensaje("Error al actualizar empleado.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url('/e3b929eb-c37d-4ff6-8cdf-87a8420463fb.png')` }}
    >
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
          disabled
        />

        <label htmlFor="fechanacimiento">Fecha de nacimiento</label>
        <input
          type="date"
          name="fechanacimiento"
          value={form.fechanacimiento}
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

        {cargandoSucursales ? (
          <p>Cargando sucursales...</p>
        ) : (
          <>
            <label htmlFor="sucursal">Sucursal</label>
            <select
              id="sucursal"
              name="sucursal"
              value={form.sucursal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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

      {mensaje && (
        <p className="mt-4 bg-white bg-opacity-80 text-black py-2 px-4 rounded shadow">
          {mensaje}
        </p>
      )}
    </div>
  );
}

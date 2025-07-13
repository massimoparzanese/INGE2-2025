export default async function eliminarEmpleado(dni) {
  try {
    const response = await fetch(`http://localhost:3001/empleados/${dni}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al eliminar empleado");
    }

    return { ok: true, message: result.message };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

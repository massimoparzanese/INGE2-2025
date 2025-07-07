// src/components/FormularioCliente.jsx

import CalendarioFechaNacimiento from "./CalendarioNacimiento";


const OPCIONES_ADICIONALES = [
  { nombre: 'Silla de bebé', precio: 50 },
  { nombre: 'Tanque lleno', precio: 80 },
  { nombre: 'Seguro', precio: 100 },
];

export default function FormularioPresencial({ formData, setFormData }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAdicional = (adicional) => {
    setFormData((prev) => {
      const yaSeleccionado = prev.adicionales.find(
        (a) => a.nombre === adicional.nombre
      );
      return {
        ...prev,
        adicionales: yaSeleccionado
          ? prev.adicionales.filter((a) => a.nombre !== adicional.nombre)
          : [...prev.adicionales, adicional],
      };
    });
  };

  return (
    <div className="mt-6 p-4 bg-[#2c3e50] rounded-lg shadow-inner space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Complete los datos para continuar:
      </h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white">
          DNI
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
          />
        </label>

        <label className="text-sm text-white">
          Nombre completo
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
          />
        </label>

        <label className="text-sm text-white block">
          Fecha de nacimiento <br />
          <CalendarioFechaNacimiento
            value={formData.fechaNacimiento}
            onChange={(date) =>
                setFormData((prev) => ({
                ...prev,
                fechaNacimiento: date
                }))
            }
            placeholder="26/6/2011"
            />

        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-white mb-2">Adicionales:</p>
        <div className="flex flex-col gap-1 text-white text-sm">
          {OPCIONES_ADICIONALES.map((opcion) => (
            <label key={opcion.nombre}>
              <input
                type="checkbox"
                checked={formData.adicionales.some(
                  (a) => a.nombre === opcion.nombre
                )}
                onChange={() => toggleAdicional(opcion)}
                className="mr-2"
              />
              {opcion.nombre} (${opcion.precio} USD)
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

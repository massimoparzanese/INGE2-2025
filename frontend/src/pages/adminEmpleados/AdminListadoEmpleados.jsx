
import { Link} from 'react-router-dom';
import { PencilIcon, Trash2Icon, Plus} from 'lucide-react';
import useObtenerEmpleados from '../../hooks/useObtenerEmpleados.js';
import eliminarEmpleado from './EliminarEmpleado.jsx';

export default function AdminListadoEmpleados(){
    

    const { empleados, cargando } = useObtenerEmpleados();


    return (
        <>
        <div className="flex justify-center items-center min-h-screen bg-red-800 p-4 pt-20 pb-10">
        <div className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
        <Link
            to="/agregar-empleado" className="absolute top-4 right-4 text-white hover:text-red-700 bg-green-500 rounded-4xl transition-colors">
                <Plus className="w-8 h-8 " />
        </Link>
        {cargando ? (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-4">Cargando empleados...</p>
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 pt-4">
                      {empleados.map((empleado, i) => (
                         <div
                                className={`p-4 rounded-lg border cursor-pointer flex gap-4 items-center transition-all`}
                            >
                            <img
                                src= {`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(empleado.nombre)}`}
                                alt={empleado.nombre}
                                className="w-34 h-16 object-cover rounded-md border"
                            />
                            <div>
                                <p className="font-semibold text-lg">{empleado.nombre + ' ' + empleado.apellido}</p>
                                <p className="text-sm text-gray-600">Dni: {empleado.dni}</p>
                                <p className="text-sm text-gray-600">Fecha de nacimiento: {empleado.fechanacimiento}</p>
                                <p className="text-sm text-gray-600">E-mail: {empleado.email}</p>
                                <p className="text-sm text-gray-600">Sucursal:{empleado.Pertenece[0].Sucursal.nombre}</p>
                            </div>
                                <div className={`relative w-full right-0 grid col-span-4 z-10`}>
                                <div className={`absolute right-0 flex gap-2 -translate-y-2`}>
                                    <Link
                                    to={`/admin/editar-empleado/${empleado.dni}`}
                                    className={`px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300`}
                                    >
                                    <PencilIcon />
                                    </Link>
                                    <div
                                      className={`px-3 py-3 text-[#CDA053] bg-[#232129] rounded-full text-sm shadow-md transition hover:cursor-pointer hover:bg-[#CDA053] hover:text-[#232129] hover:scale-110 duration-300`}
                                      onClick={async () => {
                                        const result = await eliminarEmpleado(empleado.dni);

                                        if (result.ok) {
                                          alert("Empleado eliminado con éxito");
                                          window.location.reload(); // o usar una forma más reactiva si tenés hook
                                        } else {
                                          alert("Error: " + result.message);
                                        }
                                      }}
                                    >
                                      <Trash2Icon />
                                    </div>
                                </div>
                            </div>
                            
                            
                    </div>
                      ))}
                      {empleados.length === 0 && !cargando &&(
                        <p className="font-medium">La empresa no cuenta con empleados para listar.</p>
                      )}
                    </div>
                  </>
                )}
            </div>
            </div>
    </>)
}
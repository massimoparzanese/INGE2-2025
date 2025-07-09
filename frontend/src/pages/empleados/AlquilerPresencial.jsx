import { useState, useEffect } from "react"
import Calendario from "../../components/Calendario.jsx"
import { useAuth } from "../../context/AuthContext";
import FormularioPresencial from "../../components/FormPresencial.jsx";
export default function AlquilerPresencial(){
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [agregarConductor, setAgregarConductor] = useState(false);
    const [formData, setFormData] = useState({
    dni: '',
    fechaFin:null,
    adicionales: [],
    vehiculo: null,
    dniConductor: '',
    nombreConductor: '',
    fechaNacimientoConductor: null,
    });
    const calcularMonto = () => {
    const dias = Math.ceil(
        (new Date(formData.fechaFin) - new Date(formData.fechaInicio)) / (1000 * 60 * 60 * 24)
    );
    const precioPorDia = formData.vehiculo?.precio || 0;
        return dias * precioPorDia;
    };
    const handleSeleccionarVehiculo = (vehiculo) => {
    setFormData((prev) => ({
        ...prev,
        vehiculo,
    }));
    };
    const handleSeleccionarFecha = (fecha) => {
    setFormData((prev) => ({
        ...prev,
        fechaFin: fecha,
    }));
    };

   const handleAccept = async () => {
    // Busca los vehículos al backend que estén disponibles en las fechas
    if (user) {
        try {
            setIsLoading(true);
            setBusquedaRealizada(true);
            const response = await fetch(`http://localhost:3001/reservas/disponibles/presencial`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user,
                    fechaFin: formData.fechaFin
                }),
            });

            if (!response.ok) throw new Error('Error en la respuesta de la API');

            const data = await response.json();
            console.log(JSON.stringify(data))
            setVehicles(data.disponible || []);
        } catch (e) {
            console.error('Error al obtener vehículos:', e);
        } finally {
            setIsLoading(false);
        }
    }
};
    function validarConductor(formData, agregarConductor) {
        if (!agregarConductor) return true; // Si no hay conductor, no hace falta validar

        if (!formData.dniConductor || !formData.nombreConductor || !formData.fechaNacimientoConductor) {
            alert("Por favor, complete todos los datos del conductor.");
            return false;
        }

        const nacimiento = new Date(formData.fechaNacimientoConductor);
        const hoy = new Date();
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();

        const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

        if (esMenor) {
            alert("El conductor debe ser mayor de 18 años.");
            return false;
        }

        return true;
    }
 const registrarReservaEIniciarPago = async () => {
      try {

        console.log("📅 Fecha de nacimiento:", formData.fechaNacimientoConductor);
        console.log("🧾 DNI:", formData.dniConductor);
        console.log("🧾 Nombre:", formData.nombreConductor);
        if (!validarConductor(formData, agregarConductor)) {
        return; 
        }

        const existeUsuarioResponse = await fetch(`http://localhost:3001/acceso/${formData.dni}`, {
          method: "GET",  
          credentials: "include",
        });
        const existeUsuario = await existeUsuarioResponse.json();  
        if (!existeUsuario.email || existeUsuario.status >= 400) {
          alert(existeUsuario.message || "Usuario no encontrado o error en la autenticación."); 
          return;
        }        
        const reservaPayload = {
          vehiculo: formData.vehiculo.patente,
          fechaInicio: Date.now(),
          fechaFin: formData.fechaFin,
          monto: calcularMonto() + formData.adicionales.reduce((total, item) => total + item.precio, 0),
          email: existeUsuario.email,
          ...(agregarConductor && {
            dniConductor: formData.dniConductor,
            nombreConductor: formData.nombreConductor,
            })

        };

        console.log("📤 Payload enviado al backend:", reservaPayload);

        const response = await fetch("http://localhost:3001/reservas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(reservaPayload),
        });

        const data = await response.json();

        if (!data?.id) {
          alert("Error al registrar la reserva.");
          return;
        }

        const pagoResponse = await fetch("http://localhost:3001/api/pagos/crear-preferencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idReserva: data.id }),
        });

        const pagoData = await pagoResponse.json();

        if (pagoData.id) {
          window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${pagoData.id}`;
        } else {
          alert("Error al generar el pago.");
        }

      } catch (error) {
        console.error("Error en la reserva o pago:", error);
        alert("Hubo un problema al procesar la reserva y el pago.");
      }
    };
    useEffect(() => {
    if (!agregarConductor) {
        setFormData((prev) => ({
        ...prev,
        dniConductor: '',
        nombreConductor: '',
        fechaNacimientoConductor: null,
        }));
    }
    }, [agregarConductor]);

    return (
        <section className="flex justify-center items-center min-h-screen pt-20 ">
            <aside className="bg-[#1e2a38] text-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                {/* Mostrar calendario si no hay vehículos o si no se buscó aún */}
                {(vehicles.length === 0 && !isLoading) || !busquedaRealizada ? (
                <>
                    {busquedaRealizada && vehicles.length === 0 && (
                    <p className="text-red-300 text-sm font-semibold mb-2">
                        No hay vehículos disponibles en esa fecha. Intente con otra.
                    </p>
                    )}
                    <h2 className="text-xl font-semibold mb-4">Bienvenido</h2>
                    <p className="text-xs font-semibold mb-2">
                    ¿En qué fechas desea ver vehículos disponibles?
                    </p>
                    <Calendario setFec={handleSeleccionarFecha} minimo={Date.now()} />
                    {formData.fechaFin && (
                    <div className="pt-4">
                        <button
                        onClick={() => {
                            handleAccept();
                        }}
                        className="mb-4 px-4 py-2 bg-blue-400 text-white rounded-2xl transition cursor-pointer"
                        >
                        Ver vehículos disponibles
                        </button>
                    </div>
                    )}
                    

                </>
                ) : (
                    <>
                    {isLoading && busquedaRealizada && (
                    <p className="mt-2 text-sm text-blue-300 animate-pulse">
                        Buscando autos disponibles...
                    </p>
                    )}
                
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 px-4">
                    {vehicles.map(vehicle => (
                    <li
                        key={vehicle.patente}
                        onClick={() => handleSeleccionarVehiculo(vehicle)}
                        className={`group relative cursor-pointer rounded-2xl border-4 border-[#7c1212] overflow-hidden shadow-lg transition-transform duration-300
                        ${
                            formData.vehiculo?.patente === vehicle.patente
                            ? 'ring-2 ring-yellow-400'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: '#430505' }}
                    >
                        <img
                        src={vehicle.foto}
                        alt={`Foto del ${vehicle.Modelo.marca} ${vehicle.modelo}`}
                        className="w-full h-72 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center px-4 text-white text-center">
                        <p className="font-bold text-lg mb-1">
                            {vehicle.Modelo.marca} {vehicle.modelo}
                        </p>
                        <p className="text-sm">💲 {vehicle.precio} USD / día</p>
                        <p className="text-sm">Patente: {vehicle.patente}</p>
                        <p className="text-sm">🕒 Año: {vehicle.anio}</p>
                        <p className="text-sm">👥 Capacidad: {vehicle.capacidad} personas</p>
                        <p className="text-sm">🛣 {vehicle.kms.toLocaleString()} km</p>
                        </div>
                        <div className="absolute bottom-0 w-full text-center text-xs text-gray-100 bg-[#7c1212] py-1 font-semibold tracking-wide">
                        {vehicle.Modelo.marca} - {vehicle.modelo}
                        </div>
                    </li>
                    ))}
                </ul>
                </>
                )}
                {formData.vehiculo && (
                <FormularioPresencial formData={formData} setFormData={setFormData} agregarConductor={agregarConductor} setAgregarConductor={setAgregarConductor} />
                )}
                {formData.dni !== '' && formData.nombre !== '' &&
                formData.fechaNacimiento !== null && (
                <div className="pt-4">
                    <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => registrarReservaEIniciarPago()}

                    >
                    Confirmar y Pagar
                    </button>
                </div>
                )}

            </aside>
            </section>

    )
}
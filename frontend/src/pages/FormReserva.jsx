import {useState, useEffect, useContext} from "react";
import Calendario from "../components/Calendario.jsx"
import { useSucursalesFetch } from "../hooks/useSucursalesFetch.jsx";
import { AuthContext } from "../context/AuthContextFunct.jsx";
import { useNavigate } from "react-router-dom";
export default function FormReserva (){
  const {sucursales,cargando} = useSucursalesFetch();
  const [fechaInicio, setFechaInicio] = useState(false);
  const [fechaFin, setFechaFin] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [accept, setAccept] = useState(false);
  const [aceptarSucursal, setAceptarSucursal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [aceptarVehiculo, setAceptarVehiculo] = useState(false);
  const [agregarConductor, setAgregarConductor] = useState(false);
  const [dniConductor, setDniConductor] = useState("");
  const [nombreConductor, setNombreConductor] = useState("");
  const [fechaNacimientoConductor, setFechaNacimientoConductor] = useState(""); // solo para validación
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const calcularMonto = () => {
  const dias = Math.ceil(
    (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
  );
  const precioPorDia = vehiculoSeleccionado?.precio || 0;
    return dias * precioPorDia;
  };
  const handleSeleccionar = (sucursal) => {
    setSucursalSeleccionada(sucursal);
  };
  const handleSeleccionarVehiculo = (vehicle) => {
    setVehiculoSeleccionado(vehicle);
  };
  useEffect(() => {
    if(!accept && !sucursalSeleccionada && !fechaInicio && !fechaFin) return;
      const fetchVehiculos = async () => {
        try {
          const response = await fetch(`http://localhost:3001/reservas/disponibles`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sucursal: sucursalSeleccionada.nombre,
              fechaInicio: fechaInicio,
              fechaFin: fechaFin
            }),
          });

          if (!response.ok) throw new Error('Error en la respuesta de la API');

          const data = await response.json();

          if (data) {
            setVehicles(data.disponible || []);
            console.log(JSON.stringify(data));
          }
        } catch (e) {
          console.error('Error al obtener vehiculos:', e);
        }
      };

      fetchVehiculos();
    }, [accept, sucursalSeleccionada, fechaInicio, fechaFin]);
    useEffect(() => {
      if (vehicles.length === 0) {
        const timer = setTimeout(() => {
          setFechaInicio(null); // o "" según cómo manejes el estado
          setFechaFin(null);
          setAccept(false)
        }, 2000);

        return () => clearTimeout(timer); // Limpieza del timeout si cambia antes
      }
    }, [accept]);
    useEffect(() => {
      console.log(isAuthenticated)
      if(!isAuthenticated)
        navigate('/');

    }, [isAuthenticated, navigate]);

    const registrarReservaEIniciarPago = async () => {
      try {

        console.log("📅 Fecha de nacimiento:", fechaNacimientoConductor);
console.log("🧾 DNI:", dniConductor);
console.log("🧾 Nombre:", nombreConductor);
        if (agregarConductor) {
        if (!dniConductor || !nombreConductor || !fechaNacimientoConductor) {
          alert("Por favor, complete todos los datos del conductor.");
          return;
        }

        const nacimiento = new Date(fechaNacimientoConductor);
        const hoy = new Date();
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();

        const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

        if (esMenor) {
          alert("El conductor debe ser mayor de 18 años.");
          return;
        }
      }


        const reservaPayload = {
          vehiculo: vehiculoSeleccionado.patente,
          fechaInicio,
          fechaFin,
          monto: calcularMonto(),
          email: user,
          ...(agregarConductor && {
            dniConductor,
            nombreConductor,
          }),
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

  
    return(
     
    <div className="flex justify-center items-center min-h-screen pt-20 ">
    <div className="bg-green-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <h2 className="text-xl font-semibold mb-4">Reservar un Vehículo</h2>
       {!accept ? (
      <>
       

        {cargando ? (
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Cargando sucursales...</p>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : sucursales.length > 0 ? (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {sucursales.map(sucursal => (
              <li
                key={sucursal.nombre}
                onClick={() => handleSeleccionar(sucursal)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  sucursalSeleccionada === sucursal
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium">{sucursal.nombre}</p>
                <p className="text-sm text-gray-600">{sucursal.direccion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-medium">No hay sucursales disponibles</p>
        )}
        {sucursalSeleccionada && !aceptarSucursal && (
          <div className="pt-5">
          <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => {setAceptarSucursal(true)}}
            >
                Aceptar
              </button>
          </div>
        )}
        {sucursalSeleccionada && aceptarSucursal && (
          <>
            <div className="mt-4 p-4 bg-blue-100 rounded-md text-center">
              <p className="text-blue-700 font-medium">
                Sucursal seleccionada: {sucursalSeleccionada.nombre}
              </p>
              <p className="text-sm text-blue-600">{sucursalSeleccionada.direccion}</p>
            </div>
            <Calendario setFec={setFechaInicio} />
          </>
        )}

        {fechaInicio && (
          <Calendario setFec={setFechaFin} minimo={fechaInicio} />
        )}

        {fechaFin && (
          <button
            onClick={() => setAccept(true)}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Aceptar
          </button>
        )}
      </>
    ) : (
      <div className="text-center p-10 ">
        <ul className="space-y-5 max-h-[30rem] overflow-y-auto px-2">
          {vehicles.map(vehicle => (
            <li
              key={vehicle.modelo + vehicle.kms}
              onClick={() => handleSeleccionarVehiculo(vehicle)}
              className={`p-5 rounded-xl cursor-pointer transition-colors flex gap-6 bg-white shadow-md
                ${
                  vehiculoSeleccionado?.patente === vehicle.patente
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <img
                src={vehicle.foto}
                alt={`Foto del ${vehicle.Modelo.marca} ${vehicle.modelo}`}
                className="w-36 h-24 object-cover rounded-md shadow-sm"
              />
              <div className="text-left">
                <p className="font-semibold text-lg text-gray-800">
                  {vehicle.Modelo.marca} {vehicle.modelo}
                </p>
                <p className="text-sm text-gray-700">💲 Precio p/día: {vehicle.precio} USD</p>
                 <p className="text-sm text-gray-700">🕒 Año {vehicle.anio} </p>
                <p className="text-sm text-gray-700">👥 Capacidad: {vehicle.capacidad} personas</p>
                <p className="text-sm text-gray-700">🛣 Kilómetros: {vehicle.kms.toLocaleString()} km</p>
              </div>
            </li>
          ))}
        </ul>

        {vehiculoSeleccionado && (
          <>
            <div className="pt-6">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => setAceptarVehiculo(true)}
              >
                Registrar reserva
              </button>
            </div>

            <div className="pt-4 text-left">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agregarConductor}
                  onChange={(e) => setAgregarConductor(e.target.checked)}
                />
                ¿Desea agregar un conductor?
              </label>
            </div>

            {agregarConductor && (
              <div className="pt-4 space-y-4">
                <input
                  type="text"
                  placeholder="DNI del conductor"
                  value={dniConductor}
                  onChange={(e) => setDniConductor(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Nombre completo del conductor"
                  value={nombreConductor}
                  onChange={(e) => setNombreConductor(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={fechaNacimientoConductor || ""}
                  onChange={(e) => setFechaNacimientoConductor(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </>
        )}


        {aceptarVehiculo && (
          <div className="pt-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={registrarReservaEIniciarPago}
            >
              Confirmar y Pagar
            </button>
          </div>
        )}
      </div>

    )}
    {accept && vehicles.length === 0 && (
      <p>No hay vehículos en las fechas solicitadas</p>
    )}
      </div>
    </div>


  
  )

  
}


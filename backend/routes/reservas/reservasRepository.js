import { estadoReservaRepository } from "../estadoReserva/estadoReservaRepository.js";
import supabase from "../supabaseClient.js";
import { vehiculosRepository } from "../vehiculos/vehiculosRepository.js";
import ReservaUtils from "./reservaUtils.js";

export class reservasRepository {

    static async patenteEnReservas(fechaInicio, fechaFin, sucursal){
            // 1. Traer todos los autos de la sucursal
            const data = await vehiculosRepository.getSpecifyAutosInfo(sucursal);

            if (data.status >= 400) {
                return {
                status: 400,
                message: "No se pudieron obtener los vehículos de la sucursal",
                metaData: data,
                };
            }

            const disponibles = [];
            // 2. Para cada vehículo, verificar si tiene reservas superpuestas
            /*
            for (const vehiculo of data.metaData) {
                const { data: reservas, error: errorReservas } = await supabase
                .from('Reserva')
                .select('fechainicio, fechafin')
                .eq('vehiculo', vehiculo.patente); // o vehiculo.id, según tu modelo
                if (errorReservas) {
                    return {
                        status: 400,
                        message: "No se pudo obtener las reservas de un vehículo",
                        metaData: errorReservas,
                    };
                }
                
                const hayConflicto = reservas.some(r =>
                    ReservaUtils.overlaps(fechaInicio, fechaFin, r.fechainicio, r.fechafin)
                );
                
                if (hayConflicto) {
                    console.log(`Vehículo ${vehiculo.patente} NO disponible: conflicto de fechas`);
                } else {
                    disponibles.push(vehiculo);
                }

            }
            */
            for (const vehiculo of data.metaData) {
                // Paso 1: obtener todas las reservas de este vehículo
                const { data: reservas, error: errorReservas } = await supabase
                    .from('Reserva')
                    .select('id, vehiculo, fechainicio, fechafin')
                    .eq('vehiculo', vehiculo.patente);

                if (errorReservas) {
                    return {
                    status: 400,
                    message: "No se pudieron obtener las reservas del vehículo",
                    metaData: errorReservas,
                    };
                }

                if (!reservas.length) {
                    disponibles.push(vehiculo);
                    continue;
                }

                // Paso 2: obtener todos los estados asociados a esas reservas
                const reservaIds = reservas.map(r => r.id);

                const { data: estados, error: errorEstados } = await supabase
                    .from('reserva_estado')
                    .select('reserva, estado, fechainicio') // se necesita fecha para saber cuál es el último estado
                    .in('reserva', reservaIds);

                if (errorEstados) {
                    return {
                    status: 400,
                    message: "No se pudieron obtener los estados de las reservas",
                    metaData: errorEstados,
                    };
                }

                // Paso 3: quedarnos con el último estado de cada reserva
                const estadoActualPorReserva = new Map();

                for (const e of estados) {
                    const actual = estadoActualPorReserva.get(e.reserva);
                    if (!actual || new Date(e.fecha) > new Date(actual.fecha)) {
                    estadoActualPorReserva.set(e.reserva, e);
                    }
                }

                // Paso 4: filtrar solo las reservas cuyo estado actual sea 'activa'
                const reservasActivas = reservas.filter(r => {
                    const estadoFinal = estadoActualPorReserva.get(r.id);
                    return estadoFinal?.estado === 'activa';
                });

                // Paso 5: buscar superposición de fechas
                const hayConflicto = reservasActivas.some(r =>
                    ReservaUtils.overlaps(fechaInicio, fechaFin, r.fechainicio, r.fechafin)
                );

                if (hayConflicto) {
                    console.log(`Vehículo ${vehiculo.patente} NO disponible: conflicto de fechas`);
                } else {
                    disponibles.push(vehiculo);
                }
                }


            return {
                status: 200,
                disponible: disponibles
            };
    }
    
    static async crearReserva(vehiculo, fechaInicio, fechaFin, montoPorDia, email, dniConductor = null, nombreConductor = null) {


        const result = await estadoReservaRepository.insertarEstado("activa");
        if (result.status >= 400){
            return result;
        }

        const fechainicio = new Date(fechaInicio);
        const fechafin = new Date(fechaFin);
        const dias = Math.ceil((fechafin - fechainicio) / (1000 * 60 * 60 * 24));

        const reserva = {
            vehiculo : vehiculo,
            fechainicio : fechaInicio,
            fechafin : fechaFin,
            monto: montoPorDia ,
            persona: email ,
            dniConductor: dniConductor,
            nombreConductor: nombreConductor
        }

        const {data : reserva1, error : errorReserva } = await supabase 
            .from('Reserva')
            .insert(reserva)
            .select('*');

        if (errorReserva) {
            return {
                status: 400,
                message: "Error al insertar la reserva en la base de datos",
                metaData: errorReserva,
            };
        }

        const reservaEstado = {
            reserva : reserva1[0].id,
            estado : 'activa',
            fechainicio : fechaInicio,
            fechafin : fechaFin
        }


        const {data : reserva_estado1, error : errorReservaEstado} = await supabase
            .from('reserva_estado')
            .insert(reservaEstado)
            .select()

        if (errorReservaEstado) {
            return {
                status: 400,
                message: "Error al insertar el reserva estado en la base de datos",
                metaData: errorReserva,
            };
        }

        console.log(reserva1)
        return {
            status: 200,
            message: "Reserva exitosa",
            id: reserva1[0].id
        };
    }

    static async obtenerReservas(email){
        const { data, error } = await supabase
        .from('Reserva')
        .select(`
            *,
            Vehiculo (
            politica,
            capacidad,
            kms,
            foto,
            patente,
            sucursal,
            precio,
            anio,
            Modelo (
                nombre,
                marca,
                anio
            )
            ),
            reserva_estado (
                reserva,
                estado
            )
        `)
     .eq('persona', email);

                console.log(error)
            if (error) {
            return { status: 400, message: 'error obteniendo reservas del usuario' };
            }

            return { status: 200, data };
    }

    static async vehiculosPendientesEntrega(sucursal) {
  // 1. Traer todos los vehículos de la sucursal
  const data = await vehiculosRepository.getSpecifyAutosInfo(sucursal);

  if (data.status >= 400) {
    return {
      status: 400,
      message: "No se pudieron obtener los vehículos de la sucursal",
      metaData: data,
    };
  }

  const pendientes = [];

  for (const vehiculo of data.metaData) {
    // Obtener todas las reservas del vehículo
    const { data: reservas, error: errorReservas } = await supabase
      .from("Reserva")
      .select("id, vehiculo, fechainicio, fechafin")
      .eq("vehiculo", vehiculo.patente);

    if (errorReservas) {
      return {
        status: 400,
        message: "No se pudieron obtener las reservas del vehículo",
        metaData: errorReservas,
      };
    }

    if (!reservas.length) continue;

    // Obtener estados de esas reservas
    const reservaIds = reservas.map((r) => r.id);

    const { data: estados, error: errorEstados } = await supabase
      .from("reserva_estado")
      .select("reserva, estado, fechainicio")
      .in("reserva", reservaIds);

    if (errorEstados) {
      return {
        status: 400,
        message: "No se pudieron obtener los estados de las reservas",
        metaData: errorEstados,
      };
    }

    // Mapear el último estado por reserva
    const estadoActualPorReserva = new Map();

    for (const e of estados) {
      const actual = estadoActualPorReserva.get(e.reserva);
      if (!actual || new Date(e.fechainicio) > new Date(actual.fechainicio)) {
        estadoActualPorReserva.set(e.reserva, e);
      }
    }

    // Filtrar reservas activas que aún no han sido entregadas
    const hoy = new Date();
    const reservasPendientes = reservas.filter((r) => {
      const estadoFinal = estadoActualPorReserva.get(r.id);
      return (
        estadoFinal?.estado === "activa" &&
        new Date(r.fechainicio) <= hoy
      );
    });

    if (reservasPendientes.length > 0) {
      pendientes.push(vehiculo);
    }
  }

  return {
    status: 200,
    pendientes,
  };
}


}
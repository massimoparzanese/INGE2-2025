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


            return {
                status: 200,
                disponible: disponibles
            };
    }
    
    static async crearReserva(vehiculo, fechaInicio, fechaFin, montoPorDia, email){

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
            persona: email 
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
            stauts: 200,
            message: "Reserva exitosa",
            id: reserva1[0].id
        };
    }

}
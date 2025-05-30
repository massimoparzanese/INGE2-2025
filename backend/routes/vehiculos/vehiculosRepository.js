import supabase from "../supabaseClient.js";

export class vehiculosRepository {

    static async getAllAutos(){
        const { data, error } = await supabase
        .from('Vehiculo')
        .select(`
            patente,
            modelo,
            foto,
            capacidad,
            kms,
            sucursal,
            Modelo (
            marca
            )
        `);
        if (error)
            return {
                status: 400,
                message: "No se pudo obtener información de los vehículos",
                medaData: error,
            };
        return {
            status: 201,
            message: "Información de los vehículos obtenida con éxito",
            metaData: data,
        };
    }
    
    static async getSpecifyAutosInfo(sucursal){
        const { data, error } = await supabase
        .from('Vehiculo')
        .select(`
            patente
            modelo,
            foto,
            capacidad,
            kms,
            Modelo (
            marca
            )
        `)
        .eq('sucursal', sucursal);
        if(error)
           return {
                    status: 400,
                    message: "No se pudo obtener información de los vehículos",
                    metaData: error,
            }
        return {
            status: 201,
            message: "Información de los vehículos obtenida con exito.",
            metaData: data,
        }   
    }

   static async eliminarVehiculo(patente){
        //Verifico si tiene o no reservas activas, que lo puse como regla de negocio
        const hoy = new Date().toISOString();

        const { data: reservas, error: errorReservas } = await supabase
        .from("Reserva")
        .select("*")
        .eq("vehiculo", patente)
        .gte("fechafin", hoy);

        if(errorReservas){
            return {
                status: 500,
                message: "Error al verificar reservas",
                metaData: errorReservas,
            };
        }

        if (reservas.length > 0) {
            return {
                status: 400,
                message: "No se puede eliminar el vehículo porque tiene reservas activas o futuras",
                metaData: reservas,
            };
        }

        //Verifico si el vehículo está en uso usando las tablas EstadoVehiculo y vehiculo_estado
        const { data: estadoData, error: errorEstado } = await supabase
        .from("vehiculo_estado")
        .select(`
            idauto,
            EstadoVehiculo: idestado (
                estado
            )
        `)
        .eq("idauto", patente)
        .maybeSingle();

        if (errorEstado) {
            return {
                status: 500,
                message: "Error al obtener estado de vehiculo",
                metaData: errorEstado,
            };
        }

        
        if (estadoData?.EstadoVehiculo?.estado?.toLowerCase() === "en uso") {
            return {
                status: 400,
                message: "No se puede eliminar un vehículo que está en uso",
                metaData: estadoData,
            };
        }

        //Elimino el vehículo
        const { error: errorEliminar } = await supabase
        .from("Vehiculo")
        .delete()
        .eq("patente", patente)
        .select();
        console.log(errorEliminar)
        if (errorEliminar){
            return {
                status: 500,
                message: "Error al eliminar el vehiculo",
                metaData: errorEliminar,
            };
        }

        return {
            status: 200,
            message: `Vehiculo con patente ${patente} eliminado exitosamente`,
        };

    }

    static async editarVehiculo (patente, nuevosDatos){
        const { data, error } = await supabase
        .from ('Vehiculo')
        .update(nuevosDatos)
        .eq('patente', patente);

        if(error) {
            return {
                status: 400,
                message: "Error al actualizar el vehículo",
                metaData: error,
            };
        }

        return {
            status: 200,
            message: "Vehículo actualizado correctamente",
            metaData: data,
        }
    }

    static async agregarVehiculo(nuevoVehiculo) {
   
        const { patente } = nuevoVehiculo;
         // Verifico que no exista la patente
        const { data: existe, error: errorExistencia } = await supabase
            .from("Vehiculo")
            .select("*")
            .eq("patente", patente)
            .maybeSingle();

        if (errorExistencia && errorExistencia.code !== "PGRST116") {
            return {
                status: 500,
                message: "Error al verificar la patente",
                metaData: errorExistencia,
            };
        }

        if (existe) {
            return {
                status: 400,
                message: "Ya existe un vehículo con esa patente",
            };
        }

        const { error: errorInsert } = await supabase
            .from("Vehiculo")
            .insert(nuevoVehiculo);

        if (errorInsert) {
            return {
                status: 500,
                message: "Error al insertar el vehículo",
                metaData: errorInsert,
            };
        }

        return {
            status: 201,
            message: "Vehículo agregado exitosamente",
        };
    }

}
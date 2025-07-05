import supabase from "../supabaseClient.js";
export class estadoVehiculoRepository {
    static async insertarEstado(estado){
        const { data: estadoExiste, error: errorEstado } = await supabase
            .from("EstadoVehiculo")
            .select("estado")
            .eq("estado", estado)
            .maybeSingle();

        if (errorEstado) {
            return { status: 500, message: "Error al verificar estado", metaData: errorEstado };
        }

        if (!estadoExiste) {
            const { error: errorInsertEstado } = await supabase
            .from("EstadoVehiculo")
            .insert({ estado: estado });

            if (errorInsertEstado) {
            return { status: 500, message: "Error al insertar estado", metaData: errorInsertEstado };
            }
            return {
            status: 200,
            message: "Estado insertado con éxito"
        }
        }
        return {
            status: 200,
            message: "Estado existente en el sistema"
        }
    }
} 
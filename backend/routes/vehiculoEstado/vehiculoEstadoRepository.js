import supabase from "../supabaseClient.js";
export class vehiculoEstadoRepository {

    static async insertVehiculoEstado (patente){
        // 4. Insertar el estado inicial en VehiculoEstado
        const { error: errorInsertEstadoVehiculo } = await supabase
            .from("vehiculo_estado")
            .insert({
            idauto: patente,
            idestado: "Disponible",
            fechainicio: new Date().toISOString(),
            });

        if (errorInsertEstadoVehiculo) {
            return {
            status: 500,
            message: "Vehículo agregado, pero error al asignar estado",
            metaData: errorInsertEstadoVehiculo,
            };
        }
    return {
            status: 200,
            message: "Estado de vehículo junto con fecha insertado con exito",
    }

}
}
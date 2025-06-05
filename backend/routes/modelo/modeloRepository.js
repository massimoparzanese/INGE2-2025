
import supabase from "../supabaseClient.js";
export class modeloRepository{
    static async insertModelo(modelo, anio, marca){
         // 3. Verificar si existe el modelo
            const { data: modeloExistente, error: errorModelo } = await supabase
                .from("Modelo")
                .select("nombre, anio")
                .eq("nombre", modelo)
                .eq("anio", anio)
            if (errorModelo) {
                return {
                    status: 500,
                    message: "Error al verificar el modelo",
                    metaData: errorModelo,
                };
            }

            if (!modeloExistente || modeloExistente.length === 0) {
                const { data: nuevoModelo, error: errorInsertModelo } = await supabase
                    .from("Modelo")
                    .insert({
                        nombre: modelo,
                        anio,
                        marca,
                    })
                    .select("*");

                if (errorInsertModelo) {
                    return {
                        status: 500,
                        message: "Error al insertar el modelo",
                        metaData: errorInsertModelo,
                    };
                }
                return {
                    status:200,
                    message: "Modelo insertado con éxito",
                }
            }
            
            return {
                status:200,
                message: "Modelo ya existe"
            }
    }
}
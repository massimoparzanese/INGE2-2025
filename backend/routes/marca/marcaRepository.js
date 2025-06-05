import supabase from "../supabaseClient.js";

export class marcaRepository {

    static async insertarMarca(marca){
        // 2. Verificar si existe la marca
            const { data: marcaExistente, error: errorMarca } = await supabase
                .from("Marca")
                .select("nombre")
                .eq("nombre", marca)
                .maybeSingle();

            if (errorMarca) {
                return {
                    status: 500,
                    message: "Error al verificar la marca",
                    metaData: errorMarca,
                };
            }

            

            if (!marcaExistente) {
                const { data: nuevaMarca, error: errorInsertMarca } = await supabase
                    .from("Marca")
                    .insert({ nombre: marca })
                    .select("*")
                    .single();

                if (errorInsertMarca) {
                    return {
                        status: 500,
                        message: "Error al insertar la marca",
                        metaData: errorInsertMarca,
                    };
                }
                return {
                    status: 200,
                    message: "Marca insertada con éxito"
                }

            }

            return {
                status: 200,
                message: "La marca ya existe en el sistema"
            }
    }
}

import supabase from "../supabaseClient.js";
export class politicaDeReembolsoRepository {

    static async insertPolitica(pol){
        const { data: existente, error: errorBusqueda } = await supabase
        .from("PoliticaDeReembolso")
        .select("porcentaje")
        .eq("porcentaje", pol)
        .maybeSingle();

    if (errorBusqueda) {
        return {
        status: 500,
        message: "Error al verificar la existencia del porcentaje",
        metaData: errorBusqueda,
        };
    }

    // 2. Si ya existe, devolver error
    if (existente) {
        return {
        status: 400,
        message: `Ya existe una política con el porcentaje ${pol}%`,
        };
    }

    // 3. Insertar si no existe
    const { error: errorInsertar } = await supabase
        .from("PoliticaDeReembolso")
        .insert({ porcentaje: pol });

    if (errorInsertar) {
        return {
        status: 500,
        message: "Error al insertar la política de reembolso",
        metaData: errorInsertar,
        };
    }
    return {
        status: 200,
        message: "Politica insertada con éxito"
    }
    }
}
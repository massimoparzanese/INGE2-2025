import supabase from "../supabaseClient.js";

export class sucursalesRepository {

    static async getAllSucursalesInfo(){

            let { data: sucursales, error } = await supabase.from("Sucursal").select("nombre, direccion,id");
            if (error)
                return {
                    status: 400,
                    message: "No se pudo obtener información de los blogs",
                    metaData: error,
                }
            return {
                status: 200,
                message: "Información de las sucursales obtenida con exito.",
                metaData: sucursales,
            };
    }
    static async getSucursalById(id){
        const {data, error} = await supabase
        .from('Sucursal')
        .select('nombre')
        .eq('id', id)

        if(error){
             return {
                    status: 400,
                    message: "No se pudo obtener la sucursal",
                    metaData: error,
                }
        }
        return {
            status:200,
            sucursal: data[0].nombre
        }
    }
    static async consultarGanancias(fechaInicio, fechaFin) {
  const hoy = new Date().toISOString().split("T")[0];

  if (fechaInicio > hoy) {
    return {
      status: 400,
      error: "❌ La fecha de inicio no puede ser mayor a la fecha actual.",
    };
  }

  if (fechaFin < fechaInicio) {
    return {
      status: 400,
      error: "❌ La fecha de fin no puede ser menor a la de inicio.",
    };
  }

  const { data, error } = await supabase
    .from("Reserva")
    .select(`
      monto,
      vehiculo (
        sucursal (
          id,
          nombre
        )
      )
    `)
    .gte("fechainicio", fechaInicio)
    .lte("fechafin", fechaFin);

  if (error) {
    console.error("Error al obtener reservas:", error);
    return { status: 500, error: "❌ Error al consultar las ganancias." };
  }

  const gananciasPorSucursal = {};

  for (const reserva of data) {
    const nombreSucursal = reserva.vehiculo?.sucursal?.nombre?.trim();
    if (!nombreSucursal) continue;

    if (!gananciasPorSucursal[nombreSucursal]) {
      gananciasPorSucursal[nombreSucursal] = 0;
    }

    gananciasPorSucursal[nombreSucursal] += reserva.monto || 0;
  }

  const resultado = Object.entries(gananciasPorSucursal).map(
    ([sucursal, total]) => ({
      sucursal,
      total,
    })
  );

  return {
    status: 200,
    data: resultado,
  };
}
}
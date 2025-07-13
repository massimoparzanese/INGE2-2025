import { estadoVehiculoRepository } from "../estadoVehiculo/estadoVehiculoRepository.js";
import { marcaRepository } from "../marca/marcaRepository.js";
import { modeloRepository } from "../modelo/modeloRepository.js";
import { politicaDeReembolsoRepository } from "../politicaDeReembolso/politicaDeReembolsoRepository.js";
import supabase from "../supabaseClient.js";
import { vehiculoEstadoRepository } from "../vehiculoEstado/vehiculoEstadoRepository.js";

export class vehiculosRepository {

  static async getAllAutos() {
    const { data, error } = await supabase
      .from('Vehiculo')
      .select(`
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
          Marca (
            nombre
          )
        )
      `)
      .eq('eliminado', false);

    if (error) {
      return {
        status: 400,
        message: "No se pudo obtener información de los vehículos",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: "Información de los vehículos obtenida con éxito",
      metaData: data,
    };
  }

  static async getSpecifyAutosInfo(sucursal) {
    const { data, error } = await supabase
      .from('Vehiculo')
      .select(`
        patente,
        modelo,
        foto,
        capacidad,
        kms,
        precio,
        anio,
        Modelo (
          marca
        )
      `)
      .eq('sucursal', sucursal)
      .eq('eliminado', false);

    if (error) {
      return {
        status: 400,
        message: "No se pudo obtener información de los vehículos",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: "Información de los vehículos obtenida con éxito.",
      metaData: data,
    };
  }

  static async getAutosPorEmpleado(idEmpleado) {
    console.log("Id del empleado: "+ idEmpleado);
    // 1. Buscar el ID de la sucursal del empleado
    const { data: sucursalData, error: errorSucursal } = await supabase
      .from('Pertenece')
      .select('idsucursal')
      .eq('idempleado', idEmpleado)
      .maybeSingle();
      console.log("📦 Resultado Pertenece:", sucursalData);


    if (errorSucursal || !sucursalData) {
      return {
        status: 404,
        message: "No se pudo encontrar la sucursal del empleado",
        metaData: errorSucursal || {},
      };
    }

    // 2. Buscar el nombre de la sucursal
    const { data: sucursalNombreData, error: errorNombre } = await supabase
      .from('Sucursal')
      .select('nombre')
      .eq('id', sucursalData.idsucursal)
      .maybeSingle();

    if (errorNombre || !sucursalNombreData) {
      return {
        status: 404,
        message: "No se pudo obtener el nombre de la sucursal",
        metaData: errorNombre || {},
      };
    }

    const nombreSucursal = sucursalNombreData.nombre;

    // 3. Buscar vehículos de esa sucursal (usando el nombre)
    const { data, error } = await supabase
      .from('Vehiculo')
      .select(`
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
          Marca (
            nombre
          )
        )
      `)
      .eq('sucursal', nombreSucursal)
      .eq('eliminado', false);

    if (error) {
      return {
        status: 500,
        message: "Error al obtener los vehículos de la sucursal",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: data.length > 0 
        ? "Vehículos obtenidos correctamente"
        : "La sucursal no cuenta con vehículos para listar",
      metaData: data,
    };
  }

  static async eliminarVehiculo(patente){
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

      // Eliminación lógica
      const { error: errorEliminar } = await supabase
          .from("Vehiculo")
          .update({ eliminado: true })
          .eq("patente", patente);

      if (errorEliminar){
          return {
              status: 500,
              message: "Error al eliminar lógicamente el vehiculo",
              metaData: errorEliminar,
          };
      }

      return {
          status: 200,
          message: `Vehículo con patente ${patente} eliminado lógicamente.`,
      };
  }


  //editar vehiculo
  static async editarVehiculo (patente, nuevosDatos){
      const { data, error } = await supabase
      .from ('Vehiculo')
      .update({
          modelo: nuevosDatos.modelo,
          foto: nuevosDatos.foto,
          capacidad: nuevosDatos.capacidad,
          kms: nuevosDatos.kms,
          sucursal: nuevosDatos.sucursal,
          precio: nuevosDatos.precio
      })
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
      const { marca, modelo, anio } = nuevoVehiculo;
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
              message: "La patente ya se encuentra en uso",
          };
      }
      let resultado;

      // 1. Insertar o verificar marca
      resultado = await marcaRepository.insertarMarca(marca);
      if (resultado.status > 400) return resultado;

      // 2. Insertar o verificar modelo
      resultado = await modeloRepository.insertModelo(modelo, anio, marca);
      if (resultado.status > 400) return resultado;

      // 3. Insertar estado si no existe (Disponible)
      resultado = await estadoVehiculoRepository.insertarEstado("Disponible");
      if (resultado.status > 400) return resultado;

      // 4. Insertar política si no existe
      resultado = await politicaDeReembolsoRepository.insertPolitica(nuevoVehiculo.politica);
      if (resultado.status > 400) return resultado;

      // 5. Insertar el vehículo (sin campo 'marca' si no forma parte del schema)
      const { marca: _, ...vehiculoSinMarca } = nuevoVehiculo;

      console.log("vehiculo sin marca:" + JSON.stringify(vehiculoSinMarca));
      const { error: errorInsert } = await supabase
      .from("Vehiculo")
      .insert(vehiculoSinMarca)
      .select(); // Podés agregar campos específicos si querés el ID u otros

      if (errorInsert) {
      return {
          status: 500,
          message: "Error al insertar el vehículo",
          metaData: errorInsert,
      };
      }

      // 6. Insertar en tabla intermedia VehiculoEstado con estado = Disponible
      resultado = await vehiculoEstadoRepository.insertVehiculoEstado(vehiculoSinMarca.patente);
      if (resultado.status > 400) return resultado;

      // 7. Retornar éxito
      return {
      status: 200,
      message: "Vehículo insertado correctamente",
      };

  }

  static async entregarAuto(patente, email) {{
    // 1. Verificar que exista una reserva con esa patente
    const { data: reserva, error: errorReserva } = await supabase
      .from('Reserva')
      .select('id, persona')
      .eq('vehiculo', patente)
      .maybeSingle();

    if (!reserva) {
      return { status: 404, error: '❌ No existe una reserva para ese vehículo.' };
    }

    // 2. Verificar que el email coincida con la persona de la reserva
    if (reserva.persona !== email) {
      return { status: 403, error: '❌ Esa reserva no corresponde al email ingresado.' };
    }

    const idReserva = reserva.id;

    // 3. Verificar que exista un estado activo sin fechafin
    const { data: estadoActivo } = await supabase
      .from('reserva_estado')
      .select('*')
      .eq('reserva', idReserva)
      .eq('estado', 'activa') // usamos directamente el texto
      .is('fechafin', null)
      .lte('fechainicio', new Date().toISOString())
      .maybeSingle();

    if (!estadoActivo) {
      return {
        status: 400,
        error: '❌ El vehículo ya fue entregado.'
      };
    }

    // 4. Cerrar el estado "activa" agregando la fecha de fin
    const { error: errorUpdate } = await supabase
    .from('reserva_estado')
    .update({ fechafin: new Date().toISOString() })
    .eq('reserva', idReserva)
    .eq('estado', 'activa')
    .is('fechafin', null);

    if (errorUpdate) {
      return { status: 500, error: '❌ Error al cerrar el estado activo.' };
    }

    // 5. Insertar nuevo estado "entregada"
    const { error: errorInsert } = await supabase
      .from('reserva_estado')
      .insert([{
        reserva: idReserva,
        estado: 'entregada',
        fechainicio: new Date().toISOString()
      }]);

    if (errorInsert) {
      return { status: 500, error: '❌ Error al registrar la entrega.' };
    }

    return {
      status: 200,
      mensaje: '✅ Vehículo entregado correctamente.'
    };
  }

    }

  static async devolverAuto(patente) {
    // 1. Buscar reserva asociada a la patente
    const { data: reserva, error: errorReserva } = await supabase
      .from("Reserva")
      .select("id")
      .eq("vehiculo", patente)
      .maybeSingle();

    if (!reserva) {
      return { status: 404, error: "❌ No existe una reserva para ese vehículo." };
    }

    const idReserva = reserva.id;

    // 2. Verificar si hay un estado "entregada" sin fechafin
    const { data: estadoEntregado } = await supabase
      .from("reserva_estado")
      .select("*")
      .eq("reserva", idReserva)
      .eq("estado", "entregada")
      .is("fechafin", null)
      .maybeSingle();

    if (!estadoEntregado) {
      return {
        status: 400,
        error: "❌ No existe una devolucion pendiente para ese vehiculo"
      };
    }

    // 3. Cerrar estado "entregada"
    const { error: errorUpdate } = await supabase
    .from("reserva_estado")
    .update({ fechafin: new Date().toISOString() })
    .eq("reserva", idReserva)
    .eq("estado", "entregada")
    .is("fechafin", null);

    if (errorUpdate) {
      return {
        status: 500,
        error: "❌ Error al cerrar el estado entregado."
      };
    }

    return {
      status: 200,
      mensaje: "✅ Vehículo devuelto correctamente."
    };
  }

  static async getVehiculosPendientesPorEmail(email) {
    try {
      console.log("📩 Email recibido en getVehiculosPendientesPorEmail:", email);

      const { data: empleado, error: errorEmpleado } = await supabase
        .from("Persona")
        .select("id, Rol(nombre)")
        .eq("email", email)
        .eq("Rol.nombre", "empleado")
        .maybeSingle();

      if (errorEmpleado || !empleado) {
        console.log("❌ Persona no encontrada o error:", errorEmpleado);
        return {
          status: 404,
          message: "Empleado no encontrado",
          metaData: errorEmpleado || null,
        };
      }

      const { data: sucursalData, error: errorSucursal } = await supabase
        .from("Pertenece")
        .select("idsucursal")
        .eq("idempleado", empleado.id)
        .maybeSingle();

      if (errorSucursal || !sucursalData) {
        console.log("❌ Sucursal no encontrada:", errorSucursal);
        return {
          status: 404,
          message: "No se pudo encontrar la sucursal del empleado",
          metaData: errorSucursal || null,
        };
      }

      console.log("✅ Sucursal encontrada:", sucursalData);
      const idSucursal = sucursalData.idsucursal;

      // Obtener el nombre real de la sucursal según su ID
      const { data: sucursalNombreData, error: errorNombre } = await supabase
        .from('Sucursal')
        .select('nombre')
        .eq('id', idSucursal)
        .maybeSingle();

      if (errorNombre || !sucursalNombreData) {
        return {
          status: 404,
          message: "No se pudo obtener el nombre de la sucursal",
          metaData: errorNombre || null,
        };
      }

      const nombreSucursal = sucursalNombreData.nombre;

      const { data: reservasActivas, error: errorReservas } = await supabase
        .from("reserva_estado")
        .select("reserva")
        .eq("estado", "activa")
        .is("fechafin", null);

      if (errorReservas) {
        console.error("❌ Error al obtener reservas activas:", errorReservas);
        return {
          status: 500,
          message: "Error al obtener reservas activas",
          metaData: errorReservas,
        };
      }

      const idsReservasActivas = reservasActivas.map(r => r.reserva);

      console.log("🟡 Reservas activas encontradas:", reservasActivas); //borrar

      if (idsReservasActivas.length === 0) {
        return {
          status: 200,
          message: "No hay reservas activas",
          metaData: [],
        };
      }

      const { data: reservasVehiculos, error: errorVehiculosReserva } = await supabase
        .from("Reserva")
        .select("vehiculo")
        .in("id", idsReservasActivas);

      if (errorVehiculosReserva) {
        console.error("❌ Error al obtener vehículos de reservas:", errorVehiculosReserva);
        return {
          status: 500,
          message: "Error al obtener vehículos de reservas",
          metaData: errorVehiculosReserva,
        };
      }

      console.log("🚘 Vehículos asociados a las reservas activas:", reservasVehiculos);

      const patentesActivas = reservasVehiculos.map(r => r.vehiculo);

      const { data: vehiculos, error: errorVehiculos } = await supabase
        .from("Vehiculo")
        .select(`
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
            Marca (
              nombre
            )
          )
        `)
        .eq("sucursal", nombreSucursal)
        .in("patente", patentesActivas);

      if (errorVehiculos) {
        console.error("❌ Error al obtener vehículos:", errorVehiculos);
        return {
          status: 500,
          message: "Error al obtener vehículos pendientes",
          metaData: errorVehiculos,
        };
      }

      console.log("✅ Vehículos pendientes encontrados:", vehiculos);
      return {
        status: 200,
        message: "Vehículos pendientes encontrados",
        metaData: vehiculos,
      };
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      return {
        status: 500,
        message: "Error inesperado del servidor",
        metaData: error,
      };
    }
  }


  //Listar vehículos para devolver
  static async getVehiculosParaDevolverPorEmail(email) {
    try {

      //acá se puede declarar fecha si es que vamos a poner alguna limitación (no creo)

      const { data: empleado, error: errorEmpleado } = await supabase
        .from("Persona")
        .select("id, Rol(nombre)")
        .eq("email", email)
        .eq("Rol.nombre", "empleado")
        .maybeSingle();

      if (errorEmpleado || !empleado) {
        console.log("❌ Persona no encontrada o error:", errorEmpleado);
        return {
          status: 404,
          message: "Empleado no encontrado",
          metaData: errorEmpleado || null,
        };
      }

      const { data: sucursalData, error: errorSucursal } = await supabase
        .from("Pertenece")
        .select("idsucursal")
        .eq("idempleado", empleado.id)
        .maybeSingle();

      if (errorSucursal || !sucursalData) {
        console.log("❌ Sucursal no encontrada:", errorSucursal);
        return {
          status: 404,
          message: "No se pudo encontrar la sucursal del empleado",
          metaData: errorSucursal || null,
        };
      }

      console.log("✅ Sucursal encontrada:", sucursalData);
      const idSucursal = sucursalData.idsucursal;

      // Obtener el nombre real de la sucursal según su ID
      const { data: sucursalNombreData, error: errorNombre } = await supabase
        .from('Sucursal')
        .select('nombre')
        .eq('id', idSucursal)
        .maybeSingle();

      if (errorNombre || !sucursalNombreData) {
        return {
          status: 404,
          message: "No se pudo obtener el nombre de la sucursal",
          metaData: errorNombre || null,
        };
      }

      const nombreSucursal = sucursalNombreData.nombre;

      const { data: reservasEntregadas, error: errorReservas } = await supabase
        .from("reserva_estado")
        .select("reserva")
        .eq("estado", "entregada")
        .is("fechafin", null); //cambiar

      if (errorReservas) {
        console.error("❌ Error al obtener reservas entregadas:", errorReservas);
        return {
          status: 500,
          message: "Error al obtener reservas entregadas",
          metaData: errorReservas,
        };
      }

      const idsReservasEntregadas = reservasEntregadas.map(r => r.reserva);

      console.log("🟡 Reservas entregadas encontradas:", reservasEntregadas); //borrar

      if (idsReservasEntregadas.length === 0) {
        return {
          status: 200,
          message: "No hay reservas entregadas",
          metaData: [],
        };
      }

      const { data: reservasVehiculos, error: errorVehiculosReserva } = await supabase
        .from("Reserva")
        .select("vehiculo")
        .in("id", idsReservasEntregadas);

      if (errorVehiculosReserva) {
        console.error("❌ Error al obtener vehículos de reservas:", errorVehiculosReserva);
        return {
          status: 500,
          message: "Error al obtener vehículos de reservas",
          metaData: errorVehiculosReserva,
        };
      }

      console.log("🚘 Vehículos asociados a las reservas entregadas:", reservasVehiculos);

      const patentesEntregadas = reservasVehiculos.map(r => r.vehiculo);

      const { data: vehiculos, error: errorVehiculos } = await supabase
        .from("Vehiculo")
        .select(`
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
            Marca (
              nombre
            )
          )
        `)
        .eq("sucursal", nombreSucursal)
        .in("patente", patentesEntregadas);

      if (errorVehiculos) {
        console.error("❌ Error al obtener vehículos:", errorVehiculos);
        return {
          status: 500,
          message: "Error al obtener vehículos pendientes",
          metaData: errorVehiculos,
        };
      }

      console.log("✅ Vehículos para devolver encontrados:", vehiculos);
      return {
        status: 200,
        message: "Vehículos para devolver encontrados",
        metaData: vehiculos,
      };
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      return {
        status: 500,
        message: "Error inesperado del servidor",
        metaData: error,
      };
    }
  }

  //Estadísticas de reservas
  static async contarAlquileresEntreFechas(fechaInicio, fechaFin) {
    const { data, error } = await supabase
      .from("Reserva")
      .select("vehiculo, id")
      .lte("fechainicio", fechaFin)   // empieza antes o igual que el fin del rango
      .gte("fechafin", fechaInicio);  // termina después o igual que el inicio del rango

    if (error) {
      return {
        status: 500,
        message: "Error al obtener reservas",
        metaData: error,
      };
    }

    // Agrupar por vehículo
    const conteo = {};
    for (const reserva of data) {
      const patente = reserva.vehiculo;
      conteo[patente] = (conteo[patente] || 0) + 1;
    }

    // Obtener nombres de vehículos
    const patentes = Object.keys(conteo);

    if (patentes.length === 0) {
      return {
        status: 200,
        message: "No hubo reservas en esas fechas",
        metaData: [],
      };
    }

    const { data: vehiculosData, error: errorVehiculos } = await supabase
      .from("Vehiculo")
      .select(`
        patente,
        Modelo (
          nombre,
          Marca (
            nombre
          )
        )
      `)
      .in("patente", patentes);

    if (errorVehiculos) {
      return {
        status: 500,
        message: "Error al obtener nombres de vehículos",
        metaData: errorVehiculos,
      };
    }

    // Formatear resultado
    const resultado = vehiculosData.map((vehiculo) => {
      const nombreModelo = vehiculo.Modelo?.nombre || "Modelo";
      const nombreMarca = vehiculo.Modelo?.Marca?.nombre || "Marca";
      const nombreCompleto = `${nombreMarca} ${nombreModelo}`;
      return {
        vehiculo: nombreCompleto,
        cantidad: conteo[vehiculo.patente] || 0,
      };
    });

    return {
      status: 200,
      message: "Conteo de alquileres exitoso",
      metaData: resultado,
    };
  }

}

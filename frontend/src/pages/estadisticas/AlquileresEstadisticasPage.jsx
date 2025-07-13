"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import CalendarioFechaNacimiento from "@/components/CalendarioNacimiento"

export default function AlquileresEstadisticasPage() {
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [datosGrafico, setDatosGrafico] = useState([])
  const [consultado, setConsultado] = useState(false)

  const chartConfig = {
    cantidad: {
      label: "Cantidad de alquileres",
    },
  }

  const consultarDatos = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor seleccioná ambas fechas.")
      return
    }

    if (fechaFin < fechaInicio) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.")
      return
    }

    setConsultado(true)

    try {
      const res = await fetch("http://localhost:3001/alquileres/estadisticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaInicio: fechaInicio.toISOString().split("T")[0],
          fechaFin: fechaFin.toISOString().split("T")[0],
        }),
      })

      const data = await res.json()
      setDatosGrafico(data.metaData || [])
    } catch (error) {
      console.error("Error al consultar estadísticas:", error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen pt-40 px-4 pb-10">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">
          Estadísticas de Alquileres
        </h2>
        <p className="text-center text-muted-foreground">
          Seleccioná un rango de fechas para visualizar cuántas veces se alquiló cada vehículo.
        </p>

        {/* Fechas y botón */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Fecha de inicio:</label>
          <CalendarioFechaNacimiento
            value={fechaInicio}
            onChange={setFechaInicio}
            placeholder="Seleccionar fecha de inicio"
            minDate={new Date('2000-01-01')}
          />

          {fechaInicio && (
            <>
              <label className="text-sm font-medium">Fecha de fin:</label>
              <CalendarioFechaNacimiento
                value={fechaFin}
                onChange={setFechaFin}
                placeholder="Seleccionar fecha de fin"
                minDate={fechaInicio}
                maxDate={new Date()}
              />
            </>
          )}

          {fechaInicio && fechaFin && (
            <div className="pt-2 text-center">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={consultarDatos}
              >
                Consultar
              </button>
            </div>
          )}
        </div>

        {/* Gráfico */}
        {consultado && datosGrafico.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No se encontraron alquileres en el rango seleccionado.
          </p>
        )}

        {datosGrafico.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Vehículos alquilados entre {fechaInicio?.toLocaleDateString()} y {fechaFin?.toLocaleDateString()}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={datosGrafico}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="vehiculo"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="cantidad"
                    strokeWidth={2}
                    radius={8}
                    activeBar={({ ...props }) => (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke="#000"
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    )}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Datos consultados correctamente <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Mostrando cantidad de alquileres por vehículo
              </div>
            </CardFooter>
          </Card>
        )}
      </section>
    </div>
  )
}

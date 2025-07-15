import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  AreaSeries,
} from 'lightweight-charts';

export default function VentasAutosChart() {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);

  const [sedansData, setSedansData] = useState([
    { time: Math.floor(new Date('2023-01-01').getTime() / 1000), value: 30 },
    { time: Math.floor(new Date('2023-02-01').getTime() / 1000), value: 40 },
    { time: Math.floor(new Date('2023-03-01').getTime() / 1000), value: 35 },
  ]);
  const [suvData, setSuvData] = useState([
    { time: Math.floor(new Date('2023-01-01').getTime() / 1000), value: 20 },
    { time: Math.floor(new Date('2023-02-01').getTime() / 1000), value: 25 },
    { time: Math.floor(new Date('2023-03-01').getTime() / 1000), value: 30 },
  ]);
  const [pickupsData, setPickupsData] = useState([
    { time: Math.floor(new Date('2023-01-01').getTime() / 1000), value: 10 },
    { time: Math.floor(new Date('2023-02-01').getTime() / 1000), value: 15 },
    { time: Math.floor(new Date('2023-03-01').getTime() / 1000), value: 20 },
  ]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: 700,
      height: 400,
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      rightPriceScale: { visible: true },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    chartInstance.current = chart;

    // Agregar las 3 series usando addSeries(AreaSeries, opciones)
    const sedansSeries = chart.addSeries(AreaSeries, {
      lineColor: 'blue',
      topColor: 'rgba(0, 0, 255, 0.4)',
      bottomColor: 'rgba(0, 0, 255, 0.1)',
      title: 'Sedán',
    });

    const suvSeries = chart.addSeries(AreaSeries, {
      lineColor: 'green',
      topColor: 'rgba(0, 128, 0, 0.4)',
      bottomColor: 'rgba(0, 128, 0, 0.1)',
      title: 'SUV',
    });

    const pickupsSeries = chart.addSeries(AreaSeries, {
      lineColor: 'red',
      topColor: 'rgba(255, 0, 0, 0.4)',
      bottomColor: 'rgba(255, 0, 0, 0.1)',
      title: 'Pickups',
    });

    sedansSeries.setData(sedansData);
    suvSeries.setData(suvData);
    pickupsSeries.setData(pickupsData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartInstance.current = null;
    };
  }, [sedansData, suvData, pickupsData]);

  return (
    <div className="max-w-[700px] mx-auto my-5 p-8 pt-20">
  <div className="flex justify-center gap-5 mb-2 font-bold font-sans text-white">
    <div className="flex items-center gap-1.5">
      <div className="w-4 h-4 bg-blue-600"></div>Sedán
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-4 h-4 bg-green-600"></div>SUV
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-4 h-4 bg-red-600"></div>Pickups
    </div>
  </div>
  <div ref={chartContainerRef} />
</div>

  );
}
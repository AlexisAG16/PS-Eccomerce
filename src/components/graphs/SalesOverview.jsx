import { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement // 🚩 Asegúrate de registrar BarElement si usas type: 'bar'
} from 'chart.js';
import { Chart } from 'react-chartjs-2'; // 🚩 Cambia Line por Chart para gráficos mixtos

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // 🚩 Registro necesario
  Title,
  Tooltip,
  Legend,
  Filler
);

// Dentro de SalesOverview.jsx
const SalesOverview = ({ dataServer }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top', align: 'end' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { drawOnChartArea: false },
        ticks: { callback: (value) => `$${value.toLocaleString()}` }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: true },
        ticks: { stepSize: 1 }
      },
    },
  };

  useEffect(() => {
    // 🚩 CAMBIO CLAVE: return simple (undefined), NUNCA return null.
    if (!dataServer || dataServer.length === 0) return;

    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(26, 82, 118, 0.4)');
    gradient.addColorStop(1, 'rgba(26, 82, 118, 0)');

    setChartData({
      labels: dataServer.map(d => d.date),
      datasets: [
        {
          type: 'line',
          label: 'Ingresos ($)',
          data: dataServer.map(d => d.amount),
          borderColor: '#1a5276',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Cant. Órdenes',
          data: dataServer.map(d => d.orderCount),
          backgroundColor: '#f29964',
          borderRadius: 5,
          yAxisID: 'y1',
        }
      ],
    });
  }, [dataServer]);

  // Si no hay datos, mostramos un loader o un placeholder
  if (!dataServer || dataServer.length === 0) {
    return <div className="h-[300px] flex items-center justify-center italic text-gray-400">Cargando métricas...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 h-[450px]">
      {/* 🚩 Usamos <Chart /> genérico para soportar el mix de línea y barras */}
      <Chart ref={chartRef} type='bar' data={chartData} options={options} />
    </div>
  );
};

export default SalesOverview;
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BookingChartProps {
  type?: 'bookings' | 'revenue';
}

export default function BookingChart({ type = 'bookings' }: BookingChartProps) {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: type === 'bookings' ? 'Bookings' : 'Revenue',
        data: type === 'bookings' 
          ? [30, 45, 35, 50, 40, 60]
          : [3000, 4500, 3500, 5000, 4000, 6000],
        fill: true,
        borderColor: type === 'bookings' ? '#2563eb' : '#16a34a',
        backgroundColor: type === 'bookings' 
          ? 'rgba(37, 99, 235, 0.1)' 
          : 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}
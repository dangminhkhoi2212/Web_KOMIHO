import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.defaults.font.family = 'sans-serif';
ChartJS.defaults.font.size = '15';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);
const CircelChart = ({ title, labelsProp, dataProp }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                position: 'bottom',
            },
        },
    };

    const data = {
        labels: labelsProp,
        datasets: [
            {
                label: 'Users',
                data: dataProp,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default CircelChart;

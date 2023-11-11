import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const BarChart = ({ labels, datasets, title, label, yLabel, xLabel }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            x: {
                title: {
                    display: xLabel ? true : false,
                    text: xLabel,
                },
            },
            y: {
                title: {
                    display: yLabel ? true : false,
                    text: yLabel,
                },
            },
        },
    };
    const data = {
        labels,
        datasets: [
            {
                label,
                data: datasets,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderWidth: 1,
            },
        ],
    };
    return <Bar data={data} options={options} />;
};
export default BarChart;

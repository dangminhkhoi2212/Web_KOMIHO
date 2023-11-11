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
ChartJS.defaults.font.family = 'sans-serif';
ChartJS.defaults.font.size = '15';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);
const StackedChart = ({
    title,
    label,
    labelsProp,
    datasetsProp,
    xLabel,
    yLabel,
}) => {
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
        scales: {
            x: {
                title: {
                    display: xLabel ? true : false,
                    text: xLabel,
                },
                stacked: true,
            },
            y: {
                title: {
                    display: yLabel ? true : false,
                    text: yLabel,
                },
                stacked: true,
            },
        },
    };

    const data = {
        labels: labelsProp,
        datasets: [
            {
                label,
                data: datasetsProp,
                backgroundColor: '#C7EEFF',
            },
        ],
    };

    return <Bar options={options} data={data} />;
};

export default StackedChart;

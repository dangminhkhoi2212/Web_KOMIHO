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
const LineChart = ({
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
        labels: labelsProp,
        datasets: [
            {
                label,
                data: datasetsProp,
                borderColor: '#FF869E',
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default LineChart;

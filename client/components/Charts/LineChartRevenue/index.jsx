'use client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
);
import PickDate from './PickDate';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getStatisticRevenue } from '@/services/statistic.service';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

const LineChartRevenue = () => {
    const userId = useSelector(getUserId);
    const [filter, setFilter] = useState({
        filterDay: new Date(),
        filterMonth: { month: '', year: new Date().getFullYear() },
        filterYear: '',
        filterBy: 'day',
    });
    const getRevenueMutation = useMutation({
        mutationFn: ({ filterDay, filterMonth, filterYear, filterBy }) => {
            return getStatisticRevenue({
                userId,
                filterDay,
                filterMonth,
                filterYear,
                filterBy,
            });
        },
    });
    useEffect(() => {
        getRevenueMutation.mutate({
            filterDay: filter.filterDay,
            filterMonth: filter.filterMonth,
            filterYear: filter.filterYear,
            filterBy: filter.filterBy,
        });
    }, []);
    const dataQuery = getRevenueMutation?.data?.orders;

    const revenue = dataQuery?.map((data) => {
        return {
            x: Date.parse(data.createdAt),
            y: data.total,
        };
    });
    console.log(
        '🚀 ~ file: index.jsx:51 ~ LineChartRevenue ~ revenue:',
        revenue,
    );
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: filter.xTimeUnit,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };
    const data = {
        datasets: [
            {
                data: revenue,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                label: 'Revenue',
            },
        ],
    };
    const handleChangeSelect = (select) => {
        console.log(
            '🚀 ~ file: index.jsx:97 ~ handleChangeSelect ~ select:',
            select,
        );
        getRevenueMutation.mutate({ date: select });
    };
    useEffect(() => {
        getRevenueMutation.mutate({
            filterDay: filter.filterDay,
            filterMonth: filter.filterMonth,
            filterYear: filter.filterYear,
            filterBy: filter.filterBy,
        });
    }, [filter]);
    return (
        <div className="relative">
            {getRevenueMutation.isLoading && <Loading />}
            <PickDate filter={filter} setFilter={setFilter} />
            <Line options={options} data={data} />
        </div>
    );
};

export default LineChartRevenue;

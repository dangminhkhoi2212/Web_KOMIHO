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
import PickDate from './Picker';
import { useMutation } from '@tanstack/react-query';
import { getStatisticRevenue } from '@/services/statistic.service';
import { useEffect, useRef } from 'react';
import Loading from '@/components/Loading';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { route } from 'nextjs-routes';
import { formatISO } from 'date-fns';

const LineChartRevenue = () => {
    const searchParams = useSearchParams();
    const filterDay = searchParams.get('date');
    const filterMonth = searchParams.get('month');
    const filterYear = searchParams.get('year');
    const chartRef = useRef();
    const router = useRouter();
    const pathname = usePathname();

    let filterBy = { value: 'day', xTimeUnit: 'hour' };
    if (filterMonth) filterBy = { value: 'month', xTimeUnit: 'day' };
    else if (filterYear) filterBy = { value: 'year', xTimeUnit: 'month' };
    else filterBy = { value: 'day', xTimeUnit: 'hour' };

    const getRevenueMutation = useMutation({
        mutationFn: () => {
            return getStatisticRevenue({
                filterDay,
                filterMonth,
                filterYear,
                filterBy: filterBy.value,
            });
        },
        onSuccess(value) {
            chartRef.current.update();
        },
    });
    useEffect(() => {
        getRevenueMutation.mutate();
    }, [filterDay, filterMonth, filterYear]);
    const dataQuery = getRevenueMutation?.data?.orders;

    const revenue = dataQuery?.map((data) => {
        return {
            x: Date.parse(data.createdAt),
            y: data.total,
        };
    });

    const options = {
        responsive: true,
        skipNull: false,
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
                    unit: filterBy.xTimeUnit,
                },
                ticks: {
                    source: 'data',
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
    useEffect(() => {
        const newRoute = route({
            pathname,
            query: { date: formatISO(new Date(), { representation: 'date' }) },
        });
        router.replace(newRoute);
    }, []);
    return (
        <div className="relative">
            {getRevenueMutation.isLoading && <Loading />}
            <PickDate />
            <Line options={options} data={data} ref={chartRef} />
        </div>
    );
};

export default LineChartRevenue;

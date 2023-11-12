'use client';
import { clerkLogin } from '@/services/auth.service';
import { routes } from '../../routes';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalysisAdmin } from '@/services/statistic.service';
import { ListChecksIcon } from 'lucide-react';
import { createElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { NumericFormat } from 'react-number-format';
import { ClipboardList } from 'lucide-react';
import { Users } from 'lucide-react';
import { BadgeDollarSign } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import LineChart from '@/components/Charts/LineChart';
import StackedChart from '@/components/Charts/StackedChart';
import { Calendar } from '@/components/ui/calendar';
import AvatarText from '@/components/Avatar';
import Link from 'next/link';
import CardBox from '@/components/CardBox';
import Loading from '@/components/Loading';
import LineChartRevenue from '@/components/Charts/LineChartRevenue';
const DashboardPage = () => {
    const [date, setDate] = useState(new Date());
    const getAnalysisAdminQuery = useQuery({
        queryKey: ['analysis-admin'],
        queryFn: () => {
            return getAnalysisAdmin();
        },
    });
    const data = getAnalysisAdminQuery?.data;
    console.log('🚀 ~ file: page.jsx:20 ~ DashboardPage ~ data:', data);
    if (!data) return <></>;
    const cardsInfo = [
        {
            name: 'Total Users',
            value: data.totalUsers,
            icon: Users,
            color: 'bg-green-400',
            pattern: '',
        },
        {
            name: 'Total Orders',
            value: data.totalOrders,
            icon: ClipboardList,
            color: 'bg-red-400',
            pattern: '',
        },
        {
            name: 'Total Products',
            value: data.totalProducts,
            icon: PackageOpen,
            color: 'bg-yellow-400',
            pattern: '',
        },
        {
            name: 'Total Revenue',
            value: data.totalRevenue,
            icon: BadgeDollarSign,
            color: 'bg-blue-400',
            pattern: ' VND',
        },
    ];

    const labelsChartProducts = data?.analysisProduct?.map(
        (item) => item.month,
    );
    const datasetsChartProducts = data?.analysisProduct?.map(
        (item) => item.count,
    );

    const labelsChartRevenue = data?.analysisRevenue?.map((item) => item.month);
    const datasetsChartRevenue = data?.analysisRevenue?.map(
        (item) => item.revenue,
    );

    const topAllCustomers = data?.topAllCustomers?.map((item) => {
        return {
            _id: item.user._id,
            name: item.user.name,
            image: item.user.avatar.url,
            value: item.totalExpense,
        };
    });
    const topAllSellers = data?.topAllSellers?.map((item) => {
        return {
            _id: item.seller._id,
            name: item.seller.name,
            image: item.seller.avatar.url,
            value: item.totalRevenue,
        };
    });
    const topAllProducts = data?.topAllProducts?.map((item) => {
        return {
            _id: item._id,
            name: item.name,
            image: item.cover,
            value: item.sold,
        };
    });

    return (
        <div className="flex flex-col gap-4 relative">
            {getAnalysisAdminQuery.isLoading && <Loading />}
            <div className="grid grid-cols-4 gap-5">
                {cardsInfo.map((card, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-white hover:scale-105 transition-all duration-150 ease-in-out">
                        <div className="col-span-1 flex justify-center items-center">
                            {createElement(card.icon, {
                                size: '40',
                            })}
                        </div>
                        <div className="col-span-2 flex flex-col justify-end items-end">
                            <Badge className={cn(card.color, 'inline-block')}>
                                {card.name}
                            </Badge>
                            <NumericFormat
                                displayType="text"
                                value={card.value}
                                thousandSeparator
                                suffix={card.pattern}
                                renderText={(value) => (
                                    <p className="text-lg font-medium my-2">
                                        {value}
                                    </p>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className=" bg-white rounded-lg p-4">
                {/* <LineChart
                    datasetsProp={datasetsChartRevenue}
                    labelsProp={labelsChartRevenue}
                    yLabel={'VND'}
                    label={'Revenue'}
                    title={'Total revenue this year'}
                /> */}
                <LineChartRevenue />
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8  bg-white rounded-lg p-4">
                    <StackedChart
                        datasetsProp={datasetsChartProducts}
                        labelsProp={labelsChartProducts}
                        title={`New product every month in ${new Date().getFullYear()}`}
                        yLabel={'Quantity'}
                        label={'Total'}
                    />
                </div>
                <div className="col-span-4 bg-white flex justify-center items-center rounded-lg">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md  "
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <CardBox
                    data={topAllCustomers}
                    title="Top spending customers"
                    labelText={'Expense'}
                    suffix=" VND"
                    linkFunction={routes.store}
                />
                <CardBox
                    data={topAllSellers}
                    title="Top sellers revenue"
                    suffix=" VND"
                    linkFunction={routes.store}
                    labelText={'Revenue'}
                />
                <CardBox
                    data={topAllProducts}
                    title="Top sold products"
                    linkFunction={routes.productDetail}
                    labelText={'Sold'}
                />
            </div>
        </div>
    );
};

export default DashboardPage;

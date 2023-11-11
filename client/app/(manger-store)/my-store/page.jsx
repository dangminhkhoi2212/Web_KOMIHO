'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import { getUserId } from '@/redux/selector';
import { getStatistic } from '@/services/statistic.service';
import { useQuery } from '@tanstack/react-query';
import React, { createElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { Badge } from 'flowbite-react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { TbClipboardList } from 'react-icons/tb';
import {
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineStar,
    AiTwotoneStar,
} from 'react-icons/ai';
import AvatarText from '@/components/Avatar';
import routes from '@/routes';
import Link from 'next/link';
import { CiShop } from 'react-icons/ci';
import ImageIconProduct from '@/components/ProductImageCover';
import DoughnutChart from '@/components/Charts/DoughnoutChart';
import VerticalChart from '@/components/Charts/VerticalChart';
import LineChartRevenue from '@/components/Charts/LineChartRevenue';
const listNumber = ['red', 'success', 'yellow', 'indigo', 'dark'];
const page = () => {
    const userId = useSelector(getUserId);
    const getRevenueQuery = useQuery({
        queryKey: ['analysis-revenue'],
        queryFn: () => {
            return getStatistic(userId);
        },
        enabled: !!userId,
    });

    const data = getRevenueQuery?.data;
    const revenueData = data?.revenue;
    const topProducts = data?.topProducts;
    const topCustomers = data?.topCustomers;
    const [labelsLineRevenue, setLabelsLineRevenue] = useState();
    const [datasetsLineRevenue, setDatasetsLineRevenue] = useState();
    const [datasetsTopProducts, setDatasetsTopProducts] = useState();
    const [datasetsTopCustomers, setDatasetsTopCustomers] = useState();
    useEffect(() => {
        setLabelsLineRevenue(revenueData?.list?.map((item) => item.month));
        setDatasetsLineRevenue(
            revenueData?.list?.map((item) => item.totalRevenue),
        );
        setDatasetsTopProducts(topProducts?.map((item) => item.sold));
        setDatasetsTopCustomers(topCustomers?.map((item) => item.totalExpense));
    }, [data]);

    const listCards = [
        {
            name: 'Total Revenue',
            value: revenueData?.total,
            color: 'success',
            icon: RiMoneyDollarCircleLine,
        },
        {
            name: 'Total Rating',
            value: data?.totalRating,
            color: 'indigo',
            icon: AiOutlineStar,
        },
        {
            name: 'Total Order',
            value: data?.totalOrder,
            color: 'pink',
            icon: TbClipboardList,
        },
        {
            name: 'Total Favorite',
            value: data?.totalFavorite,
            color: 'lime',
            icon: AiOutlineHeart,
        },
    ];
    if (!userId || !getRevenueQuery?.data) return <></>;
    return (
        <div className="flex flex-col gap-3">
            <AccountTemplate title={'ANALYSIS'}></AccountTemplate>
            <div className="grid grid-cols-4 gap-5">
                {listCards.map((card, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-3 rounded-md bg-white p-5">
                        <div className="flex justify-between items-center">
                            <Badge size={'xl'} color={card.color}>
                                {card.name}
                            </Badge>
                            {createElement(card.icon, {
                                className: 'text-2xl',
                            })}
                        </div>
                        <NumericFormat
                            value={card.value}
                            thousandSeparator
                            displayType="text"
                            suffix={card.name === 'Total Revenue' ? ' VND' : ''}
                            renderText={(value) => (
                                <p className="text-xl font-medium">{value}</p>
                            )}
                        />
                    </div>
                ))}
            </div>
            <div className="rounded-md bg-white p-5">
                <LineChartRevenue />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-md p-5">
                    <Badge size={'xl'}> Top Outstanding Products</Badge>
                    <div className="w-full h-64 flex ">
                        <VerticalChart
                            labels={Array.from(
                                { length: topCustomers.length },
                                (v, i) => i + 1,
                            )}
                            datasets={datasetsTopCustomers}
                            label="Expense"
                            yLabel="VND"
                            xLabel="Customers rank"
                        />
                    </div>
                    <div className="flex gap-3 flex-col  justify-start">
                        {topCustomers?.map((customer, index) => (
                            <div
                                className="grid grid-cols-12 gap-5"
                                key={index}>
                                <div className="col-span-1 flex justify-center items-center h-full flex-col">
                                    <Badge
                                        color={listNumber[index]}
                                        size={'xl'}>
                                        {index + 1}
                                    </Badge>
                                </div>
                                <div className="col-span-11">
                                    <AvatarText
                                        name={customer?.user?.name}
                                        src={customer?.user?.avatar?.url}
                                        text={
                                            <Link
                                                className="flex justify-center items-center gap-2 p-1 ring-1 rounded-md hover:bg-primary/20 w-20"
                                                href={routes.store(
                                                    customer?.user?._id,
                                                )}>
                                                <CiShop />
                                                View
                                            </Link>
                                        }
                                    />
                                    <div className="flex flex-row gap-2 items-center mt-2">
                                        <p>
                                            <span className="text-gray-500 font-medium">
                                                Order(s):{' '}
                                            </span>
                                            <span className="font-medium">
                                                {customer.totalPurchases}
                                            </span>
                                        </p>
                                        <div className="w-[2px] h-4 bg-gray-300"></div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 font-medium">
                                                Total Expense:{' '}
                                            </span>
                                            <NumericFormat
                                                value={customer?.totalExpense}
                                                thousandSeparator
                                                displayType="text"
                                                suffix={' VND'}
                                                renderText={(value) => (
                                                    <p className=" font-medium">
                                                        {value}
                                                    </p>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-md p-5">
                    <Badge size={'xl'}> Top Outstanding Products</Badge>
                    <div className="w-full h-64 flex ">
                        <VerticalChart
                            labels={Array.from(
                                { length: topProducts.length },
                                (v, i) => i + 1,
                            )}
                            datasets={datasetsTopProducts}
                            label="Sold"
                            yLabel="Quantity"
                            xLabel="Products rank"
                        />
                    </div>
                    <div className="flex gap-3 flex-col  justify-start">
                        {topProducts?.map((product, index) => (
                            <div
                                key={product._id}
                                className="grid grid-cols-12 gap-3">
                                <div className="col-span-1 flex justify-center items-center h-full flex-col">
                                    <Badge
                                        color={listNumber[index]}
                                        size={'xl'}>
                                        {index + 1}
                                    </Badge>
                                </div>
                                <div className="col-span-3 place-self-center">
                                    <ImageIconProduct image={product.images} />
                                </div>
                                <div className="col-span-8 flex flex-col gap-3 justify-between">
                                    <p className="line-clamp-3">
                                        {product.name}
                                    </p>
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-gray-500">
                                            {product.sold} sold
                                        </p>

                                        <Link
                                            className=" px-2 py-1 ring-1 rounded-md hover:bg-primary/20 text-gray-500 text-xs"
                                            href={routes.productDetail(
                                                product._id,
                                            )}>
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;

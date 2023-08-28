'use client';
import CircelChart from '@/components/Charts/CircelChart';
import LineChart from '@/components/Charts/LineChart';
import { useEffect, useState } from 'react';

import { getUserRegisted } from '@/services/statistic.service';

const Home = () => {
    const [labelsLine, setLablesLine] = useState(new Array(12).fill(0));
    const [dataLine, setDataLine] = useState(new Array(12).fill(0));
    useEffect(() => {
        const getApi = async () => {
            try {
                let data = await getUserRegisted();
                setLablesLine((pre) => {
                    for (let i = 0; i < data.length; i++) {
                        pre[
                            data[i]._id.month - 1
                        ] = `${data[i]._id.month}/${data[i]._id.year}`;
                    }
                    return [...pre];
                });
                setDataLine((pre) => {
                    for (let i = 0; i < data.length; i++) {
                        pre[data[i]._id.month - 1] = data[i].count;
                    }
                    return [...pre];
                });
            } catch (error) {
                console.log('🚀 ~ file: page.jsx:17 ~ getApi ~ error:', error);
            }
        };
        getApi();
    }, []);
    return (
        <div className="">
            <div className="grid grid-cols-5 gap-3 content-center">
                <div className="col-span-3 bg-white rounded-2xl flex justify-center items-center px-3">
                    <LineChart
                        key={dataLine}
                        title={`Users registered over the years`}
                        labelsProp={labelsLine}
                        dataProp={dataLine}
                    />
                </div>
                <div className="col-span-2 bg-white rounded-2xl">
                    <CircelChart />
                </div>
            </div>
        </div>
    );
};
export default Home;

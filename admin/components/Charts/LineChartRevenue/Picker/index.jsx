'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import PickDay from './Pickday';
import PickMonth from './PickMonth';
import PickYear from './PickYear';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

const CalendarForm = () => {
    const searchParams = useSearchParams();
    const filterDay = searchParams.get('date');
    const filterMonth = searchParams.get('month');

    const filterYear = searchParams.get('year');
    const [optionPick, setOptionPick] = useState([
        { name: 'Day', picked: true, cpn: <PickDay /> },
        { name: 'Month', picked: false, cpn: <PickMonth /> },
        { name: 'Year', picked: false, cpn: <PickYear /> },
    ]);
    const handlePick = (name) => {
        const newOp = optionPick.map((op) => {
            if (op.name === name) {
                return {
                    ...op,
                    picked: true,
                };
            }
            return {
                ...op,
                picked: false,
            };
        });
        setOptionPick(newOp);
    };
    return (
        <div className="flex gap-5 justify-start items-center">
            <Popover>
                <PopoverTrigger>
                    <div className="flex justify-center items-center gap-2 ring-1 ring-gray-200 rounded-lg px-2 py-1">
                        <p className="text-sm font-medium">Filter by: </p>
                        <p>
                            {(filterDay &&
                                format(new Date(filterDay), 'dd/MM/yyy')) ||
                                (filterMonth &&
                                    format(new Date(filterMonth), 'MM/yyyy')) ||
                                filterYear}
                        </p>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2">
                    <ul className="flex justify-between">
                        {optionPick.map((op, index) => (
                            <li
                                key={index}
                                className="cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1"
                                onClick={() => handlePick(op.name)}>
                                {op.name}
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <div className="flex justify-center items-center">
                        {optionPick.map((op, index) => (
                            <div key={index}>
                                {op.picked ? (
                                    <div
                                        key={index}
                                        className="cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1">
                                        {op.cpn}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
export default CalendarForm;

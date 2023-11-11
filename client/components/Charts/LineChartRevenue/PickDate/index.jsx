'use client';

import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ISOTimeToDate, convertISO } from '@/utils/date';
const MONTHS = Array.from({ length: 12 }).map((_, i) => i + 1);

const currentYear = new Date().getFullYear();
const startYear = 2023;
const YEARS = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index,
);
const CalendarForm = ({ filter, setFilter }) => {
    const handelSelectDate = (date) => {
        const dateFm = new Date(date).toISOString();
        console.log(
            '🚀 ~ file: index.jsx:34 ~ handelSelectDate ~ dateFm:',
            dateFm,
        );
        setFilter({
            filterDay: dateFm,
            filterMonth: { month: '', year: '' },
            filterYear: '',
            filterBy: 'day',
            xTimeUnit: 'hour',
        });
    };
    const handleChangeSelectMonth = (value) => {
        setFilter((pre) => {
            return {
                ...pre,
                filterDay: '',
                filterMonth: { month: value, year: pre.filterMonth.year },
                filterBy: 'month',
                xTimeUnit: 'day',
            };
        });
    };
    const handleChangeSelectMonthYear = (value) => {
        setFilter((pre) => {
            return {
                ...pre,
                filterDay: '',
                filterMonth: {
                    month: pre.filterMonth.month,
                    year: value,
                },
                filterBy: 'month',
                xTimeUnit: 'day',
            };
        });
    };
    const handleChangeSelectYear = (value) => {
        setFilter((pre) => {
            return {
                ...pre,
                filterDay: '',
                filterYear: value,
                filterMonth: {
                    month: '',
                    year: '',
                },
                filterBy: 'year',
                xTimeUnit: 'month',
            };
        });
    };
    return (
        <div className="flex gap-5 justify-center items-center">
            <div className="flex gap-3 items-center">
                <div>Date: </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-fit pl-3 text-left font-normal',
                                !filter?.filterDay && 'text-muted-foreground',
                            )}>
                            {filter?.filterDay ? (
                                ISOTimeToDate(filter?.filterDay)
                            ) : (
                                <span>Date</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            // selected={filter.filterDay}
                            onSelect={(date) => handelSelectDate(date)}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex gap-3 items-center">
                <p>Month: </p>
                <Select
                    onValueChange={handleChangeSelectMonth}
                    value={filter.filterMonth.month}>
                    <SelectTrigger className="w-16">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Month</SelectLabel>
                            {MONTHS.map((m) => (
                                <SelectItem
                                    value={m}
                                    key={m}
                                    className="flex justify-center items-center">
                                    <p className="text-center">{m}</p>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={handleChangeSelectMonthYear}
                    value={filter.filterMonth.year}
                    defaultValue={new Date().getFullYear()}>
                    <SelectTrigger className="w-16">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Year</SelectLabel>
                            {YEARS.map((y) => (
                                <SelectItem
                                    value={y}
                                    key={y}
                                    className="flex justify-center items-center">
                                    <p className="text-center">{y}</p>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-3 items-center">
                <p>Year: </p>
                <Select
                    onValueChange={handleChangeSelectYear}
                    value={filter.filterYear}>
                    <SelectTrigger className="w-16">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Year</SelectLabel>
                            {YEARS.map((y) => (
                                <SelectItem
                                    value={y}
                                    key={y}
                                    className="flex justify-center items-center">
                                    <p className="text-center">{y}</p>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
export default CalendarForm;

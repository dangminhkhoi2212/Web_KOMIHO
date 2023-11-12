'use client';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { getYear, getMonth, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { usePathname, useRouter } from 'next/navigation';
import { route } from 'nextjs-routes';
export const range = (start, end) => {
    return new Array(end - start).fill().map((d, i) => i + start);
};
const PickDay = () => {
    const [startDate, setStartDate] = useState(new Date());
    const pathname = usePathname();
    const router = useRouter();
    const years = range(1990, getYear(new Date()) + 1);
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const handleSelectDate = (date) => {
        const newRoute = route({
            pathname,
            query: { date: format(date, 'yyyy-MM-dd') },
        });
        setStartDate(date);
        router.replace(newRoute);
    };
    return (
        <ReactDatePicker
            className="rounded-lg ring-1 ring-gray-200 border-none !w-28 px-2 py-1"
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div
                    style={{
                        margin: 10,
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}>
                        {'<'}
                    </button>
                    <select
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}>
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }>
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}>
                        {'>'}
                    </button>
                </div>
            )}
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date) => handleSelectDate(date)}
        />
    );
};
export default PickDay;

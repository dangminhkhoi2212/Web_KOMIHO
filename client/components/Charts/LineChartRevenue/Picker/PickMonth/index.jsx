'use client';
import { format, formatISO } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import { route } from 'nextjs-routes';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

const PickMonth = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [month, setMonth] = useState(new Date());
    const handleSelectMonth = (m) => {
        const newRoute = route({
            pathname,
            query: { month: format(m, 'yyyy-MM') },
        });
        router.replace(newRoute);
        setMonth(m);
    };
    return (
        <ReactDatePicker
            className="rounded-lg ring-1 ring-gray-200 border-none !w-24"
            selected={month}
            onChange={handleSelectMonth}
            showMonthYearPicker
            dateFormat="MM/yyyy"
        />
    );
};
export default PickMonth;

'use client';
import { format } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import { route } from 'nextjs-routes';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

const PickYear = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [year, setYear] = useState(new Date());
    const handleSelectYear = (m) => {
        const newRoute = route({
            pathname,
            query: { year: format(m, 'yyyy') },
        });
        router.replace(newRoute);
        setYear(m);
    };
    return (
        <ReactDatePicker
            className="rounded-lg ring-1 ring-gray-200 border-none !w-16  px-2 py-1"
            selected={year}
            showYearPicker
            onChange={handleSelectYear}
            dateFormat="yyyy"
        />
    );
};
export default PickYear;

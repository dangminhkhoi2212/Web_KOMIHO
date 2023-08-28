import { HiCheck, HiX, HiExclamation } from 'react-icons/hi';

export const statusList = [
    {
        status: 'success',
        icon: HiCheck,
        color: ' bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200',
    },
    {
        status: 'failure',
        icon: HiX,
        color: ' bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200',
    },
    {
        status: 'warning',
        icon: HiExclamation,
        color: ' bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200',
    },
];

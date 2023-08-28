'use client';
import { createElement, useEffect, useState } from 'react';
import { Alert } from 'flowbite-react';
import { statusList } from './statusList';
export default function index({ status, message }) {
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const showTime = setTimeout(() => {
            setIsShow(false);
        }, 3000);
        return () => clearTimeout(showTime);
    }, []);
    return (
        <>
            {isShow &&
                statusList.map((s) => {
                    if (s.status === status)
                        return (
                            <Alert
                                key={s.status}
                                color={s.status}
                                onDismiss={() => {
                                    setIsShow(false);
                                }}>
                                <div className="flex items-center justify-around">
                                    {createElement(s.icon, {
                                        className: `text-3xl me-3${s.color}`,
                                    })}
                                    {message}
                                </div>
                            </Alert>
                        );
                })}
        </>
    );
}

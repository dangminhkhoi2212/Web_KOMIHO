'use client';
import { createElement, useEffect, useState } from 'react';
import { Alert } from 'flowbite-react';
import { statusList } from './statusList';
export default function index({ id, status, message }) {
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        setIsShow(true);
        const showTime = setTimeout(() => {
            setIsShow(false);
        }, 3000);
        return () => clearTimeout(showTime);
    }, [id]);
    return (
        <>
            {isShow &&
                statusList.map((s) => {
                    if (s.status === status)
                        return (
                            <Alert
                                key={s.status}
                                color={s.status}
                                icon={s.icon}
                                onDismiss={() => {
                                    setIsShow(false);
                                }}
                                className="fixed inset-x-1/4 z-alert shadow-md ">
                                <span>
                                    <p>{message}</p>
                                </span>
                            </Alert>
                        );
                })}
        </>
    );
}

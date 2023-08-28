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
                                icon={s.icon}
                                onDismiss={() => {
                                    setIsShow(false);
                                }}
                                className="absolute top-2 inset-x-1/4 z-drop-down">
                                <span>
                                    <p>{message}</p>
                                </span>
                            </Alert>
                        );
                })}
        </>
    );
}

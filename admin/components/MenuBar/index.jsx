'use client';

import { cn } from '@/lib/utils';
import { memo, useEffect, useState } from 'react';

const MenuBar = ({ list, handleEvent }) => {
    const [navs, setNavs] = useState(list || []);
    useEffect(() => {
        setNavs(list);
    }, [list]);
    const handleSelectTag = (tab) => {
        const changeNavs = navs.map((nav) => {
            if (nav.tab === tab) return { ...nav, active: true };
            return { ...nav, active: false };
        });
        setNavs(changeNavs);
        if (handleEvent) handleEvent(tab);
    };
    return (
        <div className="flex justify-evenly border-b-[1px]">
            {navs.map((nav) => {
                return (
                    <div
                        role="button"
                        className="relative hover:bg-primary/50 rounded-sm flex-1 text-center py-2 transition-all ease-in-out duration-300 "
                        key={nav.name}
                        onClick={() => handleSelectTag(nav.tab)}>
                        {nav.name}
                        <div
                            className={cn(
                                'absolute bottom-0 left-0 right-0 h-[3px]',
                                { 'bg-accent': nav.active },
                            )}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default memo(MenuBar);

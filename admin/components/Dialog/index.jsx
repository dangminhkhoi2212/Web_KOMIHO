import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Children } from 'react';

const DialogCustom = ({ children, title, handleEvent, description }) => {
    const [open, setOpen] = useState(true);
    const handleOpen = (state) => {
        if (handleEvent) {
            handleEvent();
        }
        setOpen(state);
    };
    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            {/* <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex justify-center items-center">
                    <Pen className="hover:bg-secondary p-2 rounded-lg w-8 h-8" />
                </button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">{children}</div>
                {/* <DialogFooter>
                    {button}
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
};

export default DialogCustom;

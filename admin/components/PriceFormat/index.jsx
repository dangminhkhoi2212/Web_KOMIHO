import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const PriceFormat = ({ price }) => {
    return (
        <div className="flex flex-col gap-1 text-xs">
            <NumericFormat
                value={price?.origin}
                thousandSeparator
                displayType="text"
                suffix={' VND'}
                renderText={(value) => (
                    <span
                        className={cn(
                            price?.percent !== 0
                                ? 'line-through'
                                : 'font-medium',
                        )}>
                        {value}
                    </span>
                )}
            />
            {!!price?.percent && (
                <Badge className={'bg-red-400 w-fit'}>
                    {price?.percent}% OFF
                </Badge>
            )}
            {!!price?.percent && (
                <NumericFormat
                    value={price?.final}
                    thousandSeparator
                    displayType="text"
                    suffix={' VND'}
                    renderText={(value) => (
                        <span className="font-medium">{value}</span>
                    )}
                />
            )}
        </div>
    );
};

export default PriceFormat;

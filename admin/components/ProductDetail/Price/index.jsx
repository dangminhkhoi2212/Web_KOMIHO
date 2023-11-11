'use client';
import clsx from 'clsx';
import { NumericFormat } from 'react-number-format';

const Price = ({ price }) => {
    if (!price) return;
    return (
        <div>
            <div className="flex gap-5 items-center">
                <NumericFormat
                    value={price?.origin}
                    thousandSeparator
                    displayType="text"
                    suffix={' VND'}
                    renderText={(value) => (
                        <span
                            className={clsx(
                                price?.percent !== 0
                                    ? 'line-through text-gray-500'
                                    : 'text-xl font-medium',
                            )}>
                            {value}
                        </span>
                    )}
                />

                {price?.percent !== 0 && (
                    <NumericFormat
                        value={price?.final}
                        thousandSeparator
                        displayType="text"
                        suffix={' VND'}
                        renderText={(value) => (
                            <span className="text-2xl text-red-600 font-medium">
                                {value}
                            </span>
                        )}
                    />
                )}
                {price?.percent !== 0 && (
                    <span className="px-2 py-1 text-white bg-red-500 rounded-md">
                        {price?.percent}% OFF
                    </span>
                )}
            </div>
        </div>
    );
};

export default Price;

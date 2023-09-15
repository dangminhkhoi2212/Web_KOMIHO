import InputCustom from '@/components/InputCustom';
import { useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

import { formatPrice } from '@/utils/format';
const Price = () => {
    const {
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useFormContext();
    const final = useWatch({ control, name: 'price.final' });

    const handleCalculator = () => {
        var price = 0;
        const origin = getValues('price.origin');

        const percent = getValues('price.percent');
        if (origin && origin !== 0) {
            if (percent) {
                price = origin * (1 - percent / 100);
            } else price = origin;
        }
        setValue('price.final', price);
    };
    return (
        <div className="bg-white rounded-xl ">
            <p className=" font-medium">Price</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 content-start px-5">
                <div className="col-span-1">
                    <Controller
                        name={'price.origin'}
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                label="Origin (VND)"
                                id="origin"
                                type="number"
                                min="0"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    handleCalculator();
                                }}
                                value={field.value}
                                helperText={errors.price?.origin?.message}
                                color={
                                    errors.price?.origin?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>
                <div className="col-span-1 w-44">
                    <Controller
                        name={'price.percent'}
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                label="Discount percent (%)"
                                id="percent"
                                type="number"
                                min="0"
                                max="100"
                                onChange={(e) => {
                                    let value = e.target.value;
                                    value = value > 100 ? 100 : value;
                                    field.onChange(value);
                                    handleCalculator();
                                }}
                                value={field.value}
                                helperText={errors.price?.percent?.message}
                                color={
                                    errors.price?.percent?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>
                <div className="flex flex-row gap-3  font-medium">
                    <span> Final price:</span>
                    <span>{formatPrice(final)} VND</span>
                </div>
            </div>
        </div>
    );
};

export default Price;

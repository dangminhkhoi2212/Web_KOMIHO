import InputCustom from '@/components/InputCustom';
import { useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
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
        price = Math.ceil(price);
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
                            <NumericFormat
                                value={field.value}
                                thousandSeparator
                                suffix={' VND'}
                                label="Origin (VND)"
                                id="origin"
                                min="0"
                                onValueChange={({ value }) => {
                                    field.onChange(value);
                                    handleCalculator();
                                }}
                                helperText={errors.price?.origin?.message}
                                color={
                                    errors.price?.origin?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                                customInput={InputCustom}
                            />
                        )}
                    />
                </div>
                <div className="col-span-1 w-44">
                    <Controller
                        name={'price.percent'}
                        control={control}
                        render={({ field }) => (
                            <NumericFormat
                                value={field.value}
                                thousandSeparator
                                suffix={' %'}
                                label="Discount percent (%)"
                                id="origin"
                                isAllowed={({ floatValue }) => {
                                    return (
                                        (0 <= floatValue &&
                                            floatValue <= 100) ||
                                        floatValue === undefined
                                    );
                                }}
                                allowLeadingZeros
                                onValueChange={({ value }) => {
                                    field.onChange(value);
                                    handleCalculator();
                                }}
                                helperText={errors.price?.percent?.message}
                                color={
                                    errors.price?.percent?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                                customInput={InputCustom}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-row gap-3  font-medium">
                    <span> Final price:</span>
                    <NumericFormat
                        value={final}
                        thousandSeparator
                        displayType="text"
                        suffix={' VND'}
                        renderText={(value) => <span>{value}</span>}
                    />
                </div>
            </div>
        </div>
    );
};

export default Price;

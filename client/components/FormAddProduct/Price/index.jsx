import { useEffect, useState } from 'react';
import InputCustom from '@/components/InputCustom';
import { useFormContext, Controller } from 'react-hook-form';

const Price = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();
    const format = (num) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(num);
    };
    const [priceFinal, setPriceFinal] = useState(format(0));
    const [origin, setOrigin] = useState();
    const [percent, setPercent] = useState();
    useEffect(() => {
        const handleCalculator = () => {
            var price = 0;
            if (origin && origin !== 0) {
                if (percent) {
                    price = origin * (1 - percent / 100);
                } else price = origin;
            }
            setPriceFinal(format(price));
        };
        handleCalculator();
    }, [origin, percent]);

    const handleChangeOrigin = (e) => {
        setOrigin(Number(e.target.value));
    };
    const handleChangePercent = (e) => {
        setPercent(Number(e.target.value));
    };
    return (
        <div className="bg-white rounded-xl ">
            <p className="text-lg font-medium">Price</p>
            <div className="grid grid-cols-6 gap-x-5 content-start p-5">
                <div className="col-span-2">
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
                                    handleChangeOrigin(e);
                                    field.onChange(e.target.value);
                                }}
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
                <div className="col-span-2">
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
                                    handleChangePercent(e);
                                    field.onChange(e.target.value);
                                }}
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
                <div className="col-span-2 flex flex-row gap-3 text-lg font-medium">
                    <span>Price final:</span>
                    <span>{priceFinal} VND</span>
                </div>
            </div>
        </div>
    );
};

export default Price;

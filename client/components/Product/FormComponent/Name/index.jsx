import InputCustom from '@/components/InputCustom';
import { useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

const Name = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name="name"
            control={control}
            render={({ field }) => (
                <InputCustom
                    id={'name'}
                    label={'Name '}
                    type={'text'}
                    placeholder={'Product Name '}
                    onChange={(e) => {
                        field.onChange(e.target.value);
                    }}
                    value={field.value}
                    helperText={errors.name?.message}
                    color={errors.name?.message ? 'failure' : 'gray'}
                />
            )}
        />
    );
};

export default Name;

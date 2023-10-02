import InputCustom from '@/components/InputCustom';
import TextareaCustom from '@/components/TextareaCustom';
import { useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

const Name = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const name = useWatch({ control, name: 'name' });
    return (
        <div className="">
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextareaCustom
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
                        rows={4}
                    />
                )}
            />
            <span className="text-gray-400 text-sm">{name?.length}/200</span>
        </div>
    );
};

export default Name;

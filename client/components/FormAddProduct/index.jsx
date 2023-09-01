'use client';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import InputCustom from '@/components/InputCustom';
import Loading from '@/components/Loading';
import { addProductSchema } from '@/utils/validation';
import { useState } from 'react';
import UploadFile from './UploadFile';
import Color from './Color';
import Description from './Description';
import Price from './Price';
const FormAddProduct = () => {
    const methods = useForm({
        resolver: yupResolver(addProductSchema),

        defaultValues: {
            name: '',
            price: {
                origin: '',
                percent: '',
            },
            color: [{ name: '', size: [{ type: '', quantity: '' }] }],
            images: {},
            description: '',
        },
    });
    const {
        register,
        control,

        formState: { errors },
        handleSubmit,
    } = methods;

    const [loading, setLoading] = useState(false);
    const handleAddProduct = (data) => {
        console.log('🚀 ~ file: index.jsx:25 ~ addProduct ~ data:', data);
    };
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddProduct)} className="p-5">
                <div className="flex flex-col gap-3">
                    <UploadFile
                        id={'upload-image'}
                        type={'file'}
                        label="Upload Images"
                    />
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
                                helperText={errors.name?.message}
                                color={
                                    errors.name?.message ? 'failure' : 'gray'
                                }
                            />
                        )}
                    />
                    <Price />
                    <Color />

                    <Description />
                </div>
                <button
                    type="submit"
                    className="h-12 w-16 mt-3 transition ease-in-out   hover:bg-secondary duration-500  cursor-pointer p-3 rounded-xl bg-accent shadow-sm shadow-accent font-bold text-white relative align-bottom float-right">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Add'
                    )}
                </button>
            </form>
        </FormProvider>
    );
};

export default FormAddProduct;

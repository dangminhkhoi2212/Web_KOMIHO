'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import EnterEmailImg from '@/public/images/enter_email.svg';
import { sendOtp } from '@/services/password/otp.service';
import Loading from '@/components/Loading';
import InputCustom from '@/components/InputCustom';
import { emailSchema } from '@/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const EnterEmail = ({ handleNext, email, setEmail }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(emailSchema),
    });

    const submitEmail = useMutation({
        mutationFn: async (data) => {
            await sendOtp(data.email);
            return data;
        },
        onSuccess(data) {
            setEmail(data.email);
            handleNext();
            toast.success('Send OTP successfully. Please check your email');
        },
        onError(error) {
            toast.error('Sent OTP failed. Please reload page and try again');
        },
    });
    // const submitEmail = async (data) => {
    //     console.log('🚀 ~ file: EnterEmail.jsx:19 ~ submitEmail ~ data:', data);
    //     try {
    //         setLoading(true);
    //         await sendOtp(data.email);
    //         setLoading(false);
    //         setEmail(data.email);
    //         handleNext();
    //     } catch (error) {
    //         setLoading(false);

    //         setMessage(error.response.data.message || error.message);
    //     }
    // };
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <Image
                src={EnterEmailImg}
                width={0}
                height={0}
                priority
                className="w-32 h-32 rounded-r-full object-cover "
                alt="email"
            />
            <form
                className="  flex flex-col gap-3 "
                onSubmit={handleSubmit(submitEmail.mutate)}>
                <p>A code will be sent in email</p>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id={'email'}
                            label={'Enter Email'}
                            type={'email'}
                            placeholder="Email"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                            helperText={errors.email?.message}
                            color={errors.email?.message ? 'failure' : 'gray'}
                        />
                    )}
                />
                <button
                    type="submit"
                    className="h-12 rounded-full text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative overflow-hidden mb-2">
                    {submitEmail.isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Next'
                    )}
                </button>
            </form>
        </div>
    );
};

export default EnterEmail;

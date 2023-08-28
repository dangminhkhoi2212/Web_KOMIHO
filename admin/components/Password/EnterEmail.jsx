'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import EnterEmailImg from '@/public/images/enter_email.svg';
import { sendOtp } from '@/services/password/otp.service';
import Loading from '@/components/Loading';
import InputCostum from '@/components/InputCostum';
import { schemaEmail } from './schema';
const EnterEmail = ({ handleNext, email, setEmail }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schemaEmail),
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const submitEmail = async (data) => {
        console.log('🚀 ~ file: EnterEmail.jsx:19 ~ submitEmail ~ data:', data);
        try {
            setLoading(true);
            await sendOtp(data.email);
            setLoading(false);
            setEmail(data.email);
            handleNext();
        } catch (error) {
            setLoading(false);

            setMessage(error.response.data.message || error.message);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center">
            <Image
                src={EnterEmailImg}
                width={0}
                height={0}
                priority
                className="w-52 h-52 rounded-r-full object-cover "
                alt="email"
            />
            <form
                className="  flex flex-col gap-2 flex-shrink"
                onSubmit={handleSubmit(submitEmail)}>
                <p>A code will be sent in email</p>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <InputCostum
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
                <span className="text-red-400">{message}</span>
                <button
                    type="submit"
                    className="h-12 rounded-xl text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Next'
                    )}
                </button>
            </form>
        </div>
    );
};

export default EnterEmail;

'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Image from 'next/image';

import VerifyCodeImg from '@/public/images/verify_code.svg';
import { verifyOtp } from '@/services/password/otp.service';
import Loading from '@/components/Loading';
import TimeCountDown from './TimeCountDown';
import { sendOtp } from '@/services/password/otp.service';
import { VscSend } from 'react-icons/vsc';
import InputCustom from '@/components/InputCustom';
import { otpSchema } from '@/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const VerifyCode = ({ handleEvent, email, setOtp }) => {
    const [updateCountDown, setUpdateCountDown] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(otpSchema),
    });

    const resendOtp = useMutation({
        mutationFn: async () => {
            await sendOtp(email);
        },
        onSuccess() {
            toast.success('Sent OTP');
            setUpdateCountDown((pre) => !pre);
        },
        onError() {
            toast.error('Can not send OTP');
        },
    });

    const submitCode = useMutation({
        mutationFn: async (data) => {
            if (setOtp) setOtp(data.otp);
            return await verifyOtp(email, data.otp);
        },
        onSuccess(data) {
            if (data.otp) {
                if (handleEvent) handleEvent();
            }
        },
        onError(error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Can't check OTP. Please try again later.",
            );
        },
    });

    return (
        <div className="flex flex-col justify-center items-center ">
            <Image
                src={VerifyCodeImg}
                width={0}
                height={0}
                priority
                alt="verify code"
                className="w-32 h-32 rounded-r-full object-cover "
            />
            <form
                className="  flex flex-col  gap-3 "
                onSubmit={handleSubmit(submitCode.mutate)}>
                <p className="">
                    Check the 5-digit <span className="font-bold">OTP</span> in
                    your email
                </p>

                <TimeCountDown
                    timeCount={5 * 60 * 1000}
                    key={updateCountDown}
                />
                <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id="otp"
                            type={'text'}
                            label="Enter OTP"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                            helperText={errors.otp?.message}
                            color={errors.otp?.message ? 'failure' : 'gray'}
                        />
                    )}
                />
                <div className="w-md text-center">
                    Resend OTP
                    <button
                        type="button"
                        className="p-3 rounded-xl  mx-4 text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent"
                        onClick={resendOtp.mutate}>
                        {resendOtp.isLoading ? (
                            <Loading colorProp={'#ffffff'} sizeProp={20} />
                        ) : (
                            <VscSend />
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    className="h-12 rounded-full text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative overflow-hidden">
                    {submitCode.isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Next'
                    )}
                </button>
            </form>
        </div>
    );
};

export default VerifyCode;

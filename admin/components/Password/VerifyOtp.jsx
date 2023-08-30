'use client';
import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Image from 'next/image';

import VerifyCodeImg from '@/public/images/verify_code.svg';
import { verifyOtp } from '@/services/password/otp.service';
import Loading from '@/components/Loading';
import TimeCountDown from './TimeCountDown';
import { sendOtp } from '@/services/password/otp.service';
import { VscSend } from 'react-icons/vsc';
import Alert from '@/components/Alert';
import InputCostum from '@/components/InputCostum';
import { schemaOtp } from './schema';
const VerifyCode = ({ handleNext, email, otp, setOtp }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [stateAlert, setStateAlert] = useState('');

    const [updateCountDown, setUpdateCountDown] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schemaOtp),
    });

    const resendOTP = async () => {
        try {
            setLoading(true);
            setMessageAlert('');
            await sendOtp(email);
            setStateAlert('success');
            setMessageAlert('Sent OTP.');
            setUpdateCountDown((pre) => !pre);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setStateAlert('error');
            setMessageAlert('Can not send OTP');
        }
    };
    const submitCode = async (data) => {
        try {
            setLoading(true);

            const result = await verifyOtp(email, data.otp);
            setLoading(false);
            if (result.otp) {
                setOtp(data.otp);
                handleNext();
            }
        } catch (error) {
            setLoading(false);
            setMessage(error.response.data.message || error.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center relative w-full">
            {messageAlert && (
                <div className="absolute top-0 w-full">
                    <Alert status={stateAlert} message={messageAlert} />
                </div>
            )}
            <Image
                src={VerifyCodeImg}
                width={0}
                height={0}
                priority
                alt="verify code"
                className="w-52 h-52 rounded-r-full object-cover "
            />
            <form
                className="  flex flex-col  gap-2 "
                onSubmit={handleSubmit(submitCode)}>
                <p className="text-lg">
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
                        <InputCostum
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
                <span className="text-red-400">{message}</span>
                <div className="w-full text-center">
                    Resend OTP
                    <button
                        type="button"
                        className="p-3 rounded-xl  mx-4 text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent"
                        onClick={resendOTP}>
                        <VscSend />
                    </button>
                </div>

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

export default VerifyCode;
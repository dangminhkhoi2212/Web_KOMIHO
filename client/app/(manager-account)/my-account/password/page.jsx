'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import EmailImage from '@/public/images/enter_email.svg';
import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import { sendOtp } from '@/services/otp.service';
import { getEmail } from '@/redux/selector';
import VerifyOtp from '@/components/Password/VerifyOtp';
import UpdatePassword from '@/components/Password/UpdatePassword';
import routes from '@/routes';
import Modal from '@/components/Modal';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const STEP_INITIAL = 1;
const STEP_VERIFY_OTP = 2;
const STEP_UPDATE_PASSWORD = 3;

const Password = () => {
    const [step, setStep] = useState(STEP_INITIAL);

    const [otp, setOtp] = useState();
    const email = useSelector(getEmail);

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            await sendOtp(email);
        },
        onSuccess() {
            handleNext();
            toast.success('Send OTP successfully. Please check your email');
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Send OTP failure. Please try again.',
            );
        },
    });
    // const startUpdatePassword = async () => {
    //     try {
    //         setLoading(true);
    //         await sendOtp(email);
    //         handleNext();
    //         dispatch(
    //             setAlert({
    //                 status: 'success',
    //                 message: 'Send OTP successfully. Please check your email.',
    //             }),
    //         );
    //         setLoading(false);
    //     } catch (error) {
    //         dispatch(
    //             setAlert({
    //                 status: 'failure',
    //                 message:
    //                     error?.response?.data?.message ||
    //                     'Send OTP failure. Please try again.',
    //             }),
    //         );
    //     }
    // };

    const handleNext = () => {
        setStep((pre) => Math.min(pre + 1, 3));
    };
    const handleBack = () => {
        setStep((pre) => Math.max(pre - 1, 1));
    };

    return (
        <AccountTemplate title={'PASSWORD'}>
            <div className="flex flex-col justify-center items-center">
                <Image
                    src={EmailImage}
                    width={0}
                    height={0}
                    className="w-32 h-32 rounded-r-full object-cover "
                    alt="email"
                    priority
                />
                <button
                    onClick={mutate}
                    className="px-4 h-12 min-w-[80px] rounded-full text-sm text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative overflow-hidden mb-2">
                    {isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Start update password'
                    )}
                </button>
            </div>

            {step === STEP_VERIFY_OTP && (
                <Modal
                    label={'Verify Otp'}
                    showModel={step == 2}
                    handleEvent={() => setStep(1)}>
                    <VerifyOtp
                        email={email}
                        handleEvent={handleNext}
                        setOtp={setOtp}
                    />
                </Modal>
            )}
            {step === STEP_UPDATE_PASSWORD && (
                <Modal label={'Update Password'} showModel={step == 3}>
                    <UpdatePassword
                        handleEvent={() => {
                            setStep(1);
                        }}
                        email={email}
                        otp={otp}
                        linkRedirect={`${routes.password}?updatePassword=true`}
                    />
                </Modal>
            )}
        </AccountTemplate>
    );
};

export default Password;

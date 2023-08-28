'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import EmailImage from '@/public/images/enter_email.svg';
import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import { sendOtp } from '@/services/password/otp.service';
import { getUser } from '@/redux/selector';
import VerifyOtp from '@/components/Password/VerifyOtp';
import UpdatePassword from '@/components/Password/UpdatePassword';
import routes from '@/routes';
import Model from '@/components/Model';
import Alert from '@/components/Alert';

const STEP_INITIAL = 1;
const STEP_VERIFY_OTP = 2;
const STEP_UPDATE_PASSWORD = 3;

const Password = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [otp, setOtp] = useState();
    const user = useSelector(getUser);
    const [updatePassword, setUpdatePassword] = useState(false);

    const startUpdatePassword = async () => {
        try {
            setLoading(true);
            await sendOtp(user?.email);
            handleNext();
            setLoading(false);
        } catch (error) {}
    };

    const handleNext = () => {
        setStep((pre) => Math.min(pre + 1, 3));
    };
    const handleBack = () => {
        setStep((pre) => Math.max(pre - 1, 1));
    };

    useEffect(() => {
        setUpdatePassword(false);
        const updatePasswordQuery = searchParams.get('updatePassword');
        setUpdatePassword(updatePasswordQuery || false);
        const setTime = setTimeout(() => {
            router.replace(routes.password);
        }, 3000);
        return () => {
            clearTimeout(setTime);
        };
    }, [searchParams, router]);

    return (
        <AccountTemplate title={'Password'}>
            {updatePassword && (
                <Alert
                    message={'Update password successfully.'}
                    status={'success'}
                />
            )}
            <div className="flex flex-col justify-center items-center">
                <Image
                    src={EmailImage}
                    width={0}
                    height={0}
                    className="w-52 h-52 rounded-r-full object-cover "
                    alt="email"
                    priority
                />
                <button
                    onClick={startUpdatePassword}
                    className="px-3 py-2 h-12 min-w-[80px] rounded-xl text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Start update password'
                    )}
                </button>
            </div>

            {step === STEP_VERIFY_OTP && (
                <Model
                    label={'Verify Otp'}
                    showModel={step == 2}
                    handleEvent={() => setStep(1)}>
                    <VerifyOtp
                        email={user?.email}
                        handleNext={handleNext}
                        setOtp={setOtp}
                    />
                </Model>
            )}
            {step === STEP_UPDATE_PASSWORD && (
                <Model label={'Update Password'} showModel={step == 3}>
                    <UpdatePassword
                        handleEvent={() => {
                            setStep(1);
                        }}
                        email={user?.email}
                        otp={otp}
                        linkRedirect={`${routes.password}?updatePassword=true`}
                    />
                </Model>
            )}
        </AccountTemplate>
    );
};

export default Password;

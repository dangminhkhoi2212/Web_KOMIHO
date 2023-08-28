'use client';
import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnterEmail from './EnterEmail';
import VerifyOtp from './VerifyOtp';
import UpdatePassword from './UpdatePassword';
import { MdOutlineArrowBack } from 'react-icons/md';
import routes from '@/routes';
const index = () => {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const handleNext = () => {
        setStep((pre) => Math.min(pre + 1, 3));
    };
    const handleBack = () => {
        setStep((pre) => Math.max(pre - 1, 0));
    };

    useEffect(() => {
        if (step === 0) {
            return router.push(routes.home);
        }
    }, [step]);
    return (
        <>
            {step !== 0 && (
                <div className=" w-80 shadow-md p-5 rounded-md bg-white">
                    <MdOutlineArrowBack
                        className="text-4xl  bg-accent rounded-md text-white cursor-pointer"
                        onClick={handleBack}
                    />
                    <p className="text-center text-xl font-semibold mt-3">
                        Update password
                    </p>
                    <div className="flex flex-col justify-center items-center">
                        {step === 1 && (
                            <EnterEmail
                                handleNext={handleNext}
                                email={email}
                                setEmail={setEmail}
                            />
                        )}
                        {step === 2 && (
                            <VerifyOtp
                                handleNext={handleNext}
                                email={email}
                                otp={otp}
                                setOtp={setOtp}
                            />
                        )}
                        {step === 3 && (
                            <UpdatePassword
                                handleNext={handleNext}
                                email={email}
                                otp={otp}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default index;

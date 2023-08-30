'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import EmailImage from '@/public/images/enter_email.svg';
import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import { sendOtp } from '@/services/password/otp.service';
import { getUser } from '@/redux/selector';
import VerifyOtp from '@/components/Password/VerifyOtp';
import routes from '@/routes';
import Modal from '@/components/Modal';
import InputCustom from '@/components/InputCustom';
import { deleteUser } from '@/services/user.service';
import { deleteAccountSchema } from '@/utils/validation';
import { setUser } from '@/components/Auth/authSlice';

const STEP_INITIAL = 1;
const STEP_VERIFY_OTP = 2;
const STEP_DELETE_ACCOUNT = 3;

const Password = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [otp, setOtp] = useState();
    const user = useSelector(getUser);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(deleteAccountSchema),
    });

    const startDeleteAccount = async () => {
        try {
            setLoading(true);
            await sendOtp(user?.email);
            handleNext();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(
                setAlert({
                    status: 'failure',
                    message:
                        error?.response?.data?.message ||
                        'Send OTP failure. Please try again.',
                }),
            );
        }
    };

    const handleNext = () => {
        setStep((pre) => Math.min(pre + 1, 3));
    };
    const handleBack = () => {
        setStep((pre) => Math.max(pre - 1, 1));
    };

    const handleDeleteAccount = async (data) => {
        try {
            setMessage('');
            setLoading(true);

            const result = await deleteUser(user?._id, data.password);
            if (result.status === 'success') {
                localStorage.clear();
                dispatch(setUser(null));
                router.push(routes.home);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            dispatch(
                setAlert({
                    status: 'failure',
                    message:
                        error?.response?.data?.message ||
                        'Occurred error. Please try again.',
                }),
            );
        }
    };

    return (
        <AccountTemplate
            title={'Delete Account'}
            note={'All data will be deleted.'}>
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
                    onClick={startDeleteAccount}
                    className="px-4 h-12 min-w-[80px] rounded-full text-sm text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Start delete account'
                    )}
                </button>
            </div>

            {step === STEP_VERIFY_OTP && (
                <Modal
                    label={'Verify Otp'}
                    showModel={step === STEP_VERIFY_OTP}
                    handleEvent={() => setStep(1)}>
                    <VerifyOtp
                        email={user?.email}
                        handleEvent={() => handleNext()}
                        setOtp={setOtp}
                    />
                </Modal>
            )}
            {step === STEP_DELETE_ACCOUNT && (
                <Modal
                    label={'Enter Password'}
                    showModel={step === STEP_DELETE_ACCOUNT}
                    handleEvent={() => setStep(1)}>
                    <form
                        onSubmit={handleSubmit(handleDeleteAccount)}
                        className="flex flex-col items-center gap-3">
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <InputCustom
                                    id="password"
                                    type={'password'}
                                    label="Enter your password"
                                    placeholder="Your password"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    helperText={errors?.password?.message}
                                    color={
                                        errors?.password?.message
                                            ? 'failure'
                                            : 'gray'
                                    }
                                />
                            )}
                        />
                        <button
                            type="submit"
                            className="h-8 px-3 min-w-[60px] rounded-full text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative ">
                            {loading ? (
                                <Loading
                                    loadingStatus={loading}
                                    colorProp={'#ffffff'}
                                    sizeProp={20}
                                />
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </form>
                </Modal>
            )}
        </AccountTemplate>
    );
};

export default Password;

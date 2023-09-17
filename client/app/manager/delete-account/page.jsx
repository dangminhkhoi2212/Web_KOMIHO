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
import { getEmail, getUser, getUserId } from '@/redux/selector';
import VerifyOtp from '@/components/Password/VerifyOtp';
import routes from '@/routes';
import Modal from '@/components/Modal';
import InputCustom from '@/components/InputCustom';
import { deleteUser } from '@/services/user.service';
import { deleteAccountSchema } from '@/utils/validation';
import { resetUser, setUser } from '@/components/Auth/authSlice';
import { setAlert } from '@/components/Alert/alertSlice';
import { signOut } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const STEP_INITIAL = 1;
const STEP_VERIFY_OTP = 2;
const STEP_DELETE_ACCOUNT = 3;

const Password = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const userId = useSelector(getUserId);
    const email = useSelector(getEmail);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(deleteAccountSchema),
    });

    const startDeleteAccount = useMutation({
        mutationFn: () => {
            sendOtp(email);
        },
        onSuccess() {
            toast.success('Please check your email');
            handleNext();
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Send OTP failure. Please try again.',
            );
        },
    });
    // const startDeleteAccount = async () => {
    //     try {
    //         setLoading(true);
    //         await sendOtp(email);
    //         handleNext();
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
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
        setStep((pre) => Math.min(pre + 1, STEP_VERIFY_OTP));
    };
    const handleBack = () => {
        setStep((pre) => Math.max(pre - 1, 1));
    };
    const handleDeleteAccount = useMutation({
        mutationFn: () => {
            return deleteUser(userId);
        },
        onSuccess() {
            toast.success('Your account is deleted successfully');
            localStorage.clear();
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            dispatch(resetUser());
            signOut({ callbackUrl: routes.home });
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Occurred error. Please try again.',
            );
        },
    });

    return (
        <AccountTemplate
            title={'DELETE ACCOUNT'}
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
                    onClick={startDeleteAccount.mutate}
                    className="px-4 h-12 min-w-[80px] rounded-full text-sm text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative">
                    {startDeleteAccount.isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Start delete account'
                    )}
                </button>
            </div>

            {step === STEP_VERIFY_OTP &&
                startDeleteAccount.isLoading === false && (
                    <Modal
                        label={'Verify Otp'}
                        showModel={step === STEP_VERIFY_OTP}
                        handleEvent={() => setStep(STEP_INITIAL)}>
                        <VerifyOtp
                            email={email}
                            handleEvent={() => handleDeleteAccount.mutate()}
                        />
                    </Modal>
                )}
            {/* {step === STEP_DELETE_ACCOUNT && (
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
            )} */}
        </AccountTemplate>
    );
};

export default Password;

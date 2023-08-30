'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from 'next-auth/react';

import { loginSchema } from '@/utils/validation';
import { login } from '@/services/auth.service';
import { setUser } from '@/components/Auth/authSlice';
import Loading from '@/components/Loading';
import InputCustom from '@/components/InputCustom';
import Logo from '../Logo';
import routes from '@/routes';
import Alert from '@/components/Alert';
import { setAlert } from '../Alert/alertSlice';
const LoginForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const handleLogin = async ({ username, password }) => {
        try {
            setLoading(true);
            const result = await login(username, password);

            if (result) {
                dispatch(setUser(result));
                dispatch(
                    setAlert({ status: 'success', message: 'Login Success.' }),
                );
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);
                router.push(routes.home);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);

            dispatch(
                setAlert({
                    status: 'failure',
                    message: error?.response?.data?.message || error?.message,
                }),
            );
        }
    };
    return (
        <div className="flex flex-col justify-center gap-3 bg-white rounded-xl p-5 w-80 shadow-md ">
            <div className="  text-center">
                <p className="text-2xl font-bold ">Welcome</p>
                <Logo />
                <p className="italic ">Login to continue.</p>
            </div>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col gap-3">
                <div className="  flex flex-col gap-2">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id={'username'}
                                label={'Username'}
                                type={'text'}
                                placeholder={'Email or phone'}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                helperText={errors.username?.message}
                                color={
                                    errors.username?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>
                <div className="  flex flex-col gap-2">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id={'password'}
                                label={'Password'}
                                type={'password'}
                                placeholder={'Password'}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                helperText={errors.password?.message}
                                color={
                                    errors.password?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>
                <p
                    className="text-center cursor-pointer text-accent"
                    onClick={() => {
                        router.push(routes.forgetPassword);
                    }}>
                    Forget Password
                </p>

                <button
                    type="submit"
                    className="h-12 hover:bg-accent transition ease-in-out duration-500  cursor-pointer p-3 rounded-xl bg-primary shadow-sm shadow-accent font-bold text-white relative">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
            <hr />

            <button
                type="submit"
                className="h-12 hover:bg-accent hover:text-white transition ease-in-out duration-300  cursor-pointer p-3 rounded-xl bg-white font-bold text-black relative ring-1 ring-accent"
                onClick={() => signIn('google', { callbackUrl: routes.home })}>
                <FcGoogle className="inline-block me-3 text-xl" />
                Login with Google
            </button>
            <p>
                Don't have an account?{' '}
                <Link href={routes.register} className="text-accent">
                    Register now
                </Link>{' '}
            </p>
        </div>
    );
};

export default LoginForm;

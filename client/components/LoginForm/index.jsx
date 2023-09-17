'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
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
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { setEmailRecover } from '../RecoverAccount/recoverAccountSlice';
const LoginForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ username, password }) => {
            const result = await login(username, password);
            return result;
        },
        onSuccess(data) {
            if (!data.public) {
                dispatch(setEmailRecover(data.email));
                return;
            }
            dispatch(setUser(data));
            Cookies.set('accessToken', data.accessToken);
            Cookies.set('refreshToken', data.refreshToken);
            router.push(routes.home);
            toast.success('Login Success.');
        },
        onError(err) {
            toast.error(err?.response?.data?.message || 'Login Error');
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    return (
        <div className="flex flex-col justify-center gap-3 bg-white rounded-xl p-5 w-80 shadow-md ">
            <div className="  text-center">
                <p className="text-2xl font-bold ">Welcome</p>
                <Logo />
                <p className="italic ">Login to continue.</p>
            </div>
            <form
                onSubmit={handleSubmit((data) => mutate(data))}
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
                    {isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
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

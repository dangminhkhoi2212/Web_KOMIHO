'use client';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import InputCustom from '../InputCustom';
import { registerSchema } from '@/utils/validation';
import Loading from '../Loading';
import Link from 'next/link';
import routes from '@/routes';
import { register } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const RegisterForm = () => {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return await register(
                data?.name,
                data?.email,
                data?.phone,
                data?.password,
            );
        },
        onSuccess(data) {
            toast.warning('Please check your email to verify your account.');
            router.push(routes.login);
        },
        onError(err) {
            toast.error(
                err?.response?.data?.message ||
                    'Occurred error! Please try again. ',
            );
        },
    });

    return (
        <div className="flex flex-col justify-center items-center gap-3 bg-white rounded-xl p-5 shadow-md relative">
            <div className=" text-center">
                <p className="text-2xl font-bold ">Register </p>
            </div>
            <form
                onSubmit={handleSubmit((data) => mutate(data))}
                className=" flex flex-col gap-3">
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id="name"
                            label="Full name"
                            placeholder="Your full name"
                            type="text"
                            onChange={(e) => field.onChange(e.target.value)}
                            helperText={errors?.name?.message}
                            color={errors?.name?.message ? 'failure' : 'gray'}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id="email_register"
                            label="Email"
                            type="text"
                            placeholder="Your email address"
                            onChange={(e) => field.onChange(e.target.value)}
                            helperText={errors?.email?.message}
                            color={errors?.email?.message ? 'failure' : 'gray'}
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id="phone_register"
                            label="Phone"
                            type="text"
                            placeholder="Your phone number"
                            onChange={(e) => field.onChange(e.target.value)}
                            helperText={errors?.phone?.message}
                            color={errors?.phone?.message ? 'failure' : 'gray'}
                        />
                    )}
                />
                <div className="  flex gap-2">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Your password"
                                onChange={(e) => field.onChange(e.target.value)}
                                helperText={errors?.password?.message}
                                color={
                                    errors?.password?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                    <Controller
                        name="passwordConfirmation"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id="passwordConfirmation"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm password"
                                onChange={(e) => field.onChange(e.target.value)}
                                helperText={
                                    errors?.passwordConfirmation?.message
                                }
                                color={
                                    errors?.passwordConfirmation?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className="h-12 hover:bg-accent transition ease-in-out duration-500  cursor-pointer p-3 rounded-xl bg-primary shadow-sm shadow-accent font-bold text-white relative overflow-hidden">
                    {isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Register'
                    )}
                </button>
                <hr className="" />

                <button
                    type="submit"
                    className="h-12 hover:bg-accent hover:text-white transition ease-in-out duration-300  cursor-pointer p-3 rounded-xl bg-white font-bold text-black relative ring-1 ring-accent"
                    onClick={() =>
                        signIn('google', { callbackUrl: routes.home })
                    }>
                    <FcGoogle className="inline-block me-3 text-xl" />
                    Register with Google
                </button>
            </form>
            <p>
                Have an account?{' '}
                <Link href={routes.login} className="text-accent">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default RegisterForm;

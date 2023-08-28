'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema';
import { login } from '@/services/auth.service';
import { setAdmin } from '@/redux/adminSlice';
import Loading from '@/components/Loading';
import InputCostum from '@/components/InputCostum';
const LoginForm = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const updatePassword = searchParams.get('updatePassword');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleLogin = async ({ username, password }) => {
        try {
            setLoading(true);
            const result = await login(username, password);

            if (result) {
                dispatch(setAdmin(result));
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('adminId', result._id);
                router.push('/');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);

            setMessage(error.response.data.message || error.message);
        }
    };
    return (
        <div className="flex flex-col  ">
            <div className=" mb-14 text-center">
                <p className="text-2xl font-bold ">
                    Welcome to admin of{' '}
                    <span className="italic bg-primary text-white px-2 py-1 rounded-md">
                        KOMIHO
                    </span>
                </p>
                <p className="italic ">Login to continue.</p>
            </div>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className=" h-3/4 flex flex-col gap-3">
                <div className="  flex flex-col gap-2">
                    <InputCostum
                        id={'username'}
                        label={'Username'}
                        type={'text'}
                        placeholder={'Email or phone'}
                        register={register('username')}
                    />
                    <span className="text-red-500">
                        {errors.username?.message}
                    </span>
                </div>
                <div className="  flex flex-col gap-2">
                    <InputCostum
                        id={'password'}
                        label={'Password'}
                        type={'password'}
                        placeholder={'Password'}
                        register={register('password')}
                    />

                    <span className="text-red-500">
                        {errors.password?.message}
                    </span>
                </div>
                <span className="text-red-500">{message}</span>
                <p
                    className="text-center cursor-pointer text-accent"
                    onClick={() => {
                        router.push('/login/forgetPassword');
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
        </div>
    );
};

export default LoginForm;

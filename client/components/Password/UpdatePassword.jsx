import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import UpdatePasswordImg from '@/public/images/update_password.svg';
import { passwordSchema } from '@/utils/validation';
import Loading from '@/components/Loading';
import { updatePassword } from '@/services/password/password.service';
import Alert from '@/components/Alert';
import InputCustom from '../InputCustom';
const UpdatePassword = ({ email, otp, linkRedirect, handleEvent }) => {
    const router = useRouter();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');

    const submitPassword = async (data) => {
        try {
            setMessage('');
            setLoading(true);
            await updatePassword(email, otp, data.password);
            setLoading(false);
            if (handleEvent) handleEvent();
            router.push(linkRedirect);
        } catch (error) {
            console.log(
                '🚀 ~ file: UpdatePassword.jsx:38 ~ submitPassword ~ error:',
                error,
            );
            setLoading(false);
            setMessage(error?.response?.data?.message || error?.message);
        }
    };

    return (
        <div className="flex flex-col justify-center gap-3 items-center relative">
            {message && <Alert status={'failure'} message={message} />}

            <Image
                src={UpdatePasswordImg}
                width={0}
                height={0}
                priority
                alt="update password"
                className="w-32 h-32 rounded-r-full object-cover "
            />
            <form
                className="  flex flex-col  gap-3 "
                onSubmit={handleSubmit(submitPassword)}>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <InputCustom
                            id="password"
                            type={'password'}
                            label="Enter new password"
                            placeholder="New password"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                            helperText={errors.password?.message}
                            color={
                                errors.password?.message ? 'failure' : 'gray'
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
                            type={'password'}
                            label="Confirm password"
                            placeholder="Confirm password"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                            helperText={errors.passwordConfirmation?.message}
                            color={
                                errors.passwordConfirmation?.message
                                    ? 'failure'
                                    : 'gray'
                            }
                        />
                    )}
                />

                <button
                    type="submit"
                    className="h-12 rounded-full text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative ">
                    {loading ? (
                        <Loading
                            loadingStatus={loading}
                            colorProp={'#ffffff'}
                            sizeProp={20}
                        />
                    ) : (
                        'Update'
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;

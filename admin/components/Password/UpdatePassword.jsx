import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import UpdatePasswordImg from '@/public/images/update_password.svg';
import { schemaPassword } from './schema';
import Loading from '@/components/Loading';
import { updatePassword } from '@/services/password/password.service';
import Alert from '@/components/Alert';
import InputCostum from '../InputCostum';
const UpdatePassword = ({ email, otp }) => {
    const router = useRouter();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schemaPassword),
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const submitPassword = async (data) => {
        try {
            setAlert(false);
            setLoading(true);
            await updatePassword(email, otp, data.password);
            setLoading(false);
            router.push('/login?updatePassword=true');
        } catch (error) {
            setLoading(false);
            setAlert(true);
        }
    };

    return (
        <div className="flex flex-col justify-center  items-center">
            {alert && (
                <Alert
                    status={'error'}
                    message={'Have error while update.Plaese retry!'}></Alert>
            )}

            <Image
                src={UpdatePasswordImg}
                width={0}
                height={0}
                priority
                alt="update password"
                className="w-52 h-52 rounded-r-full object-cover "
            />
            <form
                className="  flex flex-col  gap-2 flex-shrink"
                onSubmit={handleSubmit(submitPassword)}>
                <div className="flex flex-col items-start">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <InputCostum
                                id="password"
                                type={'password'}
                                label="Enter new password"
                                placeholder="New password"
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
                <div className="flex flex-col justify-center items-start">
                    <Controller
                        name="passwordConfirmation"
                        control={control}
                        render={({ field }) => (
                            <InputCostum
                                id="passwordConfirmation"
                                type={'password'}
                                label="Confirm password"
                                placeholder="Confirm password"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                helperText={
                                    errors.passwordConfirmation?.message
                                }
                                color={
                                    errors.passwordConfirmation?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                            />
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className="h-12 rounded-xl text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative ">
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

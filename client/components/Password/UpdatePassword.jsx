import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import UpdatePasswordImg from '@/public/images/update_password.svg';
import { passwordSchema } from '@/utils/validation';
import Loading from '@/components/Loading';
import { updatePassword } from '@/services/password/password.service';
import InputCustom from '../InputCustom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const UpdatePassword = ({ email, otp, linkRedirect, handleEvent }) => {
    const router = useRouter();
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const submitPassword = useMutation({
        mutationFn: async (data) => {
            await updatePassword(email, otp, data.password);
        },
        onSuccess() {
            if (handleEvent) handleEvent();
            toast.success('Update password successfully.');
            router.push(linkRedirect);
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    'Update password failure.',
            );
        },
    });

    return (
        <div className="flex flex-col justify-center gap-3 items-center relative">
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
                onSubmit={handleSubmit(submitPassword.mutate)}>
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
                    className="h-12 rounded-full text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative overflow-hidden ">
                    {submitPassword.isLoading ? (
                        <Loading colorProp={'#ffffff'} sizeProp={20} />
                    ) : (
                        'Update'
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;

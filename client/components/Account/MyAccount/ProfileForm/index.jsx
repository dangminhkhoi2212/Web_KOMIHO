'use client';
import { useState, useRef } from 'react';
import InputCustom from '@/components/InputCustom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';

import { profileSchema } from '@/utils/validation';
import { getUser } from '@/redux/selector';
import AvatarText from '@/components/Avatar';
import { updateProfile } from '@/services/user.service';
import { useDispatch } from 'react-redux';
import { setUser } from '@/components/Auth/authSlice';
import Loading from '@/components/Loading';
import clsx from 'clsx';
import { setAlert } from '@/components/Alert/alertSlice';

const ProfileForm = () => {
    const user = useSelector(getUser);
    console.log('🚀 ~ file: index.jsx:20 ~ ProfileForm ~ user:', user);
    const dispatch = useDispatch();
    const [isPhone, setIsPhone] = useState(user?.phone ? true : false);
    const [avtUrl, setAvtUrl] = useState(
        user && user.avatar && user.avatar.url,
    );
    const inputFile = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fileSize, setFileSize] = useState(null);
    const {
        control,
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: user?.name,
            email: user?.email,
            phone: user?.phone || '',
            avatar: {},
        },
    });

    const { ref } = register('avatar');

    const handleUpdate = async (data) => {
        try {
            setLoading(true);
            data.isUpdateAvatar = false;

            const form = new FormData();
            form.append('name', data.name);
            form.append('email', data.email);
            form.append('phone', data.phone);
            if (data.avatar.length > 0 && data.avatar[0]) {
                data.avatar = data.avatar[0];
                form.append('avatar', data.avatar);
                data.isUpdateAvatar = true;
            }
            form.append('isUpdateAvatar', data.isUpdateAvatar);

            const result = await updateProfile(user._id, form);

            if (result) {
                //delete form after update
                if (data.avatar) if (avtUrl) URL.revokeObjectURL(avtUrl);
                reset({
                    name: form.get('name'),
                    email: form.get('email'),
                    phone: form.get('phone'),
                    avatar: {},
                });
                for (var pair of form) {
                    form.delete(pair[0]);
                }

                dispatch(setUser(result));
                dispatch(
                    setAlert({
                        status: 'success',
                        message: 'Your profile updated successfully.',
                    }),
                );

                setFileSize('');
            }
            setLoading(false);
        } catch (error) {
            dispatch(
                setAlert({
                    status: 'failure',
                    message:
                        error?.response?.data?.message ||
                        'Have an error. Please try again.',
                }),
            );
            setLoading(false);
        }
    };
    const handleChooseFile = () => {
        inputFile.current.click();
    };
    const handleChange = (e) => {
        if (avtUrl) URL.revokeObjectURL(avtUrl);
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setAvtUrl(URL.createObjectURL(file));
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            setFileSize(fileSize);
        }
    };
    return (
        <div className=" ">
            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="grid grid-cols-12 gap-3 ">
                {loading && <Loading loadingStatus={loading} />}
                <div className="col-span-9 flex flex-col gap-3">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id="name"
                                label="Full name"
                                placeholder={'Full name'}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                helperText={errors?.name?.message}
                                color={
                                    errors?.name?.message ? 'failure' : 'gray'
                                }
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id="email"
                                label="Email"
                                placeholder={'Your email'}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                helperText={errors?.email?.message}
                                color={
                                    errors?.email?.message ? 'failure' : 'gray'
                                }
                            />
                        )}
                    />
                    {isPhone ? (
                        <div className="flex items-end">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <InputCustom
                                        id="phone"
                                        label="Phone"
                                        value={field.value}
                                        placeholder={'(+84)'}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                        helperText={errors?.phone?.message}
                                        color={
                                            errors?.phone?.message
                                                ? 'failure'
                                                : 'gray'
                                        }
                                    />
                                )}
                            />
                            {user && !user.phone && (
                                <span
                                    className=" cursor-pointer flex-initial px-2 py-1  rounded-full bg-primary hover:bg-accent text-sm text-white ms-5 align-middle"
                                    onClick={() => {
                                        setIsPhone(false);
                                    }}>
                                    Cancel
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p className="text-xs text-rose-600 italic">
                                    Please add phone number to order.
                                </p>
                            </div>
                            <span
                                className="cursor-pointer px-2 py-1 rounded-full bg-primary hover:bg-accent text-sm text-white ms-5"
                                onClick={() => {
                                    setIsPhone(true);
                                }}>
                                Add new phone
                            </span>
                        </div>
                    )}
                </div>
                <div className="col-span-3 flex flex-col gap-3">
                    <AvatarText
                        src={avtUrl}
                        size="lg"
                        onClick={handleChooseFile}
                        className="cursor-pointer"
                    />

                    <div>
                        <div
                            className="py-1 border-2 border-dashed rounded-md text-center cursor-pointer"
                            onClick={handleChooseFile}>
                            Select Image
                        </div>

                        <input
                            type="file"
                            {...register('avatar', {
                                onChange: (e) => handleChange(e),
                            })}
                            name="avatar"
                            ref={(e) => {
                                ref(e);
                                inputFile.current = e; // you can still assign to ref
                            }}
                            accept="image/png, image/jpeg,image/jpg"
                            className="hidden "
                        />
                    </div>
                    <div className="text-sm text-gray-800">
                        <p>File size : maximum 5 MBp</p>
                        <p> File extension: .JPEG, .PNG</p>
                    </div>
                    {fileSize && (
                        <div className="text-md font-medium">
                            <p>File size of your choice: </p>
                            <p
                                className={clsx(
                                    fileSize > 5
                                        ? 'text-red-400'
                                        : 'text-green-400',
                                )}>
                                {fileSize}Mb
                            </p>
                            {errors?.avatar && (
                                <p className="bg-red-400 p-3 rounded-md">
                                    {errors?.avatar?.message}. Please choose
                                    other file.
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="h-8 w-16 text-center rounded-full bg-primary hover:bg-accent text-white shadow-md transition-all duration-300 ease-in-out ">
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;
'use client';
import { useSearchParams } from 'next/navigation';

import FormLogin from '@/components/FormLogin';
import imageUrl from '@/public/images/bg_login.jpg';
import Image from 'next/image';
import Alert from '@/components/Alert';

const page = () => {
    const searchParams = useSearchParams();

    const updatePassword = searchParams.get('updatePassword');

    return (
        <div className="w-screen h-screen flex justify-center bg-white">
            {updatePassword && (
                <div className="absolute top-10 max-w-md">
                    {' '}
                    <Alert
                        isShowProp={true}
                        status={'success'}
                        message={'Successfully updated password.'}
                    />
                </div>
            )}
            <div className="hidden xl:inline-block h-full w-1/2">
                <Image
                    src={imageUrl}
                    width={0}
                    height={0}
                    alt="login"
                    priority
                    className="w-full h-full rounded-r-full object-cover "
                />
            </div>
            <div className="md:w-1/2 flex justify-center items-center p-5 ">
                <FormLogin />
            </div>
        </div>
    );
};

export default page;

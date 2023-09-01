'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import ProfileForm from '@/components/Account/MyAccount/ProfileForm';
import Loading from './loading';
import { Suspense } from 'react';
const Profile = () => {
    return (
        <AccountTemplate
            title={'My Profile'}
            note={'Manage and protect your account'}>
            <Suspense fallback={<Loading />}>
                <ProfileForm />
            </Suspense>
        </AccountTemplate>
    );
};

export default Profile;

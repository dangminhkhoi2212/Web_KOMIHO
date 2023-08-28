import AccountTemplate from '@/components/Account/AccountTemplate';
import ProfileForm from '@/components/Account/MyAccount/ProfileForm';
const Profile = () => {
    return (
        <AccountTemplate
            title={'My Profile'}
            note={'Manage and protect your account'}>
            <ProfileForm />
        </AccountTemplate>
    );
};

export default Profile;

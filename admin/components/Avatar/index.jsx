import Image from 'next/image';
import ImageLogin from '@/public/images/bg_login.jpg';
const Avatar = ({ src }) => {
    return (
        <div className="w-12 h-12 overflow-hidden rounded-full">
            <Image
                src={ImageLogin}
                width={0}
                height={0}
                className="w-full h-full "
                alt="avatar"
            />
        </div>
    );
};

export default Avatar;

import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '@/public/logo/android-chrome-192x192.png';
const Logo = () => {
    return (
        <Link href="/" className="flex flex-col justify-center items-center">
            <Image
                src={LogoImage}
                alt="logo"
                priority
                width={36}
                height={36}></Image>
            <p className="text-md font-semibold">KOMIHO</p>
        </Link>
    );
};

export default Logo;

import Link from 'next/link';
import listSupports from './listSupports';
import MediaLink from './MediaLink';
const Footer = () => {
    return (
        <div className="grid grid-cols-8 gap-5 justify-items-center  lg:px-40 py-6 bg-white z-header text-sm">
            <div className="col-span-2 flex flex-col gap-2 ">
                <span className="font-semibold text-lg">LAUNCH</span>
                <p className="text-justify ">
                    KOMIHO - A diverse fashion e-commerce platform with
                    thousands of different products. For shoppers, offering a
                    convenient shopping experience, rich selection and reliable
                    product quality. For merchants, providing a powerful and
                    manageable commerce platform to display and sell products.
                </p>
            </div>
            <div className="col-span-2 flex flex-col gap-2 ">
                <span className="font-semibold text-lg">CONTACT</span>
                <p>
                    <span>Phone</span>: 0987654321
                </p>
                <p>
                    <span>Email</span>: kkhoi600@gmail.com
                </p>
            </div>
            <div className="col-span-2 flex flex-col gap-2 ">
                <span className="text-lg font-semibold">SUPPORTS</span>
                <ul className="flex flex-col gap-2 mt-3">
                    {listSupports.map((item) => (
                        <li key={item.name}>
                            <Link href={item.link}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-span-2 flex flex-col gap-2 ">
                <span className="text-lg font-semibold">SOCIAL MEDIA</span>

                <MediaLink />
            </div>
        </div>
    );
};

export default Footer;

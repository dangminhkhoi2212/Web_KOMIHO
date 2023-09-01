import Image from 'next/image';
import { TiDeleteOutline } from 'react-icons/ti';

const ShowImage = ({ gallery, setImages, setGallery }) => {
    const handleDeleteImage = (name, src) => {
        URL.revokeObjectURL(src);
        setGallery((pre) => pre.filter((img) => img.name !== name));
        setImages((pre) => pre.filter((img) => img.name !== name));
    };
    if (!gallery || gallery.length === 0) {
        return null; // Return early if there are no gallery
    }
    return (
        <div className="flex gap-4 w-full flex-wrap justify-center items-start my-3">
            {gallery.map((img) => {
                return (
                    <div
                        className="relative rounded-md overflow-hidden ring-2 ring-gray-100"
                        key={img.src}>
                        <TiDeleteOutline
                            className="absolute right-0 text-3xl text-red-400 m-2 cursor-pointer border-4 border-primary rounded-full"
                            onClick={() => {
                                handleDeleteImage(img.name, img.src);
                            }}
                        />
                        <Image
                            src={img.src}
                            width={0}
                            height={0}
                            alt={img.name}
                            className="rounded-md h-80 w-52  object-center object-cover"
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ShowImage;

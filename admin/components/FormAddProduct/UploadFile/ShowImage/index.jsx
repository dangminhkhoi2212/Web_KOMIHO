import Image from 'next/image';
import { TiDeleteOutline } from 'react-icons/ti';

const ShowImage = ({ images, setImages }) => {
    const handleDeleteImage = (id) => {
        setImages((pre) => [...pre.filter((img) => img.id !== id)]);
    };
    if (!images || images.length === 0) {
        return null; // Return early if there are no images
    }
    return (
        <div className="flex gap-4 w-full flex-wrap justify-center items-center">
            {images.map((img) => {
                return (
                    <div className="relative" key={img.src}>
                        <TiDeleteOutline
                            className="absolute right-0 text-3xl text-red-400 m-2 cursor-pointer border-4 border-primary rounded-full"
                            onClick={() => {
                                handleDeleteImage(img.id);
                            }}
                        />
                        <Image
                            src={img.src}
                            width={0}
                            height={0}
                            alt={img.id}
                            className="rounded-md w-72 h-96 object-center object-cover"
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ShowImage;

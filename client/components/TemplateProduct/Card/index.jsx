import Image from 'next/image';
const Card = ({ item }) => {
    return (
        <div>
            <Image src={item.src} alt={item.name} width={60} height={100} />
            <div>
                <p>{item.name}</p>
                {item.price.discount && <span>{item.price.discount}</span>}
                {item.price.current && <span>{item.price.current}</span>}
            </div>
        </div>
    );
};

export default Card;

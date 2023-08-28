import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';
const CardPromotion = () => {
    const cards = [
        {
            name: 'Top 5 Tee',
            href: '/',
            img: 'https://cdn2.yame.vn/pimg/ao-khoac-classic-y-nguyen-ban-18-ver48-0021327/eeb65e7f-6471-1100-b6f4-001a39386980.jpg?w=540&h=756&c=true',
            cls: 'row-span-1 col-span-6',
        },
        {
            name: 'Top 5 Pants',
            href: '/',
            img: 'https://cdn2.yame.vn/pimg/quan-dai-vai-the-style-of-no-style-73-0022015/71f23e10-5f5a-0b02-9757-001a33f22fdf.jpg?w=540&h=756&c=true',
            cls: 'row-span-2 col-span-6',
        },
        {
            name: 'Top 5 Shoes',
            href: '/',
            img: 'https://cdn2.yame.vn/pimg/ao-khoac-classic-y-nguyen-ban-18-ver48-0021327/eeb65e7f-6471-1100-b6f4-001a39386980.jpg?w=540&h=756&c=true',
            cls: 'row-span-1 col-span-6',
        },
    ];
    return (
        <div className="grid grid-cols-12 grid-rows-2 gap-3 h-full">
            {cards.map((card) => {
                const cardStyle = {
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                };
                return (
                    <Link
                        href={card.href}
                        key={card.name}
                        style={cardStyle}
                        className={clsx(
                            '   flex flex-col rounded-xl overflow-hidden',
                            card.cls,
                        )}>
                        <span className="shadow-md shadow-accent text-white text-lg font-semibold w-3/4 rounded-ss-xl rounded-ee-xl  bg-primary inline-block">
                            {card.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default CardPromotion;

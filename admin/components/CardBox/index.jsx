import React from 'react';
import { Badge } from '../ui/badge';
import AvatarText from '../Avatar';
import { NumericFormat } from 'react-number-format';
import { routes } from '@/routes';
import Link from 'next/link';

const CardBox = ({ data, title, labelText, suffix, linkFunction }) => {
    if (!data) return;
    return (
        <div className=" bg-white rounded-lg p-4 flex flex-col gap-3">
            <Badge className={' w-full text-lg'}>{title}</Badge>
            {data?.map((item, index) => (
                <div key={item._id} className="grid grid-cols-6">
                    <div className="col-span-1  place-self-center">
                        <span className="ring-1 px-2 py-1 rounded-md">
                            {index + 1}
                        </span>
                    </div>
                    <div className="col-span-5 hover:scale-105 hover:bg-secondary/50 px-2 py-1  rounded-md transition-all duration-150 ease-in-out">
                        <Link href={linkFunction(item._id)} className="">
                            {
                                <AvatarText
                                    src={item.image}
                                    name={item.name}
                                    text={
                                        <NumericFormat
                                            displayType="text"
                                            value={item.value}
                                            thousandSeparator
                                            suffix={suffix}
                                            renderText={(value) => (
                                                <p className=" font-medium my-2">
                                                    <span className="text-sm">
                                                        {labelText}:{' '}
                                                    </span>
                                                    <span className="text-blue-300">
                                                        {value}
                                                    </span>
                                                </p>
                                            )}
                                        />
                                    }
                                />
                            }
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardBox;

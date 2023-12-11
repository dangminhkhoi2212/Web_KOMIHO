import { useCallback, useState } from 'react';
import InputCustom from '@/components/InputCustom';

import { AiOutlineDelete } from 'react-icons/ai';
import { RiAddCircleLine } from 'react-icons/ri';
import { BiDownArrowAlt, BiUpArrowAlt, BiReset } from 'react-icons/bi';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import SizeAndQuantity from './SizeAndQuantity';
import PrimaryButton from '@/components/Button/PrimaryButton';
import clsx from 'clsx';

const FormColor = ({}) => {
    const {
        resetField,
        control,
        formState: { errors },
    } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'colors',
    });
    console.log('🚀 ~ file: index.jsx:22 ~ FormColor ~ fields:', fields);

    const [indexForm, setIndexForm] = useState(fields.length);

    const handleFocus = (index) => {
        if (index < 0) index = 0;
        setIndexForm(index);
    };
    const handleMoveUp = useCallback(() => {
        if (indexForm > 0) {
            move(indexForm, indexForm - 1);
            setIndexForm(Math.max(0, indexForm - 1));
        }
    }, [indexForm, fields]);
    const handleMoveDown = useCallback(() => {
        if (indexForm < fields.length - 1) {
            move(indexForm, indexForm + 1);
            setIndexForm(Math.min(fields.length - 1, indexForm + 1));
        }
    }, [indexForm, fields]);

    return (
        <div className="rounded-xl bg-white relative">
            <p className="my-2 font-medium">Colors</p>

            <section className="inline-flex sticky top-28 bg-primary items-center my-2 justify-start z-button shadow-md px-3 py-2 rounded-xl ">
                <PrimaryButton
                    icon={RiAddCircleLine}
                    onClick={() => {
                        append({
                            name: '',
                            sizes: [{ type: '', quantity: '' }],
                        });
                    }}
                />
                <PrimaryButton icon={BiUpArrowAlt} onClick={handleMoveUp} />
                <PrimaryButton icon={BiDownArrowAlt} onClick={handleMoveDown} />
                <PrimaryButton
                    icon={BiReset}
                    onClick={() => resetField('colors')}
                />
            </section>
            <div className="flex flex-col gap-5">
                {fields.map((item, index) => {
                    return (
                        <div
                            className={clsx(
                                'grid grid-cols-12 gap-5 items-center',
                            )}
                            key={item.id}
                            onClick={() => handleFocus(index)}>
                            <div
                                className={clsx(
                                    'col-span-11  flex flex-col  border border-dotted border-gray-500 p-5 rounded-xl',
                                    { 'bg-blue-50': index === indexForm },
                                )}>
                                <div className=" w-1/3 ">
                                    <Controller
                                        control={control}
                                        name={`colors.${index}.name`}
                                        render={({ field }) => (
                                            <InputCustom
                                                id={`colors.${item.id}`}
                                                label={'Color Name'}
                                                placeholder={'Product colors '}
                                                onFocus={() => {
                                                    handleFocus(index);
                                                }}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value,
                                                    );
                                                }}
                                                helperText={
                                                    errors &&
                                                    errors.colors &&
                                                    errors?.colors[index]?.name
                                                        ?.message
                                                }
                                                color={
                                                    errors &&
                                                    errors.colors &&
                                                    errors.colors[index]?.name
                                                        ?.message
                                                        ? 'failure'
                                                        : 'gray'
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                <SizeAndQuantity
                                    indexColor={index}
                                    focusColor={index === indexForm}
                                    colors={fields}
                                    control={control}
                                />
                            </div>
                            {fields.length > 1 && (
                                <div
                                    className="col-span-1 justify-self-center cursor-pointer"
                                    onClick={() => remove(index)}>
                                    <AiOutlineDelete className="text-md p-2 rounded-full bg-red-400 text-white hover:bg-red-500 w-10 h-10" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormColor;

import { useState, useCallback, memo } from 'react';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import InputCustom from '@/components/InputCustom';
import { AiOutlineDelete } from 'react-icons/ai';
import { RiAddCircleLine } from 'react-icons/ri';
import { BiDownArrowAlt, BiUpArrowAlt, BiReset } from 'react-icons/bi';

import PrimaryButton from '@/components/Button/PrimaryButton';
import clsx from 'clsx';
const FormSizeAndQuanitity = ({ indexColor, focusColor, color }) => {
    const positionColor = `color.${indexColor}`;

    const {
        control,
        reset,

        formState: { errors },
    } = useFormContext();
    console.log(
        '🚀 ~ file: index.jsx:19 ~ FormSizeAndQuanitity ~ errors:',
        errors,
    );
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: `${positionColor}.size`,
    });
    const [indexForm, setIndexForm] = useState(fields.length);
    console.log(
        '🚀 ~ file: index.jsx:30 ~ FormSizeAndQuanitity ~ indexForm:',
        indexForm,
    );
    const handleFocus = (index) => {
        if (index < 0) index = 0;
        setIndexForm(index);
    };
    const hanleMoveUp = useCallback(() => {
        if (indexForm > 0) {
            move(indexForm, indexForm - 1);
            setIndexForm(Math.max(0, indexForm - 1));
        }
    }, [indexForm, fields]);
    const hanleMoveDown = useCallback(() => {
        if (indexForm < fields.length - 1) {
            move(indexForm, indexForm + 1);
            setIndexForm(Math.min(fields.length - 1, indexForm + 1));
        }
    }, [indexForm, fields]);
    return (
        <>
            <section className="inline-flex  bg-transparent items-center my-2 justify-end">
                <PrimaryButton
                    icon={RiAddCircleLine}
                    onClick={() => {
                        append({
                            type: '',
                            quantity: '',
                        });
                    }}
                />
                <PrimaryButton icon={BiUpArrowAlt} onClick={hanleMoveUp} />
                <PrimaryButton icon={BiDownArrowAlt} onClick={hanleMoveDown} />
                <PrimaryButton
                    icon={BiReset}
                    onClick={() =>
                        reset({
                            color: color.map((color, index) => {
                                if (index === indexColor) {
                                    return {
                                        ...color,
                                        size: [
                                            {
                                                type: '',
                                                quantity: '',
                                            },
                                        ],
                                    };
                                }
                                return color;
                            }),
                        })
                    }
                />
            </section>

            <hr className="mb-1" />
            {fields.map((item, index) => {
                return (
                    <div
                        className={clsx(
                            'grid grid-cols-3  justify-items-end items-center p-2 rounded-xl',
                            {
                                'bg-blue-100':
                                    index === indexForm && focusColor,
                            },
                        )}
                        key={item.id}
                        onClick={() => handleFocus(index)}>
                        <div className="col-span-1 flex">
                            <Controller
                                name={`${positionColor}.size.${index}.type`}
                                control={control}
                                render={({ field }) => (
                                    <InputCustom
                                        id={item.id}
                                        label={'Size '}
                                        type={'text'}
                                        placeholder={'Product Sizes '}
                                        onFocus={() => handleFocus(index)}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        helperText={
                                            errors &&
                                            errors.color &&
                                            errors.color[indexColor] &&
                                            errors.color[indexColor].size &&
                                            errors.color[indexColor]?.size[
                                                index
                                            ]?.type?.message
                                        }
                                        color={
                                            errors &&
                                            errors.color &&
                                            errors.color[indexColor] &&
                                            errors.color[indexColor].size &&
                                            errors.color[indexColor]?.size[
                                                index
                                            ]?.type?.message
                                                ? 'failure'
                                                : 'gray'
                                        }
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <Controller
                                name={`${positionColor}.size.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                    <InputCustom
                                        id={`${item.id}-quantity`}
                                        label={'Quantity '}
                                        type={'text'}
                                        placeholder={'Quantity '}
                                        onFocus={() => handleFocus(index)}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        helperText={
                                            errors &&
                                            errors.color &&
                                            errors.color[indexColor] &&
                                            errors.color[indexColor].size &&
                                            errors.color[indexColor]?.size[
                                                index
                                            ]?.quantity?.message
                                        }
                                        color={
                                            errors &&
                                            errors.color &&
                                            errors.color[indexColor] &&
                                            errors.color[indexColor].size &&
                                            errors.color[indexColor]?.size[
                                                index
                                            ]?.quantity?.message
                                                ? 'failure'
                                                : 'gray'
                                        }
                                    />
                                )}
                            />
                        </div>
                        {fields.length > 1 && (
                            <PrimaryButton
                                icon={AiOutlineDelete}
                                style={'bg-red-400 justify-self-center'}
                                onClick={() => remove(index)}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default memo(FormSizeAndQuanitity);

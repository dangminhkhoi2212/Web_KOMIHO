import { initialize } from 'next/dist/server/lib/render-server';
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PrimaryButton from '@/components/Button/PrimaryButton';
import { AiOutlineDelete } from 'react-icons/ai';
import { RiAddCircleLine } from 'react-icons/ri';
import { BiDownArrowAlt, BiUpArrowAlt, BiReset } from 'react-icons/bi';

const FromController = ({ indexForm = 0, setIndexForm }) => {
    console.log(
        '🚀 ~ file: index.jsx:10 ~ FromController ~ indexForm, setIndexForm:',
        indexForm,
        setIndexForm,
    );
    const { control, reset } = useFormContext();
    const { append, remove, move } = useFieldArray({
        control,
        name: 'color',
    });
    const hanleMoveUp = () => {
        if (indexForm > 0) {
            move(indexForm, indexForm - 1);
            setIndexForm(Math.max(0, indexForm - 1));
        }
    };
    const hanleMoveDown = () => {
        if (indexForm < fields.length - 1) {
            move(indexForm, indexForm + 1);
            setIndexForm(Math.min(fields.length - 1, indexForm + 1));
        }
    };
    return (
        <section className="flex gap-3 sticky top-0 bg-white items-center my-2 justify-center">
            <PrimaryButton
                icon={RiAddCircleLine}
                onClick={() => {
                    append({
                        name: '',
                        size: [{ type: '', quantity: '' }],
                    });
                }}
            />
            <PrimaryButton icon={BiUpArrowAlt} onClick={() => hanleMoveUp} />
            <PrimaryButton
                icon={BiDownArrowAlt}
                onClick={() => hanleMoveDown}
            />
            <PrimaryButton
                icon={BiReset}
                onClick={() =>
                    reset({
                        color: [
                            {
                                name: '',
                                size: [{ type: '', quantity: '' }],
                            },
                        ],
                    })
                }
            />
            <PrimaryButton
                icon={AiOutlineDelete}
                style={'bg-red-400'}
                onClick={() => remove(indexForm)}
            />
        </section>
    );
};

export default FromController;

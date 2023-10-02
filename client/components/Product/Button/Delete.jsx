import { chooseProduct, chooseStatus } from '@/redux/chooseProductSlice';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
const Delete = ({ product }) => {
    const dispatch = useDispatch();
    const handleChooseProduct = () => {
        if (!product) return;
        dispatch(chooseProduct(product));
        dispatch(chooseStatus('delete'));
    };
    return (
        <div role="button" onClick={() => handleChooseProduct()}>
            <AiOutlineDelete className="h-8 w-8 p-2 rounded-xl bg-red-400 shadow-md shadow-red-400 hover:shadow-lg hover:shadow-red-400" />
        </div>
    );
};

export default Delete;

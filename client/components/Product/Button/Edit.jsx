import { chooseProduct, chooseStatus } from '@/redux/chooseProductSlice';
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
const Edit = ({ product }) => {
    const dispatch = useDispatch();
    const handleChooseProduct = () => {
        if (!product) return;
        dispatch(chooseProduct(product));
        dispatch(chooseStatus('edit'));
    };
    return (
        <div role="button" onClick={() => handleChooseProduct()}>
            <FiEdit2 className="h-8 w-8  p-2 rounded-xl bg-green-400 shadow-md shadow-green-400 hover:shadow-lg hover:shadow-green-400" />
        </div>
    );
};

export default Edit;

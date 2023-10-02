import React from 'react';

const cartItem = ({ seller, products }) => {
    console.log('🚀 ~ file: index.jsx:4 ~ cartItem ~ seller:', seller);
    return (
        <div className=" px-5 py-4 rounded-md bg-white">
            <div className="">{seller?.name}</div>
            <div className="grid grid-cols-12 ">
                <div className="col-span-1">f</div>
                <div className="col-span-6">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1">Actions</div>
            </div>
        </div>
    );
};

export default cartItem;

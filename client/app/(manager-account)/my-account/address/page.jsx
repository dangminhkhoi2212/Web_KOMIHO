'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import AddressComponent from '@/components/Account/MyAccount/Address';
import { useSelector } from 'react-redux';
import {
    getName,
    getPhone,
    getPickupAddress,
    getStoreAddress,
    getUserId,
} from '@/redux/selector';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useState } from 'react';
import Modal from '@/components/Modal';
import { RiMapPinAddLine } from 'react-icons/ri';

import { useDispatch } from 'react-redux';
import { setUser } from '@/components/Auth/authSlice';
import { updateAddress } from '@/services/user.service';
import Loading from '@/components/Loading';
import { setAlert } from '@/components/Alert/alertSlice';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const Address = () => {
    const userId = useSelector(getUserId);
    const pickupAddress = useSelector(getPickupAddress);
    const storeAddress = useSelector(getStoreAddress);
    const name = useSelector(getName);
    const phone = useSelector(getPhone);

    const [showEditPickup, setShowEditPickup] = useState(false);
    const [showEditStore, setShowEditStore] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleUpdateAddress = useMutation({
        mutationFn: async (data) => {
            if ('pickup' in data) setShowEditPickup(false);
            else setShowEditStore(false);

            return await updateAddress(userId, data);
        },
        onSuccess(data) {
            dispatch(setUser(data));
            toast.success('Successfully updated.');
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Update failed. Please try again.',
            );
        },
    });

    const handleDeleteAddress = useMutation({
        mutationFn: async (type) => {
            var result;
            if (type === 'pickup') {
                result = await updateAddress(userId, { pickup: {} });
            } else result = await updateAddress(userId, { store: {} });
            return result;
        },
        onSuccess(data) {
            dispatch(setUser(data));
            toast.success('Delete successfully.');
        },
        onError(error) {
            toast.error('Delete failed. Please try again.');
        },
    });

    return (
        <div className="overflow-hidden relative flex flex-col gap-3">
            {(handleDeleteAddress.isLoading ||
                handleUpdateAddress.isLoading) && <Loading />}

            <AccountTemplate
                title={'PICKUP ADDRESS'}
                note={'Your order will be delivered to this address.'}
                key={'pickup'}>
                {showEditPickup && (
                    <Modal
                        label={'Update pickup address'}
                        showModel={showEditPickup}
                        handleEvent={() => setShowEditPickup(false)}
                        size="xl">
                        <AddressComponent
                            type={'pickup'}
                            handleUpdate={handleUpdateAddress.mutate}
                            address={pickupAddress}
                        />
                    </Modal>
                )}
                {pickupAddress ? (
                    <div className="grid grid-cols-12 p-4 bg-secondary rounded-xl">
                        <div className="col-span-11">
                            <div className="flex gap-3 font-medium">
                                <span>{name}</span>
                                <span className=" hidden h-5 w-px bg-slate-900/10 sm:block"></span>
                                <span>{phone}</span>
                            </div>
                            <p>{pickupAddress?.sub}</p>
                            <p>{pickupAddress?.main}</p>
                        </div>
                        <div className="col-span-1 flex items-center gap-3">
                            <FiEdit3
                                className="font-medium text-2xl  cursor-pointer"
                                onClick={() => setShowEditPickup(true)}
                            />
                            <AiOutlineDelete
                                className="font-medium text-2xl cursor-pointer"
                                onClick={() =>
                                    handleDeleteAddress.mutate('pickup')
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-orange-300">
                            You have not a pickup address.
                        </p>
                        <RiMapPinAddLine
                            className="font-medium text-2xl  cursor-pointer bg-secondary rounded-full h-8 w-8 p-1"
                            onClick={() => setShowEditPickup(true)}
                        />
                    </div>
                )}
            </AccountTemplate>
            <AccountTemplate
                title={'STORE ADDRESS'}
                note={'Shippers will get goods from this address.'}
                key={'store'}>
                {showEditStore && (
                    <Modal
                        label={'Update store address'}
                        showModel={showEditStore}
                        size="xl"
                        handleEvent={() => setShowEditStore(false)}>
                        <AddressComponent
                            type={'store'}
                            handleUpdate={handleUpdateAddress.mutate}
                            address={storeAddress}
                        />
                    </Modal>
                )}
                {storeAddress ? (
                    <div className="grid grid-cols-12 p-4 bg-secondary rounded-xl">
                        <div className="col-span-11">
                            <div className="flex gap-3 font-medium">
                                <span>{name}</span>
                                <span className=" hidden h-5 w-px bg-slate-900/10 sm:block"></span>
                                <span>{phone}</span>
                            </div>
                            <p>{storeAddress?.sub}</p>
                            <p>{storeAddress?.main}</p>
                        </div>
                        <div className="col-span-1 flex items-center gap-3">
                            <FiEdit3
                                className="font-medium text-2xl  cursor-pointer"
                                onClick={() => setShowEditStore(true)}
                            />
                            <AiOutlineDelete
                                className="font-medium text-2xl cursor-pointer"
                                onClick={() =>
                                    handleDeleteAddress.mutate('store')
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-orange-300">
                            You have not a store address.
                        </p>
                        <RiMapPinAddLine
                            className="font-medium text-2xl  cursor-pointer bg-secondary rounded-full h-8 w-8 p-1"
                            onClick={() => setShowEditStore(true)}
                        />
                    </div>
                )}
            </AccountTemplate>
        </div>
    );
};

export default Address;

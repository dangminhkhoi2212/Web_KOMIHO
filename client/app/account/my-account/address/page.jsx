'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import AddressComponent from '@/components/Account/MyAccount/Address';
import { useSelector } from 'react-redux';
import { getUser } from '@/redux/selector';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useState } from 'react';
import Model from '@/components/Model';
import { RiMapPinAddLine } from 'react-icons/ri';

import { useDispatch } from 'react-redux';
import { setUser } from '@/components/Auth/authSlice';
import { updateAddress } from '@/services/user.service';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';
const Address = () => {
    const user = useSelector(getUser);
    const [showEditPickup, setShowEditPickup] = useState(false);
    const [showEditStore, setShowEditStore] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [statusAlert, setStatusAlert] = useState('');

    const handleUpdate = async (data) => {
        try {
            setLoading(true);
            setMessage('');
            if ('pickup' in data) setShowEditPickup(false);
            else setShowEditStore(false);

            const result = await updateAddress(user._id, data);
            if (result) dispatch(setUser(result));

            setStatusAlert('success');
            setMessage('Update successfully.');
            setLoading(false);
        } catch (error) {
            setStatusAlert('failure');
            setMessage('Update failed. Please try again.');
            setLoading(false);
        }
    };

    const handleDelete = async (type) => {
        try {
            setLoading(true);
            setMessage('');
            var result;
            if (type === 'pickup') {
                result = await updateAddress(user._id, { pickup: {} });
            } else result = await updateAddress(user._id, { store: {} });
            if (result) dispatch(setUser(result));
            setStatusAlert('success');
            setMessage('Delete successfully.');
            setLoading(false);
        } catch (error) {
            setStatusAlert('failure');
            setMessage('Delete failed. Please try again.');
            setLoading(false);
        }
    };
    return (
        <div className="">
            {message && <Alert status={statusAlert} message={message} />}
            {loading && <Loading loadingStatus={loading} />}

            <div>
                <AccountTemplate
                    title={'Pickup address'}
                    note={'Your order will be delivered to this address.'}
                    key={'pickup'}>
                    {showEditPickup && (
                        <Model
                            label={'Update pickup address'}
                            showModel={showEditPickup}
                            handleEvent={() => setShowEditPickup(false)}>
                            <AddressComponent
                                type={'pickup'}
                                handleUpdate={handleUpdate}
                                address={user?.address?.pickup}
                            />
                        </Model>
                    )}
                    {user?.address?.pickup ? (
                        <div className="grid grid-cols-12 p-4 bg-secondary rounded-xl">
                            <div className="col-span-11">
                                <div className="flex gap-3 font-medium">
                                    <span>{user?.name}</span>
                                    <span className=" hidden h-5 w-px bg-slate-900/10 sm:block"></span>
                                    <span>{user?.phone}</span>
                                </div>
                                <p>{user?.address?.pickup?.sub}</p>
                                <p>{user?.address?.pickup?.main}</p>
                            </div>
                            <div className="col-span-1 flex items-center gap-3">
                                <FiEdit3
                                    className="font-medium text-2xl  cursor-pointer"
                                    onClick={() => setShowEditPickup(true)}
                                />
                                <AiOutlineDelete
                                    className="font-medium text-2xl cursor-pointer"
                                    onClick={() => handleDelete('pickup')}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-orange-300">
                                Your have not a pickup address.
                            </p>
                            <RiMapPinAddLine
                                className="font-medium text-2xl  cursor-pointer bg-secondary rounded-full h-8 w-8 p-1"
                                onClick={() => setShowEditPickup(true)}
                            />
                        </div>
                    )}
                </AccountTemplate>
                <AccountTemplate
                    title={'Store address'}
                    note={'Shippers will get goods from this address.'}
                    key={'store'}>
                    {showEditStore && (
                        <Model
                            label={'Update store address'}
                            showModel={showEditStore}
                            handleEvent={() => setShowEditStore(false)}>
                            <AddressComponent
                                type={'store'}
                                handleUpdate={handleUpdate}
                                address={user?.address?.store}
                            />
                        </Model>
                    )}
                    {user?.address?.store ? (
                        <div className="grid grid-cols-12 p-4 bg-secondary rounded-xl">
                            <div className="col-span-11">
                                <div className="flex gap-3 font-medium">
                                    <span>{user?.name}</span>
                                    <span className=" hidden h-5 w-px bg-slate-900/10 sm:block"></span>
                                    <span>{user?.phone}</span>
                                </div>
                                <p>{user?.address?.store?.sub}</p>
                                <p>{user?.address?.store?.main}</p>
                            </div>
                            <div className="col-span-1 flex items-center gap-3">
                                <FiEdit3
                                    className="font-medium text-2xl  cursor-pointer"
                                    onClick={() => setShowEditStore(true)}
                                />
                                <AiOutlineDelete
                                    className="font-medium text-2xl cursor-pointer"
                                    onClick={() => handleDelete('store')}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-orange-300">
                                Your have not a store address.
                            </p>
                            <RiMapPinAddLine
                                className="font-medium text-2xl  cursor-pointer bg-secondary rounded-full h-8 w-8 p-1"
                                onClick={() => setShowEditStore(true)}
                            />
                        </div>
                    )}
                </AccountTemplate>
            </div>
        </div>
    );
};

export default Address;

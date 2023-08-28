'use client';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddressForm from './AddressForm';
import InputCustom from '@/components/InputCustom';
const Address = ({ type, address, handleUpdate }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [mainAddress, setMainAddress] = useState(address?.main || '');
    const [message, setMessage] = useState('');
    const handleUpdateAddress = async (data) => {
        const checkUndefined = mainAddress.includes('undefined');
        if (checkUndefined) {
            setMessage('Please select full province, district, ward');
            return;
        }
        var newAddress = {};
        if (type === 'pickup') {
            newAddress.pickup = {};
            newAddress.pickup.main = mainAddress;
            newAddress.pickup.sub = data.location || address?.sub;
        } else {
            newAddress.store = {};
            newAddress.store.main = mainAddress;
            newAddress.store.sub = data.location || address?.sub;
        }
        handleUpdate(newAddress);
    };
    return (
        <form
            onSubmit={handleSubmit(handleUpdateAddress)}
            className="flex flex-col gap-3">
            <AddressForm setValue={setMainAddress} />
            <Controller
                name="location"
                control={control}
                render={({ field }) => (
                    <InputCustom
                        id={'location'}
                        label={'Location'}
                        helperText={errors?.location?.message}
                        color={errors?.location?.message ? 'failure' : 'gray'}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={address?.sub || 'Số nhà, đường, ...'}
                    />
                )}
            />
            {message && <p className="text-red-400">{message}</p>}
            <button
                type="submit"
                className="px-3 py-2 rounded-full bg-primary hover:bg-accent text-white shadow-md transition-all duration-300 ease-in-out">
                Save
            </button>
        </form>
    );
};

export default Address;

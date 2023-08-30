'use client';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddressForm from './AddressForm';
import InputCustom from '@/components/InputCustom';
const Address = ({ type, address, handleUpdate }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            location: address?.sub,
        },
    });
    const [originMainAddress, setOriginMainAddress] = useState(address?.main);
    const [mainAddress, setMainAddress] = useState(address?.main || '');
    const [message, setMessage] = useState('');
    const handleUpdateAddress = async (data) => {
        const temp = mainAddress.split('...').length - 1;
        var newAddress = {};

        if (temp === 0) {
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
        } else if (temp == 3) {
            if (type === 'pickup') {
                newAddress.pickup = {};
                newAddress.pickup.main = address?.main;
                newAddress.pickup.sub = data.location || address?.sub;
            } else {
                newAddress.store = {};
                newAddress.store.main = address?.main;
                newAddress.store.sub = data.location || address?.sub;
            }
            handleUpdate(newAddress);
        } else {
            setMessage('Please select full province, district, ward');
        }
    };
    useEffect(() => {
        const temp = mainAddress.split('...').length - 1;
        if (temp < 3) {
            setOriginMainAddress(mainAddress);
        }
    }, [mainAddress]);
    return (
        <form
            onSubmit={handleSubmit(handleUpdateAddress)}
            className="flex flex-col gap-3">
            <AddressForm setValue={setMainAddress} />
            <p>{originMainAddress}</p>
            <Controller
                name="location"
                control={control}
                render={({ field }) => (
                    <InputCustom
                        id={'location'}
                        label={'Location'}
                        helperText={errors?.location?.message}
                        value={field.value || ''}
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

'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

const PROVINCE_API = 'https://provinces.open-api.vn/api/';
import SelectInput from '@/components/SelectCustom';
import { useDispatch } from 'react-redux';
const AddressForm = ({ setValue }) => {
    const dispatch = useDispatch();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [wardCode, setWardCode] = useState('');

    useEffect(() => {
        const getApi = async () => {
            try {
                const data = (await axios.get(`${PROVINCE_API}p/`)).data;

                if (data) setProvinces(data);
            } catch (error) {
                dispatch(
                    setAlert({
                        status: 'failure',
                        message: "Don't get provinces. Please try again.",
                    }),
                );
            }
        };
        getApi();
    }, []);

    useEffect(() => {
        setDistricts([]);
        setWards([]);
        const getApi = async () => {
            try {
                const data = (
                    await axios.get(`${PROVINCE_API}p/${provinceCode}?depth=2`)
                ).data;

                if (data) setDistricts(data.districts);
            } catch (error) {
                dispatch(
                    setAlert({
                        status: 'failure',
                        message: "Don't get districts. Please try again.",
                    }),
                );
            }
        };
        getApi();
    }, [provinceCode]);

    useEffect(() => {
        setWards([]);

        const getApi = async () => {
            try {
                const data = (
                    await axios.get(`${PROVINCE_API}d/${districtCode}?depth=2`)
                ).data;

                if (data) setWards(data.wards);
            } catch (error) {
                dispatch(
                    setAlert({
                        status: 'failure',
                        message: "Don't get wards. Please try again.",
                    }),
                );
            }
        };
        getApi();
    }, [districtCode]);

    useEffect(() => {
        const province = provinces
            ? provinces.find((item) => item.code == provinceCode)
            : '';

        const district = districts
            ? districts.find((item) => item.code == districtCode)
            : '';

        const ward = wards ? wards.find((item) => item.code == wardCode) : '';
        const data = `${ward?.name || '...'}, ${district?.name || '...'}, ${
            province?.name || '...'
        }`;
        setValue(data);
    }, [provinceCode, districtCode, wardCode]);
    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-5">
                <SelectInput
                    label={'Select province'}
                    options={provinces}
                    setValue={setProvinceCode}
                />
                <SelectInput
                    label={'Select district'}
                    options={districts}
                    setValue={setDistrictCode}
                />
                <SelectInput
                    label={'Select ward'}
                    options={wards}
                    setValue={setWardCode}
                />
            </div>
        </div>
    );
};

export default AddressForm;

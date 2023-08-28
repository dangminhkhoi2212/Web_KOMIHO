'use client';

import { Label, Select } from 'flowbite-react';

export default function SelectInput({ label, options, setValue }) {
    const handleOnChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <div className="max-w-md opacity-100 z-container" id="select">
            <div className="mb-2 block">
                <Label htmlFor="countries" value={label} />
            </div>
            <Select
                required
                onChange={handleOnChange}
                className="opacity-100 z-container">
                <option>--{label}--</option>
                {options &&
                    options.map((opt, index) => (
                        <option key={index} value={opt.code}>
                            {opt.name}
                        </option>
                    ))}
            </Select>
        </div>
    );
}

import React from 'react';

const AccountTemplate = ({ title, note, button, children }) => {
    return (
        <div className="px-8 py-5 bg-white rounded-xl ">
            <div className="flex justify-between">
                <div>
                    <p className="text-xl font-medium">{title}</p>
                    <p className="text-gray-600 text-sm">{note}</p>
                </div>
                {button && <div>{button}</div>}
            </div>
            <hr className="my-3" />
            <div className="relative">{children}</div>
        </div>
    );
};

export default AccountTemplate;

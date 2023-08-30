import React from 'react';

const AccountTemplate = ({ title, note, children }) => {
    return (
        <div className="px-8 py-5 ">
            <div>
                <p className="text-xl font-medium">{title}</p>
                <p className="text-gray-600 text-sm">{note}</p>
            </div>
            <hr className="my-3" />
            {children}
        </div>
    );
};

export default AccountTemplate;

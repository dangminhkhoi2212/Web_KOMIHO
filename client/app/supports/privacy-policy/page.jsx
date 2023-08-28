import React from 'react';
import createMarkup from './text.js';
const PrivacyPolicy = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold m-5">Privacy Policy</h1>
            <div dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
    );
};

export default PrivacyPolicy;

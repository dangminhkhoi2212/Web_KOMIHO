import React from 'react';
import createMarkup from './text.js';
const TermsOfService = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold m-5">Terms of Service</h1>
            <div dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
    );
};

export default TermsOfService;

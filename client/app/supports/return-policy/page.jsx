import React from 'react';
import createMarkup from './text.js';
const ReturnPolicy = () => {
    return (
        <div>
            <h1 className="text-3xl font-semibold m-5">Return Policy</h1>
            <div
                dangerouslySetInnerHTML={createMarkup()}
                className="leading-relaxed"></div>
        </div>
    );
};

export default ReturnPolicy;

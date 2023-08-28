import React from 'react';
import createMarkup from './text.js';
const AboutUs = () => {
    return (
        <div className="">
            <h1 className="text-3xl font-semibold m-5">Launch</h1>
            <div
                dangerouslySetInnerHTML={createMarkup()}
                className="leading-relaxed"></div>
        </div>
    );
};

export default AboutUs;

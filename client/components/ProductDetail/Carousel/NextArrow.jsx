import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
const NextArrow = ({ className, style, onClick }) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                display: 'block',
                background: '#8FB3FF',
                borderRadius: '100%',
            }}
            onClick={onClick}></div>
    );
};

export default NextArrow;

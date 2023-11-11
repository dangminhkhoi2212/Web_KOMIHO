import React from 'react';

const PreviousArrow = ({ className, style, onClick }) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                display: 'block',
                background: '#8FB3FF',
                borderRadius: '100%',
            }}
            onClick={onClick}
        />
    );
};

export default PreviousArrow;

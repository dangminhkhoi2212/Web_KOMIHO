import { createElement, memo } from 'react';
import clsx from 'clsx';
const PrimaryButton = ({ icon, text, onClick, style }) => {
    console.log(
        "🚀 ~ file: PrimaryButton.jsx:5 ~ PrimaryButton ~ 'button':",
        'button',
    );
    return (
        <button
            type="button"
            className={clsx(
                'h-7 w-7  rounded-full  ease-in-out duration-500 text-black mx-1',
                style ? style : 'bg-white hover:bg-yellow-200',
            )}
            onClick={onClick}>
            {icon &&
                createElement(icon, {
                    className: 'p-1 h-full w-full stroke-white',
                })}
            {text && <span className="px-5 py-4">{text}</span>}
        </button>
    );
};

export default memo(PrimaryButton);

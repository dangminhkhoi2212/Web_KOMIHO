import { HashLoader } from 'react-spinners';

const Loading = ({ colorProp, sizeProp }) => {
    let color = colorProp || '#8fb3ff';
    const size = sizeProp || 100;

    return (
        <>
            <div className="inset-0 absolute z-loading bg-black/10 opacity-50 rounded-md"></div>
            <HashLoader
                color={color}
                loading={true}
                size={size}
                aria-label="Loading Spinner"
                data-testid="loader"
                cssOverride={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 1,
                    zIndex: 60,
                }}
                speedMultiplier={1.6}
            />
        </>
    );
};

export default Loading;

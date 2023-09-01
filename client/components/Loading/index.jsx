import { HashLoader } from 'react-spinners';

const Loading = ({ loadingStatus, colorProp, sizeProp }) => {
    let color = colorProp || '#8fb3ff';
    const size = sizeProp || 100;

    return (
        <div className="flex justify-center items-center inset-0 absolute z-loading ">
            <HashLoader
                color={color}
                loading={loadingStatus}
                size={size}
                aria-label="Loading Spinner"
                data-testid="loader"
                speedMultiplier={1.6}
            />
        </div>
    );
};

export default Loading;

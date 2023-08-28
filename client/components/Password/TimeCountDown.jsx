import { useCallback, memo } from 'react';
import Countdown from 'react-countdown';

const TimeCountDown = ({ timeCount }) => {
    const Completionist = () => (
        <span className="text-red-500">Expired code.</span>
    );
    const renderer = useCallback(({ minutes, seconds, completed }) => {
        if (completed) {
            return <Completionist />;
        } else {
            return (
                <span className="font-medium italic">
                    Code expires after{' '}
                    <span className="font-bold">
                        {minutes}:{seconds}
                    </span>
                </span>
            );
        }
    }, []);
    return <Countdown date={Date.now() + timeCount} renderer={renderer} />;
};

export default memo(TimeCountDown);

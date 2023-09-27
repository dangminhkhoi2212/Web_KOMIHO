import { Button } from 'flowbite-react';

const ButtonModal = ({ handleYes, handleNo }) => {
    const handleYesClick = async () => {
        if (!handleYes) return;
        await handleYes();
    };
    const handleNoClick = async () => {
        if (!handleNo) return;
        await handleNo();
    };
    return (
        <div className="flex justify-center gap-4">
            <Button
                color="failure"
                onClick={() => {
                    handleYesClick();
                }}>
                Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => handleNoClick()}>
                No, cancel
            </Button>
        </div>
    );
};
export default ButtonModal;

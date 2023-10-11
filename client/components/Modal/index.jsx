'use client';
import { useState, memo } from 'react';
import { Modal } from 'flowbite-react';

const FormElements = ({
    label,
    showModel,
    handleEvent,
    children,
    size = 'md',
}) => {
    const [openModal, setOpenModal] = useState(showModel || true);
    const props = { openModal, setOpenModal };
    const handleOnClose = () => {
        props.setOpenModal(false);
        if (handleEvent) handleEvent();
    };
    return (
        <Modal
            show={props.openModal === true}
            onClose={() => handleOnClose()}
            size={size}
            className="z-drop-down overflow-hidden">
            {label && <Modal.Header>{label}</Modal.Header>}
            <Modal.Body className="relative z-container">{children}</Modal.Body>
        </Modal>
    );
};
export default memo(FormElements);

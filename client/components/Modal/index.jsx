'use client';
import { useState, memo } from 'react';
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';

const FormElements = ({ label, showModel, handleEvent, children }) => {
    const [openModal, setOpenModal] = useState(showModel);
    const props = { openModal, setOpenModal };
    const handleOnClose = () => {
        props.setOpenModal(false);
        if (handleEvent) handleEvent();
    };
    return (
        <Modal
            dismissible
            show={props.openModal === true}
            onClose={handleOnClose}
            className="z-drop-down">
            {label && <Modal.Header>{label}</Modal.Header>}
            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
};
export default memo(FormElements);

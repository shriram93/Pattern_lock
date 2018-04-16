import React from 'react';
import Modal from 'react-modal';
import './PatternSetModal.css';

class PatternSetModal extends React.Component {
    render() {
    return (
        <Modal
            isOpen={true}
            contentLabel="Pattern set successfully"
            className="Modal"
            overlayClassName="Overlay"
            ariaHideApp={false}
        >
            <h1 className="lead">Pattern set successfully</h1>
        </Modal>
    );
    }
}

export default PatternSetModal;
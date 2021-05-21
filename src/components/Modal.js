import React, {useRef} from 'react';
import './Modal.css';
import ClearIcon from '@material-ui/icons/Clear';

function Modal({children, closeModal}) {

    const modalRef = useRef();

    const handleClick = e => {
        if(e.target === modalRef.current)
        {
            closeModal();
        }
    }

    return (
        <div className="modal" ref={modalRef} onClick={handleClick}>
            <div className="modal-content">
                <div className="modal-close" onClick={closeModal} >
                    <ClearIcon />
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;

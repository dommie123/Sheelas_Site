import React from "react";

import './modal.css';

export const Modal = (props) => {
    const style = props.style;
    const topContent = props.topContent;
    const centerContent = props.centerContent;
    const bottomContent = props.bottomContent;

    return (
        <div className="modal-container" style={style}>
            <div className="modal-content">
                <div className="modal-top-content">
                    {topContent}
                </div>
                <div className="modal-center-content">
                    {centerContent}
                </div>
                <div className="modal-bottom-content">
                    {bottomContent}
                </div>
            </div>
        </div>
    )
}
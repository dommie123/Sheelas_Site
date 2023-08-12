import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Snackbar, Alert } from "@mui/material";

import { removeFromMessageQueue } from "../../../slices/global-slice";
import { showError } from "../../../utils/error";
import { resetErrorMessage } from "../../../slices/login-slice";

export const SimplifiedSnackbar = (props) => {
    const [open, setOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState({})
    const loginError = useSelector(state => state.login.error);
    const messageQueue = useSelector(state => state.global.messageQueue);
    const dispatch = useDispatch();

    const handleClose = () => {
        setOpen(false);
        setCurrentMessage({});
        dispatch(removeFromMessageQueue());
    }

    useEffect(() => {
        if (loginError) {
            showError(loginError);
            dispatch(resetErrorMessage());
        }
    }, [loginError])

    useEffect(() => {
        if (!open && messageQueue.length > 0) {
            setOpen(true);
            setCurrentMessage(messageQueue[0]);
        }
    }, [messageQueue, open])

    return currentMessage ? (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={currentMessage.severity} sx={{ width: '100%' }}>
                {currentMessage.content}
            </Alert>
        </Snackbar>
    ) : <></>
}
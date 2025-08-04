import store from "../lib/store";
import { addToMessageQueue } from "../slices/global-slice";

const showError = (message, dispatch) => {
    if (!dispatch) {
        dispatch = store.dispatch;
    }

    dispatch(addToMessageQueue({ severity: "error", content: message }));
}

export { showError };
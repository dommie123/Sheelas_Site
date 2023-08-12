import store from "../lib/store";
import { addToMessageQueue } from "../slices/global-slice";

const showError = (message) => {
    const dispatch = store.dispatch;

    dispatch(addToMessageQueue({ severity: "error", content: message }));
    // alert(message);
}

export { showError };
import store from '../lib/store';
import { addToMessageQueue } from '../slices/global-slice';

const alertUser = (message) => {
    const dispatch = store.dispatch;

    dispatch(addToMessageQueue({ severity: 'success', message }));
}

export { alertUser };
export { filterReducer }

import { ActionTypes } from './actions.js';

function filterReducer(prevState, action) {
    if (action.type == ActionTypes.FILTER_ADDED) {
        return { 
            ...prevState, 
            [action.property]: action.value
        };
    }

    if (action.type == ActionTypes.FILTER_REMOVED) {
        let newFilter = { ...prevState };
        delete newFilter[action.property];
        return newFilter;
    }

    return prevState || {};
}
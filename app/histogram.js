export { histogramConfigReducer, histogramSelectedPropertyReducer };

import { ActionTypes, histogramConfigChanged, histogramPropertySelected } from './actions.js';

function histogramConfigReducer(prevState, action) {

    if (action.type == ActionTypes.HISTOGRAM_CONFIG_CHANGED) {
        return action.config || {};
    }

    return prevState || {};
}

function histogramSelectedPropertyReducer(prevState, action) {
    if (action.type == ActionTypes.HISTOGRAM_PROPERTY_SELECTED) {
        return action.property;
    }

    return prevState;
}
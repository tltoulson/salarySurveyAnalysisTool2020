export { responsesReducer };

import { ActionTypes } from './actions.js';
import { responses } from '../data/responses.js'

function responsesReducer(prevState, action) {
    if (action.type == ActionTypes.APP_LOADED) {
        return responses;
    }

    return prevState;
}
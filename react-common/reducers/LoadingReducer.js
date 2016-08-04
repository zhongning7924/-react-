'use strict'

import ActionTypes from '../constants/actiontypes.js';

const loading = (state={}, action) => {
    switch (action.type) {
        case ActionTypes.LOADING_START:
            return {
                loading: true,
            };
        case ActionTypes.LOADING_END:
            return {
                loading: false,
            };
        default:
            return state;
    }
};

export default loading;
'use strict'

import ActionTypes from '../constants/actiontypes.js';

const initState = {
    list: [],
    count: 0,
};

const resource = (state = initState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_RESOURCE_LIST:
            return Object.assign({}, state, {
                list: action.list,
                count: action.count,
            });
        case ActionTypes.SHOW_RESOURCE_MODAL:
            return {
                show: true,
                initData: action.initData,
            };
        case ActionTypes.HIDE_RESOURCE_MODAL:
            return {
                show: false,
                initData: {},
            };
        default:
            return state;
    }
}

export default resource;

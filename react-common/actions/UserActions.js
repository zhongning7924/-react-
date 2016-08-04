'use strict'

import ActionTypes from '../constants/actiontypes.js';
import Request from '../utils/request.js';
import Urls from '../constants/urls';
import Auth from '../utils/auth.js';
import { showPrompt } from './PromptActions.js';

export const updateUserInfo = userInfo => {
    return {
        type: ActionTypes.UPDATE_USER_INFO,
        isLogin: !!userInfo,
        userInfo: userInfo || {}
    }
}

export const userLogin = params => {
    return dispatch => {
        Request(dispatch).post(Urls.Login, params).done(function(data){
            Auth.login(data.user_info);
            dispatch( updateUserInfo(data.user_info) );
        });
    }
}

export const userLogout = () => {
    return dispatch => {
        Request(dispatch).post(Urls.Logout).done(function(data){
            Auth.logout();
            dispatch( updateUserInfo() )
        });
    }
}

export const changePassword = (params, promise) => {
    return dispatch => {
        Request(dispatch).post(Urls.ChangePassword, params).done(data => {
            dispatch( showPrompt('success', '密码修改成功！', promise) );
        });
    }
}


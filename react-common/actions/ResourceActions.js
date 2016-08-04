'use strict'

import ActionTypes from '../constants/actiontypes.js';

// 调用打开资源选中框，目前需要传一个初始化参数对象
// initData.dataType 要上传文件的类型，默认未空字符
// initData.urlList 业务逻辑中已经被选中的图片链接数组
// initData.limitNum 限制选择资源的个数。默认 -1 表示不做限制
// initData.promise 点击确定后的回调函数（data 为返回数据, data.list 为被选中的资源链接数组）
export const showResourceModal = (initData={dataType: '', limitNum:-1, urlList:[], promise:null}) => {
    return {
        type: ActionTypes.SHOW_RESOURCE_MODAL,
        initData: initData,
    }
}

export const hideResourceModal = () => {
    return {
        type: ActionTypes.HIDE_RESOURCE_MODAL,
    }
}

export const updateResourceList = (list, count) => {
    return {
        type: ActionTypes.UPDATE_RESOURCE_LIST,
        list: list,
        count: count,
    }
}

'use strict'

import React from 'react';
import ClassNames from 'classnames';
import { showPrompt } from 'public/actions/PromptActions.js';
import {connect} from 'react-redux';
import {hideResourceModal} from '../actions/ResourceActions.js';
import Resource from './resource/Resource.jsx';
import Modal from 'public/components/Modal.jsx';

let retList = [];
const mapStateToProps = (state) => {
    return state.resource;
}
// const mapDispathToProps = (dispatch) => {
//     return {
//         close: () => {
//             dispatch(hideResourceModal());
//         }

//     }
// }
const resourceModal =  React.createClass({
    propTypes:{
        // urlList: React.PropTypes.oneOfType([
        //   React.PropTypes.string,
        //   React.PropTypes.array,
        // ]),
    },
    getInitialState() {

        return {
        }
    },
    close() {
        this.props.dispatch(hideResourceModal());
    },
    //mode,提示类型如warning
    //msg，信息
    //promise 执行函数
     showPrompt(mode, msg, promise) {
        this.props.dispatch(showPrompt(mode, msg, promise));
    }, 
    onCancel() {
        //滚动条展示
        document.getElementsByTagName('body')[0].style.overflow="";
        retList = [];
        this.close();
    },
    onSubmit() {
        let limitNum = this.props.initData.limitNum;// 限制选择的资源数
        if(!limitNum || isNaN(limitNum)) {
            limitNum = -1;
        }
        // <=0 表示不限制个数
        if(limitNum <= 0 || retList.length === limitNum) {
            if (this.props.initData.promise) {
                // 返回给回调函数的数据
                let data = {
                    list: retList,
                };
                if (this.props.initData.promise.resolve) {
                    this.props.initData.promise.resolve(data);
                } else if ( typeof this.props.initData.promise === 'function') {
                    // promise 是一个callback
                    this.props.initData.promise(data);
                }
            }
            retList = [];
            this.close();
        } else {
            // 提示超出限制数量
             let msg = `选择文件数量不匹配，只能选择【${this.props.initData.limitNum }】个【${this.props.initData.dataType}】类型文件`;
             if(this.props.initData.dataType===null || this.props.initData.dataType===''){
                msg=`选择文件数量不匹配，只能选择【${this.props.initData.limitNum }】个文件`;
             }
             this.showPrompt('error',msg,null);  
        }
    },
    setModalList(list) {
        retList = list;
    },
    render() {
        let {show, initData} = this.props;
        let newList = [];
        if(initData && initData.urlList) {
            let urlList = initData.urlList;
            if( (typeof urlList === 'string') ) {
                newList = [urlList+''];
            } else if(urlList.length > 0) {
                for (var i = 0; i < urlList.length; i++) {
                    if(urlList[i] != '') {
                        newList.push(urlList[i]+'');
                    }
                }
            }
            initData.urlList = newList;
        }

        return (
            <div className='ResourceModal'>
                <Modal show={show}
                    title='资源选择'
                    large
                    submitHandler={this.onSubmit}
                    cancelHandler={this.onCancel}>
                    <Resource initData={this.props.initData} setModalList={this.setModalList}> </Resource>
                </Modal>
            </div>
        );
    }
});

export default connect(mapStateToProps)(resourceModal);

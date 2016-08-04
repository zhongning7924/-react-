'use strict'

import '../styles/modal.css';

import React from 'react';
import ClassNames from 'classnames';

export default React.createClass({
    propTopes: {
        // 是否显示
        show: React.PropTypes.bool.isRequired,
        // 标题
        title: React.PropTypes.node.isRequired,
        // 确定按钮callback
        submitHandler: React.PropTypes.func.isRequired,
        // 取消按钮Handler
        cancelHandler: React.PropTypes.func,
        // 确定按钮文字
        submitText: React.PropTypes.string,
        // 取消按钮文字
        cancelText: React.PropTypes.string,
        // 是否禁用确定按钮
        submitDisabled: React.PropTypes.bool,
        // 是否禁用取消按钮
        cancelDisabled: React.PropTypes.bool,
        // 不显示取消按钮
        cancelHiden: React.PropTypes.bool,
        submitHiden: React.PropTypes.bool,
        // 使用较大尺寸
        large: React.PropTypes.bool,
        // 使用较小尺寸
        small: React.PropTypes.bool
    },
    onSubmit() {
        if (!this.props.submitDisabled) {
            this.props.submitHandler();
        }
    },
    onCancel() {
        if (this.props.cancelDisabled) {
            return;
        }
        if (this.props.cancelHandler) {
            this.props.cancelHandler();
        } else {
            // TODO is it possible that self close ？
        }
    },
    onClose() {
        if (this.props.cancelHandler) {
            this.props.cancelHandler();
        } else {
            this.props.submitHandler();
        }
    },
    render: function () {
        let {show, title, 
            submitHandler, cancelHandler, 
            submitText, cancelText, 
            submitDisabled, cancelDisabled,
            cancelHiden,
            submitHiden,
            large, small} = this.props;
        submitText = submitText || '确定';
        cancelText = cancelText || '取消';
        if (show) {
            return (
                <div className={ClassNames('modal-wrapper', {'hide': !show})}>
                    <div className={ClassNames('modal-backdrop fade', {'in': show})}></div>
                    <div className={ClassNames('modal fade', {'in': show, 'show': show})} role='dialog'>
                        <div className={ClassNames('modal-dialog', {'modal-lg': large, 'modal-sm': small})} role='document'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <button type='button' onClick={this.onClose}
                                        className='close'><span>&times;</span></button>
                                    <h4 className='modal-title'>{title}</h4>
                                </div>
                                <div className='modal-body'>
                                    {this.props.children}
                                </div>
                                <div className='modal-footer'>
                                    {!cancelHiden && (<button type='button' 
                                        className={ClassNames('btn btn-default', {'disabled': cancelDisabled})}
                                        onClick={this.onCancel}>{cancelText}</button>)}
                                    {!submitHiden && (<button type='button' 
                                        className={ClassNames('btn btn-primary', {'disabled': submitDisabled})}
                                        onClick={this.onSubmit}>{submitText}</button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
        } else {
            return null;
        }
    }
});
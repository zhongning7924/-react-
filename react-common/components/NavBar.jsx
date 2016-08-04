'use strict'

import '../styles/navbar.css';

import React from 'react';
import {History} from 'react-router';
import ClassNames from 'classnames';
import $ from 'jquery';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import LogoImg from '../images/logo@2x.png';
import Modal from './Modal.jsx';
import Urls from '../constants/urls.js';

import { connect } from 'react-redux';
import { userLogout, changePassword } from '../actions/UserActions.js';
import { showPrompt } from '../actions/PromptActions.js';

const mapStateToProps = (state) => {
    return {
        isLogin: state.user.isLogin,
        userInfo: state.user.userInfo
    }
}
const mapDispathToProps = (dispatch) => {
    return {
        onUserLogout: () => {
            dispatch( userLogout() );
        },
        onShowPrompt: (mode, msg, promise) => {
            dispatch(showPrompt(mode, msg, promise));
        },
        onChangePassword: (params, promise) => {
            dispatch( changePassword(params, promise) )
        }
    }
}

// 登录校验在此模块进行

const navbar = React.createClass({
    mixins: [
        History,
        LinkedStateMixin
    ],
    getInitialState() {
        return {
            user_name: '',
            user_id: '',
            showDropDown: false,
            showChangePassword: false,
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: '',
        }
    },
    toLogin() {
        // 跳转到登录页面
        this.history.pushState(null, '/login');
    },
    toIndex() {
        // 回到admin应用后台首页
        window.location.href = Urls.ToIndex;
    },
    checkLogin(props) {
        if (props.isLogin) {
            this.setState({
                user_name: props.userInfo.nick_name,
                user_id: props.userInfo.user_id
            });
        } else {
            this.toLogin();
        }
    },
    componentDidMount() {
        this.checkLogin(this.props);
    },
    componentWillReceiveProps(newProps) {
        this.checkLogin(newProps);
    },
    // 【设置】按钮下拉菜单
    changeDropDown(isOpen) {
        this.setState({
            showDropDown: isOpen
        }, () => {
            if (isOpen) {
                $(document).one('click', this.closeDropDown)
            }
        })
    },
    closeDropDown(e) {
        this.changeDropDown(false);
    },
    // 点击【设置】按钮
    toggleDropDown(e) {
        e.preventDefault();
        this.changeDropDown(!this.state.showDropDown);
    },
    // 点击修改密码
    changePassword(e) {
        e.preventDefault();
        this.setState({
            showChangePassword: true,
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: ''
        });
    },
    changePasswordValid() {
        if (!this.state.oldPassword
            || !this.state.newPassword
            || !this.state.newPasswordRepeat) {
            return false;
        }
        if (this.state.newPassword !== this.state.newPasswordRepeat) {
            return false;
        }
        if (this.state.newPassword.length < 6 || this.state.newPasswordRepeat.length < 6) {
            return false;
        }
        return true;
    },
    onChangePasswordSubmit() {
        // jquery way
        // let dfd = $.Deferred();
        // dfd.done(() => {
        //     this.setState({
        //         showChangePassword: false
        //     })
        // })
        // ES6 way
        let dfd = {};
        let promise = new Promise(resolve => dfd.resolve = resolve)
        promise.then(() => {
            this.setState({
                showChangePassword: false
            })
        });
        this.props.onChangePassword({
            user_id: this.state.user_id,
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            re_new_password: this.state.newPasswordRepeat
        }, dfd);
    },
    onChangePasswordCancel() {
        this.setState({
            showChangePassword: false
        })
    },
    // 点击回到首页
    backToIndex(e) {
        e.preventDefault();
        this.toIndex();
    },
    // 点击退出登录
    logout(e) {
        e.preventDefault();
        // this is ES6 way
        let deferred = {};
        let promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
        });
        // for jquery way, use this:
        // let deferred = $.Deferred();
        // deferred.done(UserActions.logout)
        this.props.onShowPrompt('warning', '确定退出登录吗？', deferred);
        promise.then(this.props.onUserLogout);
    },
    render() {
        return (
            <nav className='navbar navbar-inverse navbar-fixed-top' role='navigation'>
                <div className='container-fluid'>
                    <div className='navbar-header'>
                        <a className='navbar-brand' href='#'>
                            <img className='navbar-logo' src={LogoImg} alt='brand'/>
                            {this.props.systemName}
                        </a>
                    </div>
                    <ul className='nav navbar-nav navbar-right'>
                        <li><a>{this.state.user_name}</a></li>
                        <li><a href='#' onClick={this.toggleDropDown} title='设置'>
                            <i className='glyphicon glyphicon-cog'></i>
                            </a>
                            <ul className={ClassNames('dropdown-menu', {'show': this.state.showDropDown})}
                                onClick={e => e.stopPropagation()}>
                                <li><a href='#' onClick={this.changePassword}>
                                    修改密码
                                    <i className='glyphicon glyphicon-pencil'></i>
                                    </a>
                                </li>
                                <li><a href='#' onClick={this.logout}>
                                    退出登录
                                    <i className='glyphicon glyphicon-log-out'></i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li><a href='#' onClick={this.backToIndex} 
                            title='回到首页'>
                            <i className='glyphicon glyphicon-home'></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <Modal title='修改密码'
                    show={this.state.showChangePassword}
                    submitHandler={this.onChangePasswordSubmit}
                    cancelHandler={this.onChangePasswordCancel}
                    submitDisabled={!this.changePasswordValid()}>
                    <form className='form-horizontal changePassword-form'>
                        <div className='form-group'>
                            <label className='col-xs-3'>旧密码：</label>
                            <div className='col-xs-9'>
                                <input type='password'
                                    valueLink={this.linkState('oldPassword')} 
                                    className='form-control' 
                                    placeholder='请输入旧密码' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='col-xs-3'>新密码：</label>
                            <div className='col-xs-9'>
                                <input type='password'
                                    valueLink={this.linkState('newPassword')} 
                                    className='form-control' 
                                    placeholder='至少输入6位' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='col-xs-3'>重复新密码：</label>
                            <div className='col-xs-9'>
                                <input type='password'
                                    valueLink={this.linkState('newPasswordRepeat')} 
                                    className='form-control' 
                                    placeholder='至少输入6位' />
                            </div>
                        </div>
                    </form>
                </Modal>
            </nav>
        );
    }
});
export default connect(mapStateToProps,mapDispathToProps)(navbar);

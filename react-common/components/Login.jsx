'use strict'

import '../styles/login.css';

import React from 'react';
import ClassNames from 'classnames';
import {History} from 'react-router';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import Loading from './Loading.jsx';
import Prompt from './Prompt.jsx';

import { connect } from 'react-redux';
import { userLogin } from '../actions/UserActions.js';

const mapStateToProps = (state) => {
    return {
        isLogin: state.user.isLogin,
        // userInfo: state.user.userInfo
    }
}
const mapDispathToProps = (dispatch) => {
    return {
        onUserLogin: (params) => {
            dispatch( userLogin(params) );
        },
    }
}

const login = React.createClass({
    mixins: [
        History,
        LinkedStateMixin],
    getInitialState() {
        return {
            submitValid: false,
            username: '',
            password: ''
        };
    },
    componentWillReceiveProps(newProps) {
        if (newProps.isLogin) {
            this.history.pushState(null, '/');
        }
    },
    submit(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.props.onUserLogin({
                user_name: this.state.username,
                password: this.state.password
            });
        }
    },
    isValid() {
        return this.state.username && this.state.password;
    },
    render() {
        let btnClassName = ClassNames('btn btn-success', {
            'disabled': !this.isValid()
        });
        return (
            <div className='login-background'>
                <div className='login-wrapper'>
                    <h3>登录</h3>
                    <form className='form-horizontal'>
                        <div className='form-group'>
                            <label className='col-xs-3'>用户名：</label>
                            <div className='col-xs-9'>
                                <input type='text'
                                    valueLink={this.linkState('username')} 
                                    className='form-control' 
                                    placeholder='请输入用户名' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='col-xs-3'>密码：</label>
                            <div className='col-xs-9'>
                                <input type='password'
                                    valueLink={this.linkState('password')} 
                                    className='form-control' 
                                    placeholder='请输入密码' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='col-xs-9 col-xs-offset-3'>
                                <button type='submit' 
                                    className={btnClassName} 
                                    onClick={this.submit}>确定</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Prompt />
                <Loading />
            </div>
        );
    }
});

export default connect(mapStateToProps,mapDispathToProps)(login);
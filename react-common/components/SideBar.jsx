'use strict'

import '../styles/sidebar.css';

import React from 'react'
import {Link} from 'react-router';
import ClassNames from 'classnames';

import Urls from '../constants/urls';
import Request from '../utils/request.js';

import { connect } from 'react-redux';
import { userLogout, changePassword } from '../actions/UserActions.js';
import { showPrompt } from '../actions/PromptActions.js';

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo
    }
}

// 侧栏导航 - 支持1级和2级导航
// lv1: {title: '', path: ''}
// lv2: {title: '', navs: []}
// navs: {title: '', path: ''}

const Item = React.createClass({
    render() {
        let nav = this.props.nav;
        return (<li className={ClassNames('nav-sidebar-item', {'active': this.props.active })}>
            { nav.open ? 
                <a href={nav.open} target='_blank'>{nav.title}</a> : 
              nav.replace ?
                <a href={nav.replace}>{nav.title}</a> : 
                <Link to={nav.path}>{nav.title}</Link>
            }
        </li>)
    }
});

const sidebar = React.createClass({
    propTypes: {
        // 当前pathname
        current: React.PropTypes.string.isRequired,
        // 导航配置
        navInfo: React.PropTypes.array.isRequired
    },
    getInitialState() {
        return {
            collapsed: [],
            auth_path_list: [],
            auth_path: false,
        }
    },
    componentDidMount() {
        if ( typeof disablepathauth !== 'undefined' && disablepathauth) {
            return;
        }
        this.getUserPathList();
    },
    getUserPathList() {
        let dispatch = this.props.dispatch;
        let role_id = this.props.userInfo.role_id;
        Request(dispatch).post(Urls.getUserSystem, {
            role_id: role_id
        }).done(data => {
            // systemname 由 webpack 注入
            let system = data.filter(system => system.system_en_name == systemname)[0];
            if (!system) {
                this.props.dispatch(showPrompt('info', '无此系统权限, 请联系管理员！', () => {
                    // 回到admin应用后台首页
                    window.location.href = Urls.ToIndex;
                }));
                return;
            }
            let system_id = system.system_id;
            Request(dispatch).post(Urls.getUserSystemPage, {
                role_id: role_id,
                system_id: system_id
            }).done(data => {
                this.setState({
                    auth_path: true,
                    auth_path_list: data.map(page => page.description)
                })
            })
        })
    },
    collapse(idx, e) {
        e.preventDefault();
        let collapsed = this.state.collapsed;
        let index = collapsed.indexOf(idx);
        if (index >= 0) {
            collapsed.splice(index, 1);
        } else {
            collapsed.push(idx);
        }
        this.setState({
            collapsed: collapsed
        });
    },
    filterNavInfo(navInfo, auth_path_list) {
        let newNavInfo = navInfo.slice();
        // level 2
        newNavInfo.forEach(nav => {
            if (!nav.path) {
                nav.navs = nav.navs.filter(nav => {
                    return auth_path_list.indexOf(nav.path) >= 0;
                })
            }
        })
        // level 1
        newNavInfo = newNavInfo.filter(nav => {
            if (nav.path == '/index') {
                return true;
            }
            if (nav.path && auth_path_list.indexOf(nav.path) < 0) {
                return false;
            }
            if (nav.navs && !nav.navs.length) {
                return false;
            }
            return true;
        });
        return newNavInfo;
    },
    render() {
        let navInfo = this.state.auth_path ? 
            this.filterNavInfo(this.props.navInfo, this.state.auth_path_list)
            : this.props.navInfo;
        let pathname = this.props.current;
        // NOTE::通过pathname判断active状态，没有使用react-router Link 的 activeClassName
        // because：/xxx/:id形式的path依然要与/xxx一样active相应的item
        return ( 
            <ul className="nav-sidebar">
            {navInfo.map((group, idx) => {
                return group.path ? 
                // 单级导航
                (<Item key={idx} nav={group} active={new RegExp(`\^${group.path}\\b`).test(pathname)} />)
                :
                // 二级导航
                (<li key={idx} className={ClassNames('group',{
                    'collapsed': this.state.collapsed.indexOf(idx) >= 0,
                    'actived': group.navs.filter(nav => new RegExp(`\^${nav.path}\\b`).test(pathname)).length
                })}>
                    <a href='#' onClick={this.collapse.bind(this, idx)}>{group.title}</a>
                    <ul>
                    {group.navs.map((nav, idx) => 
                        (<Item key={nav.path} nav={nav} active={new RegExp(`\^${nav.path}\\b`).test(pathname)} />)
                    )}
                    </ul>
                </li>)
            })}
            </ul>
        );
    }
});
export default connect(mapStateToProps)(sidebar);
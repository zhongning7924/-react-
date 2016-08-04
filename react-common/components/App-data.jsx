
//项目需要一个全局的查询条件，单独写一个入口
'use strict'

import '../styles/app.css';

import React from 'react';
import ClassNames from 'classnames';
import {Link, Lifecycle} from 'react-router';

import NavBar from './NavBar.jsx';
import SideBar from './SideBar.jsx';
import TabNav from './TabNav.jsx';
import Loading from './Loading.jsx';
import ScrollTop from './ScrollTop.jsx';
import Prompt from './Prompt.jsx';
import Searchinfo from './Searchinfo.jsx';
import AppTabsNavMixin from '../mixins/AppTabsNavMixin.js';

export default React.createClass({
    mixins: [
        AppTabsNavMixin,
    ],
    getInitialState() {
        return {
            navTabs: [],
        }
    },
    componentDidMount() {
        // NavTabsActions.getStorage();
        // console.log("app did mount", this.props);
      
    },
    render() {

        return (
            <div className="container-fluid app-wrapper">
                <NavBar systemName={systemnamecn}/>
                <div className="row">
                    <div className="col-xs-2 sidebar-wrapper">
                        <SideBar current={this.props.location.pathname}
                            navInfo={this.props.route.navigations}/>
                    </div>
                    <div className="col-xs-10 col-xs-offset-2 main-wrapper">
                        <Searchinfo />
                        <div className="tabs-nav-wrapper">
                            <TabNav navInfo={this.state.navTabs} closeHandler={this.closeTab}/>
                        </div>
                        <div className="content-wrapper clearfix">
                            {React.Children.map(this.props.children, child => 
                                React.cloneElement(child, {
                                    openTab: this.openTab,
                                    setTabTitle: this.setTabTitle,
                                    closeTab: this.closeTab,
                                    getTabs: this.getTabs,
                                })
                            )}
                        </div>
                    </div>
                </div>
                <Loading />
                <Prompt />
                <ScrollTop />
            </div>
        );
    }
});
'use strict'

import '../styles/tabnav.css';

import React from 'react';
import {Link} from 'react-router';

// tab 导航栏

export default React.createClass({
    propTypes: {
        // 导航信息
        navInfo: React.PropTypes.array.isRequired,
        // 关闭callback
        closeHandler: React.PropTypes.func.isRequired
    },
    handleClose(path, e) {
        e.preventDefault();
        this.props.closeHandler(path);
    },
    render(){
        return (
            <ul className="nav nav-tabs nav-tabs-bar">
            {this.props.navInfo.map((nav,idx) => 
                (<li key={idx} className={nav.active ? "active" : ""}>
                    <Link to={nav.path}>
                        {nav.title}
                        <i className="tab-close" onClick={this.handleClose.bind(this, nav.path)}></i>
                    </Link>
                </li>)
            )}
            </ul>
        );
    }
});
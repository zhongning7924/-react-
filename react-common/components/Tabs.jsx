'use strict'

import '../styles/tabs.css';

import React from 'react';
import ClassNames from 'classnames';

// 标签元素
let Tab = React.createClass({
    click(e) {
        e.preventDefault();
        this.props.selectIndex();
    },
    render() {
        return (
            <li className={ClassNames('',{
                active: this.props.active
            })}><a href='#' onClick={this.click}>{this.props.children}</a></li>
        )
    }
});

// 标签容器
let TabList = React.createClass({
    selectIndex(index) {
        this.props.onSelect(index);
    },
    render() {
        return (
            <ul className='nav nav-tabs'>
                {React.Children.map(this.props.children, (child, index) => 
                    child ? React.cloneElement(child, {
                        active: this.props.selectedIndex === index,
                        selectIndex: this.selectIndex.bind(this, index)
                    }): child
                )}
            </ul>
        );
    }
});

// 内容容器
let TabPanel = React.createClass({
    render() {
        return this.props.show ? (
            <div>
                {this.props.children}
            </div>
        ) : null
    }
});

// 外部容器
let Tabs = React.createClass({
    propTypes: {
        selectedIndex: React.PropTypes.number,
        onSelect: React.PropTypes.func,
    },
    render() {
        return (
            <div className='tabs'>
                {React.Children.map(this.props.children, (child, index) => 
                    index === 0 ?
                    React.cloneElement(child, {
                        selectedIndex: this.props.selectedIndex,
                        onSelect: this.props.onSelect
                    }) :
                    child ? React.cloneElement(child, {
                        show: this.props.selectedIndex === index - 1
                    }) : child
                )}
            </div>
        )
    }
});

export {Tabs, TabList, Tab, TabPanel};
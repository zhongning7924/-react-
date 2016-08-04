'use strict'

import '../styles/scroll-top.css';

import React from 'react';
import $ from 'jquery';
import ClassNames from 'classnames';

// 回到顶部按钮

export default React.createClass({
    getInitialState: function() {
        return {
            shown: false
        }
    },
    componentDidMount: function () {
        $(window).on('scroll', this.handleScroll);
    },
    componentWillUnmount: function() {
        $(window).off('scroll', this.handleScroll);
    },
    handleScroll: function () {
        this.setState({
            shown: $(window).scrollTop() > 100
        });
    },
    handleClick: function () {
        $('html,body').animate({
            scrollTop: 0
        }, 500);
    },
    render: function () {
        var className = ClassNames("scroll-top-handler", {
            'hiden': !this.state.shown
        });
        return (
            <div onClick={this.handleClick} className={className}></div>
        );
    }
});
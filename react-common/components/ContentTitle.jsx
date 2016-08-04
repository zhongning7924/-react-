'use strict'

import '../styles/content-title.css'

import React from 'react'

export default React.createClass({
    propTypes: {
        // 标题
        title: React.PropTypes.node
    },
    render() {
        return (
            <h4 className='content-title'>{this.props.title}</h4>
        )
    }
})
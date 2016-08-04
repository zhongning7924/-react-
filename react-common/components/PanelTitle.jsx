'use strict'

import React from 'react'

export default React.createClass({
    propTypes: {
        // 标题
        title: React.PropTypes.node.isRequired
    },
    render() {
        return (
            <div className='panel panel-primary'>
                <div className='panel-heading'>
                    <h3 className='panel-title'>{this.props.title}</h3>
                </div>
                <div className='panel-body'>
                    {this.props.children}
                </div>
            </div>
        )
    }
})
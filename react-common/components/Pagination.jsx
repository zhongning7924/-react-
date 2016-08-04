'use strict'

import '../styles/pagination.css'

import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ClassNames from 'classnames';

const Item = React.createClass({
    render() {
        let {num, handler, active, disabled} = this.props;
        let className = ClassNames({'active': active, 'disabled': disabled});
        return (
            <li className={className}><a href='#' onClick={handler}>{num}</a></li>
        )
    }
})

export default React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        // 起始显示数量
        head: React.PropTypes.number,
        // 末尾显示数量
        end: React.PropTypes.number,
        // 当前页前面显示数量
        previous: React.PropTypes.number,
        // 当前页后面显示数量
        next: React.PropTypes.number,
        // 总页数
        count: React.PropTypes.number.isRequired,
        // 当前页
        current: React.PropTypes.number.isRequired,
        // 排序回调
        handler: React.PropTypes.func.isRequired,
    },
    getInitialState() {
        return {
            inputNum: 1
        }
    },
    componentWillReceiveProps(nextPorps) {
        if (nextPorps.current > nextPorps.count) {
            this.toPage(nextPorps.count);
        }
    },
    toPage(num) {
        let {current, count} = this.props;
        let next = 0;
        switch (num) {
            case 'prev':
                next = current - 1;
                break;
            case 'next':
                next = current + 1;
                break;
            default:
                next = num; 
                break;
        }
        if (next < 1 || next > count) {
            return;
        }
        this.props.handler(next);
    },
    onClick(num, e) {
        e.preventDefault();
        this.toPage(num);
    },
    onEnter(num, e) {
        if (e.which === 13) {
            this.toPage(num);
        }
    },
    render() {
        let {current, count, head, previous, next, end} = this.props;
        // 默认值
        head = head || 2;
        previous = previous || 2;
        next = next || 2;
        end = end || 1;

        current = Math.min(current, count);
        current = Math.max(current, 1);

        // 是否左侧truncate
        let leftEllipsis = current - previous - head > 1;
        // 是否右侧truncate
        let rigthEllipsis = count - end - (current + next) > 1;

        let pages = [];
        for (let i = 1; i <= count; i++) { 
            if (leftEllipsis && i > head && (i < current - previous) ) {
                continue;
            }
            if (rigthEllipsis && (i < count - end) && (i > current + next) ) {
                continue;
            }
            pages.push(<Item 
                key={i} num={i} 
                active={i === current} disabled={false}
                handler={this.onClick.bind(this, i)} />);
        }
        // 左侧truncate
        if (leftEllipsis) {
            pages.splice(head, 0, (<li key='leftEllipsis' className='disabled'><span>. . .</span></li>) )
        }
        // 右侧truncate
        if (rigthEllipsis) {
            pages.splice(pages.length - 2, 0, (<li key='rigthEllipsis' className='disabled'><span>. . .</span></li>) )
        }
        // 上一页
        pages.unshift(<Item key='prev' num='上一页' 
            active={false} disabled={current === 1}
            handler={this.onClick.bind(this, 'prev')} />);
        // 下一页
        pages.push(<Item key='next' num='下一页' 
            active={false} disabled={current === count}
            handler={this.onClick.bind(this, 'next')} />);

        return (
            <nav className='pagination-wrapper'>
                <div>
                    <ul className='pagination'>
                        {pages}
                    </ul>
                    <div className='pagination-info'>
                        <span>共{count}页，到第</span>
                        <input className="form-control" type='number'  min='1' max={count}
                            onKeyPress={this.onEnter.bind(this, this.state.inputNum)}
                            valueLink={this.linkState('inputNum')} />
                        <span>页</span>
                        <button className='btn btn-sm btn-default'
                            onClick={this.onClick.bind(this, +this.state.inputNum)}>确定</button>
                    </div>
                </div>
            </nav>
        )
    }
});
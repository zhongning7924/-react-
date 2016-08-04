'use strict'

import '../styles/data-table.css';

import React from 'react';
import ClassNames from 'classnames';
import Pagination from './Pagination.jsx';

const defaultPageOptions = [5,10, 25, 50, 100];

export default React.createClass({
    propTypes: {
        // string or node
        info: React.PropTypes.node,
        // th infos: {name: 'xxx', sortKey: 'name',}
        headers: React.PropTypes.array.isRequired,
        // {'name': 'asc', 'update_time': 'desc'}
        sortby: React.PropTypes.object,
        // accept sortKey as param
        sortHandler: React.PropTypes.func,
        // extra class name for table
        extraClasses: React.PropTypes.string,
        // replace class name for table
        replaceClasses: React.PropTypes.string,
        // items count
        count: React.PropTypes.number,
        // per page count
        perpage: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
        ]),
        // customized page sizes
        pageSizeOptions: React.PropTypes.array,
        disablePagination: React.PropTypes.bool,
    },
    handleClick(sortKey) {
        if (!sortKey) {
            return;
        }
        this.props.sortHandler(sortKey);
    },
    changePageSize(e) {
        let size = e.target.value;
        if (size !== this.props.perpage) {
            this.props.pageSizeHandler(size);
        }
    },
    render() {
        let {info, headers, sortby, extraClasses, replaceClasses, disablePagination,
                count, perpage, pageSizeOptions, currentPage, onChangePage} = this.props;
        let className = 'table table-data-table';
        if (extraClasses) {
            className = className + ' ' + extraClasses;
        }
        if (replaceClasses) {
            className = replaceClasses;
        }
        sortby = sortby || {};
        pageSizeOptions = pageSizeOptions || defaultPageOptions;
        if (pageSizeOptions.indexOf(+perpage) < 0) {
            perpage = pageSizeOptions[0]
        }
        let pageCount = Math.ceil(count / perpage);
        return (
            <div>
                {count ?
                (<div className='data-table-header clearfix'>
                    {info ? info : 
                        <span className='count'>
                            总共 
                            <strong>{count}</strong>
                            条
                        </span>
                    }
                    <span className={ClassNames('perpage', {hide: disablePagination})}>
                        每页显示
                        <select className='form-control' value={perpage} onChange={this.changePageSize}>
                            {pageSizeOptions.map(option => 
                                (<option key={option} value={option}>{option}</option>)
                            )}
                        </select>
                        条
                    </span>
                </div>) : ''
                }
                <div className="table-content">
                    <table className={className}>
                        <thead>
                            <tr>
                            {headers.map( (th, idx) => {
                                let cname = ClassNames(th.className, {
                                    'sortable': !!th.sortKey,
                                    'asc': /^asc$/i.test(sortby[th.sortKey]),
                                    'desc': /^desc$/i.test(sortby[th.sortKey])
                                });
                                return (<th className={cname} key={idx}
                                     onClick={this.handleClick.bind(this, th.sortKey)}
                                     >{th.name}</th>)
                            })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
                {!!pageCount && 
                (<Pagination count={pageCount} current={currentPage} handler={onChangePage}/>)
                }
            </div>
        )
    }
})
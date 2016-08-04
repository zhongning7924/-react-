'use strict'


import React from 'react';

import DataTable from 'public/components/DataTable.jsx';
import ClassNames from 'classnames';

export default React.createClass({
    propTopes: {
        // 加入到购物车的列表
        list: React.PropTypes.bool.isRequired,
    },
    handleChange(item, e) {
        item.isSelected = e.target.checked;
        // 更新界面
        this.setState({
        });
    },
    render: function () {
        let {list} = this.props;
        let tableHeaders = [
            {name: ''},
            {name: '资源地址'},
            {name: '预览'},
        ];
        return (<DataTable headers={tableHeaders}
            extraClasses='table-striped table-bordered table-hover'>
            {list.map((item, idx) =>
                (<tr key={idx} >
                    <td>
                        <input type='checkbox' checked={item.isSelected} onChange={this.handleChange.bind(this, item)}></input>
                    </td>
                    <td>{item.file_name}</td>
                    <td><a href={item.file_name} target='_blank'>{this.props.dealSrc(item.file_name)}</a></td>

                </tr>)
            )}
        </DataTable>);
    }
});

'use strict'

import '../../styles/resource.css'

import React from 'react';
import ClassNames from 'classnames';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
// import TabsNavMixin from 'public/mixins/ModuleTabsNavMixin.js';
import PanelTitle from 'public/components/PanelTitle.jsx';
import DataTable from 'public/components/DataTable.jsx';
import Modal from 'public/components/Modal.jsx';

import Urls from 'public/constants/urls';
import Request from 'public/utils/request.js';

import { connect } from 'react-redux';
import { showPrompt } from 'public/actions/PromptActions.js';
import {updateResourceList} from 'public/actions/ResourceActions.js';
import Detail from './Detail.jsx';
import SelectedList from './SelectedList.jsx';

const mapStateToProps = (state) => {
    return {
        count: state.resource.count,
        list: state.resource.list,
    }
}

const resource = React.createClass({
    mixins: [ LinkedStateMixin],

    getInitialState() {
        let seList = [];
        if(this.props.initData) {
            let list = this.props.initData.urlList;
            if(list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    let o = list[i];
                    seList.push({
                        file_name: o,
                        isSelected: true
                    });
                }
                if(this.props.setModalList) {
                    this.props.setModalList(list);
                }
            }
        }

        return {
            tabTitle: '资源列表',
            searchName: '',
            startTime: '',
            endTime: '',
            getGroup: 0,
            page: 1,
            pageSize: 5,
            // pageSize: 4,

            selectNum: seList.length,
            selectedList: seList,

        }
    },
    setModalList(){
        if(this.props.setModalList) {
            let list = [];
            for (let i = 0; i < this.state.selectedList.length; i++) {
                let o = this.state.selectedList[i];
                if(o.isSelected == true) {
                    list.push(o.file_name);
                }
            }
            this.props.setModalList(list);
        }
    },
    getTrueNum(){
        let list = [];
        for (let i = 0; i < this.state.selectedList.length; i++) {
            let o = this.state.selectedList[i];
            if(o.isSelected == true) {
                list.push(o.file_name);
            }
        }
        return list.length;
    },
    //获取资源数据
    getData() {
        let reqData={
            page: this.state.page,
            page_size: this.state.pageSize,

            file_name: this.state.searchName,//文件名
            get_group: this.state.getGroup,// 是否取角色组的所有资源 默认自己0  1同组 取当前用户所属组的资源
            start_time: this.state.startTime,
            end_time: this.state.endTime,//文件名

        };
        let dataType = this.props.initData.dataType;
        if (dataType.length>0) {
            reqData['extension'] =dataType;
        }
        Request(this.props.dispatch).post(Urls.getResourceList, reqData).done(data => {
            // 遍历，然后判断这条数据有没有被选中
            if(data.list && data.list.length > 0) {
                for (let i = 0; i < data.list.length; i++) {
                    let d = data.list[i];
                    for (let k = 0; k < this.state.selectedList.length; k++) {
                        var s = this.state.selectedList[k];
                        if(s.isSelected == true && s.file_name.indexOf(d.file_name) >= 0) {
                            d.selected = true;
                            break;
                        }
                    }
                }
            }
            this.props.dispatch(updateResourceList(data.list, +data.count));
        });
    },
    search() {
        // 点击搜索时，默认跳转到第一页
        this.state.page = 1;
        this.getData();
    },

    componentDidMount() {
        this.getData();
    },
    showPrompt(mode, msg, promise) {
        this.props.dispatch(showPrompt(mode, msg, promise));
    },
    updateImg(json, callback){
        Request(this.props.dispatch).upload(Urls.resourceUpload,
            json
        ).done((data) => {
            if(callback) callback(data);
            this.getData();

            // 将新增的图片都放到购物车
            // let list = this.state.selectedList;
            // if(data && data.list && data.list.length >0) {
            //     for (let i = 0; i < data.list.length; i++) {
            //         let o = data.list[i];
            //         list.push({
            //             file_name:o.file_name,
            //             isSelected: true
            //         });
            //     }
            // }
            // this.setState({
            //     selectedList: list,
            //     selectNum: list.length,
            // });

        });
    },
    // 切换每页显示条数
    onChangePageSize(num) {
        this.setState({
            pageSize: num,
            page: 1
        }, ()=> {
            this.getData()
        })
    },
    // 换页
    onChangePage(num) {
        this.setState({
            page: num
        }, () => {
            this.getData()
        })
    },
    add() {
        this.setState({
            showModal: true,
        });
    },
    // 选择按钮响应，加入购物车
    select(item, e) {
        // let v = e.target.dataset.src;
        let v = item.file_name;
        item.selected = e.target.checked;//设置页面选中状态

        let has = false;
        let checkList = this.state.selectedList;
        for (var i = 0; i < checkList.length; i++) {
            var o = checkList[i];
            if(o.file_name.indexOf(v) >= 0) {
                has = true;
                checkList[i].isSelected = e.target.checked;
            }
        }
        if(!has) {
            checkList.push({
                file_name:v,
                isSelected: true
            });
        }
        this.setState({
            selectNum: checkList.length,
            selectedList: checkList,
        });
        // 更新 Modal 数据
        this.setModalList();
    },

    openCart() {
        this.setState({
            showSelectModal:true,
            // selectedList: this.state.selectedList,
        });
    },
    onSelectModalSubmit() {
        this.setState({
            showSelectModal:false,
        });

        // 遍历，然后判断这条数据有没有被选中,更新本页面列表选中状态
        let list = this.props.list;
        let slist = this.state.selectedList;
        if(list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let d = list[i];
                for (let k = 0; k < slist.length; k++) {
                    var s = slist[k];
                    if(s.file_name.indexOf(d.file_name) >= 0) {
                        d.selected = s.isSelected;
                        break;
                    }
                }
            }
        }

        // 更新 Modal 数据
        this.setModalList();
    },
    closeCartModal(){
        this.setState({
            showModal:false,
        });

        // 更新 Modal 数据
        this.setModalList();
    },
    getFileSize(filesize) {
        let size = Number(filesize);
        if (size) {
            size= (size/(1024*1024)).toFixed(2);
            if(size>0){
                size = String(size) + 'MB';
                return size
            }
            else {
                size= (filesize/1024).toFixed(2);
                size = String(size) + 'KB';
                return size
            }
        }
    },
    // 处理传过来的链接，图片则返回 img，其他的则返回 font icon
    dealSrc(link) {
        let ret = <span className="glyphicon glyphicon-file" aria-hidden="true" style={{"fontSize":"40px"}}></span>;
        if(link && (/\.(bmp|dib|rle|emf|gif|jpg|jpeg|jpe|jif|pcx|dcx|pic|png|tga|tif|wmf|jfif)/gi).test(link)) {
            // 带图片的后缀，则返回 img 标签
            ret = <img src={link+"@0o_0l_100w_80h_80q"} />
        }
        return ret;
    },
    render() {
        // limitNumNotice 用于弹窗的，
        let { list, count, limitNumNotice=false } = this.props;
        let tableHeaders = [
            {name: ''},
            {name: '原名称'},
            {name: '资源地址'},
            {name: '文件大小'},
            {name: '上传时间'},
            {name: '上传者'},
            {name: '预览'},
        ];
        // <button type='button' className='btn btn-success' onClick={this.select} data-src={item.file_name}>选择</button>

        return (
        <div className='resource'>
            <PanelTitle title='列表'>
                <div className='col-sm-12'>
                    <div className='form-inline resource-search'>
                        <div className='form-group'>
                            <label>名称：</label>
                            <input type='text' className='form-control'
                                valueLink={this.linkState('searchName')} placeholder='请输入名称' />
                        </div>
                        <div className='form-group'>
                            <label>上传时间：</label>
                            <input type='date' className='form-control'
                                valueLink={this.linkState('startTime')} placeholder='请输入时间 2016-4-18' />
                            <label className='control-label'>至</label>
                            <input type='date' className='form-control'
                                valueLink={this.linkState('endTime')} placeholder='请输入时间 2016-4-19' />
                        </div>
                        <button type='button' className='btn btn-success' onClick={this.search}>查询</button>
                    </div>
                </div>
                <div className='col-sm-12 operation'>
                    <button type='button' className='btn btn-danger' onClick={this.add}>上传新资源</button>

                    <button type='button' className='btn btn-primary' onClick={this.openCart}>
                        资源确认区
                        <span className="badge">{this.getTrueNum()} / {this.state.selectNum}</span>
                    </button>
                </div>
            </PanelTitle>
            <div className="table-scroll">
                <DataTable headers={tableHeaders}
                    count={this.props.count}
                    perpage={this.state.pageSize}
                    pageSizeHandler={this.onChangePageSize}
                    currentPage={this.state.page}
                    onChangePage={this.onChangePage}
                    extraClasses='table-striped table-bordered table-hover table-responsive'>
                    {list && list.map((item, idx) =>
                        (<tr key={idx}>
                            <td className="source-frist" >
                                <input type='checkbox' data-src={item.file_name} checked={item.selected==true} onChange={this.select.bind(this,item)}></input>
                            </td>
                            <td className="source-second">{item.old_file_name}</td>
                            <td>{item.file_name}</td>
                             <td>{this.getFileSize(item.size)}</td>
                            <td>{ (new Date((+item.create_time)*1000)).toLocaleString() }</td>
                            <td>{item.user_name}</td>
                            <td><a href={item.file_name} target='_blank'>{this.dealSrc(item.file_name)}</a></td>

                        </tr>)
                    )}
                </DataTable>
            </div>
            <div className='cart-div'>
                <Detail showDetail={this.state.showModal} closeModal={this.closeCartModal} updateImg={this.updateImg} showPrompt={this.showPrompt}></Detail>
            </div>

            <Modal show={this.state.showSelectModal}
                title='资源确认区'
                submitText='关闭'
                large
                cancelHiden
                submitHandler={this.onSelectModalSubmit}
                >
                <SelectedList list={this.state.selectedList} dealSrc={this.dealSrc} ></SelectedList>
            </Modal>
        </div>)
    }
});

export default connect(mapStateToProps)(resource);

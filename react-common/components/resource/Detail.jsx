'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import ClassNames from 'classnames';
import Modal from 'public/components/Modal.jsx';

export default React.createClass({
    getInitialState(){
        return {
            imgList: [],
            saveData:{
                files:[],
                keep_name: 0
            },
        }
    },
    onModalSubmit() {
        let is = ReactDOM.findDOMNode(this.refs.keep_name).checked;
        let notice = '';
        if(is===true) {
            // files 判断名称，先过滤一遍
            // 名称只能由数字、大小写字母、“ . 和 _ ”
            let old_files = this.state.saveData.files;
            for (let i = 0; i < old_files.length; i++) {
                let f = old_files[i];
                if(!(/^[a-z,\.,\d\_]+$/gi).test(f.name)) {
                    notice = notice + f.name +'、';
                }
            }
        }
        // 提示名称不合规范
        if(notice != '') {
            this.props.showPrompt('error', '保持文件原名称时，文件名称只能由数字、大小写字母、“ . 和 _ ”组成', null)
        } else {
            // 设置 是否需要保持原名 0 不需要（默认） 1 需要
            this.state.saveData.keep_name = (is?1:0);
            this.props.updateImg({
                'files[]': this.state.saveData.files,
                keep_name: this.state.saveData.keep_name
            }, (data)=>{
                // console.log(data);
                this.clear();
                // 调用父级的关闭窗口函数，修改 show 的值
                this.props.closeModal();
            });
        }
    },
    onModalCancel() {

        this.clear()
        // 调用父级的关闭窗口函数，修改 show 的值
        this.props.closeModal();
    },
    clear(){
        // 清理上传现场
        this.state.imgList = [];
        this.state.saveData = {
            files:[],
            keep_name: false
        };
    },
    deleteImg(index) {
        // 删除预览的图片信息
        this.state.imgList.splice(index, 1);
        this.setState({
            imgList: this.state.imgList,
        });
        // 删除要上传的图片信息
        this.state.saveData.files.splice(index, 1);
    },
    onSelectFile(e){
        let files = Array.prototype.slice.call(e.target.files);
        e.target.value = null;
        (function getSrc(files){
            if (!files.length) {
                return;
            }
            let f = files.shift();
            // 如果是图片，则进行即时预览
            if((/image/g).test(f.type)) {
                let reader = new FileReader();
                reader.onload = function (name, event) {
                    let imgList = this.state.imgList;
                    imgList.push({
                        isImg: true,
                        name: name,
                        src: event.target.result
                    });
                    this.setState({
                        imgList: this.state.imgList
                    });
                }.bind(this, f.name);
                reader.readAsDataURL(f);
            } else {
                this.state.imgList.push({
                    isImg: false,
                    name: f.name,
                    src: ''
                });
                this.setState({
                    imgList: this.state.imgList
                });
            }
            getSrc.bind(this)(files);
        }.bind(this)(files.slice()));

        // 保存 图片信息
        this.state.saveData.files = this.state.saveData.files.concat(files);
    },
    render: function() {
        return (
            <Modal show={this.props.showDetail}
                title='新增资源'
                submitText='上传'
                large
                submitHandler={this.onModalSubmit}
                cancelHandler={this.onModalCancel}>
                <div className="col-sm-offset-1 col-sm-10 text-danger">

                    <ul className="list-unstyled">
                        <li>
                            1 支持上传的文件类型
                            <ul className="">
                                <li>图片：jpeg、jpg、png、gif；单张图片不超过 20M</li>
                                <li>视频：mp4；单个视频不超过 200M。</li>
                                <li>配置文件：json</li>
                                <li>其他：apk、csv、xml</li>
                            </ul>
                        </li>
                        <li>2 支持上传的文件数量单次不超过 100 个，单次上传的文件总大小不超过 200M；</li>
                        <li>3 支持上传的文件命名规范：文件命名只能使用数字、大小写字母、“ . 和 _ ” ，其他的一律禁止使用。</li>
                    </ul>
                </div>

                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-sm-offset-1 col-sm-10">
                            <input type='file' className='form-control' multiple
                                onChange={this.onSelectFile}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-1 col-sm-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" ref='keep_name' /> 保持文件原名称
                                </label>
                            </div>
                        </div>
                    </div>
                    <ul className='preview-list'>
                        { this.state.imgList.map((o,index) =>
                            <li key={o.name}>
                                <button type="button" className="btn btn-primary btn-xs" onClick={this.deleteImg.bind(this, index)}>删除</button>
                                {o.isImg ? <img src={o.src}></img> : <span className="glyphicon glyphicon-file" aria-hidden="true" style={{'fontSize':'140px',left:'7px'}}></span>}
                                <p>{o.name}</p>
                            </li>
                        )}
                    </ul>
                </div>
            </Modal>

        );
    }
})

'use strict'

import React from 'react';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import {showResourceModal} from 'public/actions/ResourceActions.js';
import ResourceModal from '../ResourceModal.jsx';


const mapStateToProps = (state) => {

    return {
        initFormData: state.appsDetails,
    }
}
const UploadBtn = React.createClass({
    propTypes:{
        title: React.PropTypes.string,
        initData: React.PropTypes.object,
        callbackfunc: React.PropTypes.func,
        dataname: React.PropTypes.string,
        isarray: React.PropTypes.string,
        imgposition: React.PropTypes.string,
    },
    getInitialState() {
        return {
        }
    },
    handleChange(e) {
        let initData = Object.assign({},this.props.initData,{promise:data=>{
            this.props.callbackfunc(data.list,this.props.dataname,this.props.isarray,this.props.imgposition);
        }});
        this.props.dispatch(showResourceModal(initData));
       document.getElementsByTagName('body')[0].style.overflow="hidden";
    },
    render() {
        return (
            <div>
                <button type='button' className='btn btn-info' onClick={this.handleChange}>{this.props.title}</button>
               
            </div>

        );
    }
});

export default connect(mapStateToProps)(UploadBtn);

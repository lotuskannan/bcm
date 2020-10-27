import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filter from '../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../assets/images/download-lite.svg';
import thinPlus from '../../../assets/images/thin-plus.svg';
import uploadIcon from '../../../assets/images/upload.svg';
import uploadedImg from '../../../assets/images/uploaded-img.png';
import fever from '../../../assets/images/fever.png';
import feverTwo from '../../../assets/images/dry-cough.png';
import {RangeDatePicker,SingleDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import * as DataManagementService from './../DataManagementService';
import './style.css';
import LeaveReport from './LeaveReport/LeaveReport';
import Attendance from './Attendance/Attendance';
import LeaveDetails from './LeaveDetails/LeaveDetails';
import LeavePolicy from './LeavePolicy/LeavePolicy';
import LeaveType from './LeaveType/LeaveType';
import ManageLeaves from './ManageLeaves/ManageLeaves';

class LeaveManagementContainer extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: [],
            selectType:'LeaveReport'                
        };      
    }
    componentDidMount() {
        this.btnLeaveReport();
    }
    btnLeaveReport=()=>{
        this.setState({selectType:'LeaveReport'});       
    }
    btnLeaveType=()=>{
        this.setState({selectType:'LeaveType'});
    }
    btnLeavePolicy=()=>{
        this.setState({selectType:'LeavePolicy'});
    }
    btnManageLeaves=()=>{
        this.setState({selectType:'ManageLeaves'});
    }
    btnLeaveDetails=()=>{
        this.setState({selectType:'LeaveDetails'});
    }
    btnAttendance=()=>{
        this.setState({selectType:'Attendance'});
    }
    render() {         
      return (
        <Fragment>         
            <div className="LeaveManagementContainer">
                <input type="button" class={this.state.selectType == 'LeaveReport' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnLeaveReport} value="Leave Report"></input>
                <input type="button" class={this.state.selectType == 'LeaveType' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnLeaveType} value="Leave Type"></input>
                <input type="button" class={this.state.selectType == 'LeavePolicy' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnLeavePolicy} value="Leave Policy"></input>
                <input type="button" class={this.state.selectType == 'ManageLeaves' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnManageLeaves} value="Manage Leaves"></input>
                <input type="button" class={this.state.selectType == 'LeaveDetails' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnLeaveDetails} value="Leave Details"></input>
                <input type="button" class={this.state.selectType == 'Attendance' ? 'btnLeaveReport leave-list active' : 'btnLeaveReport leave-list'} onClick={this.btnAttendance} value="Attendance"></input>
            </div>
            <div className="leave-managemant-body">
                {
                    this.state.selectType == 'LeaveReport' ?(
                        <LeaveReport></LeaveReport>        
                    ):null
                } 
                {
                    this.state.selectType == 'LeaveType' ?(
                        <LeaveType></LeaveType>        
                    ):null
                } 
                {
                    this.state.selectType == 'LeavePolicy' ?(
                        <LeavePolicy></LeavePolicy>        
                    ):null
                } 
                {
                    this.state.selectType == 'ManageLeaves' ?(
                        <ManageLeaves></ManageLeaves>        
                    ):null
                } 
                {
                    this.state.selectType == 'LeaveDetails' ?(
                        <LeaveDetails></LeaveDetails>        
                    ):null
                }
                {
                    this.state.selectType == 'Attendance' ?(
                        <Attendance></Attendance>        
                    ):null
                }                       
            </div>
            
      </Fragment>
      );
   }
}
export default LeaveManagementContainer;
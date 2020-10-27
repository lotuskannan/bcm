import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filter from '../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../assets/images/download-lite.svg';
import thinPlus from '../../assets/images/thin-plus.svg';
import uploadIcon from '../../assets/images/upload.svg';
import uploadedImg from '../../assets/images/uploaded-img.png';
import fever from '../../assets/images/fever.png';
import feverTwo from '../../assets/images/dry-cough.png';
import {RangeDatePicker,SingleDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import * as DataManagementService from './DataManagementService';
import './style.css';

class LeaveAttendance extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: [],
            tempData:[],
            pageLoader:false,
            showMessage:false,
            message:'',
            LeaveManagementList:[],
            filterAreaShow:false,
            startDate:'',
            endDate:'',
            leaveTypeList:[],
            selectedLeaveType:0,
            leaveStatusList:[],
            selectLeaveStatus:0,
            downloadFileClass:'form1 form-fourth'          
        };      
    }
    componentDidMount() {
        this.setState({pageLoader:true});
        // this.initEmpList();
        // this.getLeaveTypeList();      
        this.setState({pageLoader:false});       
    }
    initEmpList=()=>{
        this.setState({pageLoader:true});
        var object;
        if(JSON.parse(sessionStorage.chuttiLoginObject).data == null){
            object = {
                "createdBy": {
                    "gemsOrganisation": {
                        "gemsOrgId": 0
                    }
                },
                "gemsEmplyeeLeaveSummary": {    
                }
            };
        }else{
            object = {
                "createdBy": {
                    "gemsOrganisation": {
                        "gemsOrgId": JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId
                    }
                },
                "gemsEmplyeeLeaveSummary": {    
                }
            };
        }
        var date = new Date();
        var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var fullDate = [date.getFullYear(), mnth, day].join("-");
        var startDate = fullDate;
        var endDate = fullDate;
        DataManagementService.LeaveManagementList(object,startDate,endDate).then(response => {
            let leaveData = [];
            if(response.data){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].status == 'APPROVED'){
                        leaveData.push({
                            employeeName:response.data[i].firstName+" "+response.data[i].lastName,
                            leaveCode:response.data[i].leaveCode,
                            fromDate:this.convertDate(response.data[i].fromDate),
                            toDate:this.convertDate(response.data[i].toDate),
                            permissionDuration:response.data[i].permissionDuration +" Days",
                            status:response.data[i].status,
                            reason:response.data[i].reason
                        });
                    }                    
                }               
            }
            this.setState({LeaveManagementList:leaveData});
            this.setState({pageLoader:false});
        });
        this.setState({pageLoader:false});
    }
    filterSubmit=()=>{
        this.setState({pageLoader:true});
        var startDate = document.getElementsByClassName('selected-date')[0].innerText;
        var endDate = document.getElementsByClassName('selected-date')[1].innerText;
        var object; 
        if(JSON.parse(sessionStorage.chuttiLoginObject).data == null){
            object = {
                "createdBy": {
                    "gemsOrganisation": {
                        "gemsOrgId": 0
                    }
                },
                "gemsEmplyeeLeaveSummary": {    
                }
            };
        }else{
            object = {
                "createdBy": {
                    "gemsOrganisation": {
                        "gemsOrgId": JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId
                    }
                },
                "gemsEmplyeeLeaveSummary": {    
                }
            };
        }
        var sdate = startDate.split('-')[2]+"-"+startDate.split('-')[1]+"-"+startDate.split('-')[0];
        var edate = endDate.split('-')[2]+"-"+endDate.split('-')[1]+"-"+endDate.split('-')[0];
        DataManagementService.LeaveManagementList(object,sdate,edate).then(response => {
            let leaveData = [];
            if(response.data){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].status == 'APPROVED'){
                        leaveData.push({
                            employeeName:response.data[i].firstName+" "+response.data[i].lastName,
                            leaveCode:response.data[i].leaveCode,
                            fromDate:this.convertDate(response.data[i].fromDate),
                            toDate:this.convertDate(response.data[i].toDate),
                            permissionDuration:response.data[i].permissionDuration +" Days",
                            status:response.data[i].status,
                            reason:response.data[i].reason
                        });
                    }                    
                }               
            }
            this.setState({LeaveManagementList:leaveData});
            this.setState({pageLoader:false});
        });
    }
    filterClear=()=>{
        this.setState({filterAreaShow: false});
        // this.initEmpList();
    }
    getLeaveTypeList=()=>{
        this.setState({pageLoader:true});
        DataManagementService.getLeaveTypeList().then(response => {
            let temp = [];            
            for(var i=0;i<response.data.length;i++){
                temp.push({
                    leaveTypeCode:response.data[i].leaveTypeCode,
                    leaveTypeDescription:response.data[i].leaveTypeDescription,
                    gemsLeaveTypeMasterId:response.data[i].gemsLeaveTypeMasterId                   
                })
            }
            this.setState({leaveTypeList:temp});
            this.setState({pageLoader:false});
        });
    }
    getLeaveStatus=()=>{
        // DataManagementService.getLeaveStatus().then(response => {
        //     let temp = [];            
        //     for(var i=0;i<response.data.length;i++){
        //         temp.push({
        //             statusCode:response.data[i].statusCode,
        //             statusDescription:response.data[i].statusDescription,
        //             gemsEmploymentStatusId:response.data[i].gemsEmploymentStatusId                   
        //         })
        //     }
        //     this.setState({leaveStatusList:temp});
        //     this.setState({pageLoader:false});
        // });
    }
    convertDate=(dateValue)=>{
        var date = new Date(dateValue);
        var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var fullDate = [day,mnth,date.getFullYear()].join("-");
        return fullDate;  
    }
    showNotification=(message)=> {
        this.setState({message: message,showMessage: true});
        setTimeout(() => {
           this.setState({message: '',showMessage: false});         
        }, 3000);
    }
    filterAreaShow=()=>{
        if(this.state.filterAreaShow == true){
            this.setState({filterAreaShow: false});
        }else{
            this.setState({filterAreaShow: true});
        }
    }   
    onDateChange=()=>{
        var startDate = document.getElementsByClassName('selected-date')[0].innerText;
        var endDate = document.getElementsByClassName('selected-date')[1].innerText;
        this.setState({startDate:startDate,endDate:endDate});   
    }
    dateConvert=(object)=>{
        const Param = new Date(object); 
        return Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear();        
    }
    selectLeaveType=(value)=>{
        this.setState({selectedLeaveType:value});
    }
    selectLeaveStatus=(value)=>{
        this.setState({selectLeaveStatus:value});
    }
    leaveReport=()=>{
        var orgid = JSON.parse(sessionStorage.chuttiLoginObject).data.organizationId;
        if(document.getElementsByClassName('selected-date')[0] == undefined){
            var date = new Date();
            var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var fullDate = [date.getFullYear(), mnth, day].join("-");
            var startDate = fullDate;
            var endDate = fullDate;
            var url = "https://qa-chutti.cloudnowtech.net/core/api/v1/app-chutti/exportLeaveReport?";
            url = url+"fromDate="+startDate+"&toDate="+endDate+"&fileType=PDF&gemsOrgId="+orgid;
            window.open(url, "_blank"); 
        }else{
            var startDate = document.getElementsByClassName('selected-date')[0].innerText;
            var endDate = document.getElementsByClassName('selected-date')[1].innerText;
            var sdate = startDate.split('-')[2]+"-"+startDate.split('-')[1]+"-"+startDate.split('-')[0];
            var edate = endDate.split('-')[2]+"-"+endDate.split('-')[1]+"-"+endDate.split('-')[0];             
            var url = "https://qa-chutti.cloudnowtech.net/core/api/v1/app-chutti/exportLeaveReport?";
            url = url+"fromDate="+sdate+"&toDate="+edate+"&fileType=PDF&gemsOrgId="+orgid;
            window.open(url, "_blank"); 
        }       
    }
    downloadFile = () => {
        if (this.state.downloadFileClass == 'form1 form-fourth') {
           this.setState({ downloadFileClass: 'form1 form-fourth active' })
        } else {
           this.setState({ downloadFileClass: 'form1 form-fourth' })
        }
    }
    render() {
        const { SearchBar } = Search;
        const columns=[
        {
            dataField: 'employeeName',
            text: 'Employee Name',
            sort: true           
        },
        {         
            dataField: 'leaveCode',
            text: 'Leave Type',            
            sort: true
        },
        {
            dataField: 'fromDate',
            text: 'From',            
            sort: true
        },
        {
            dataField: 'toDate',
            text: 'To',            
            sort: true
        },
        {
            dataField: 'permissionDuration',
            text: 'Duration'           
        },
        {
            dataField:'status',
            text: 'Status',
            sort: false,
            formatter: (row, cell) => (
                <div>
                   {
                        cell.status == 'REJECTED' ? (
                            <span style={{ color: '#FF0000'}}>Rejected</span>
                        ):null                                                        
                   }
                   {
                        cell.status == 'APPROVED' ? (
                            <span style={{ color: '#418600'}}>Approved</span>
                        ):null                                                        
                    }
                    {
                        cell.status == 'PENDING' ? (
                            <span style={{ color: '#222222'}}>Pending</span>
                        ):null                                                        
                    }           
                </div>
            )            
        },
        {
            dataField:'reason',
            text: 'Reason',
            sort: false           
        },
    ];
      
      return (
        <Fragment>
        {
            this.state.showMessage ? <Alert variant="dark" className="mark">
                <div className="alert-container">
                    <p><i className="icons"></i> {this.state.message}</p>
                </div>
            </Alert> : null
        }
        {
            this.state.pageLoader ? (
               <div className="loader">
                  <Spinner animation="grow" variant="dark">
                  </Spinner>
               </div>
            ) : null
         }
         

        <div className="tableList">
        <div className="accordion__item">
          <div className="accordion__button">
             <div className="accordionHeader">
                <div><h5>Leave & Attendance</h5></div>                             
             </div> 
             <div className="tableSearch">
                <div className=" ml-auto d-flex">
                {
                    // <div className="filterSection  mr-2" onClick={this.filterAreaShow}>
                    // <img src={filter} alt="filter icon" />
                    // Filter
                    // </div>
                }
                <div className={this.state.downloadFileClass}>
                <ul className="download-list">
                    <li onClick={this.leaveReport}><span>PDF</span></li>                   
                </ul>
                {
                    // <div className="download-icon" onClick={this.downloadFile}>
                    //     <img src={downloadIcon} alt="download Icon" />
                    // </div>
                }               
                </div>                
                </div>               
             </div>        
          </div>                
        </div>
        {
            this.state.filterAreaShow == true ?(
                <div className="filterContent">
                <div className="form1">
                    <form class="serach-form">
                        <label>Date</label>
                        <RangeDatePicker startDate={new Date()} endDate={new Date()}
                                startDatePlaceholder="Start Date" endDatePlaceholder="End Date"
                                style={{color:'#222222'}}  dateFormat="DD-MM-YYYY"/>
                    </form>
                </div>
                {
                    // <div className="form1">
                    //     <form class="serach-form">
                    //         <label>Leave</label>
                    //         <select class="form-control" id="exampleFormControlSelect1"
                    //     onChange={(e)=>this.selectLeaveType(e.target.value)} value={this.state.selectedLeaveType}>
                    //         <option value="0">Leave Type</option>                            
                    //         {
                    //             this.state.leaveTypeList.map((Object, index) => 
                    //             <option key={index} value={Object.leaveTypeCode}>
                    //                 {Object.leaveTypeDescription}
                    //             </option>)                           
                    //         }                            
                    //     </select>
                    //     </form>
                    // </div>
                }               
                <div className="form1"></div>
                <div className="form-btn">
                    {/* <span className="submit-btn" onClick={()=>this.clickFilterSubmit()}>Submit</span> 
                        <span className="submit-btn" onClick={this.filterSubmit}>Submit</span> 
                        <span className="clear-btn" onClick={this.filterClear}>Clear</span>
                    */}
                    <span className="submit-btn">Submit</span> 
                    <span className="clear-btn">Clear</span>
                    
                </div>
            </div>
            ):null
        }        
        <ToolkitProvider keyField="bcmUserId" data={this.state.LeaveManagementList} columns={columns} search>
        { props => (
          <div className="h-100">
             <div className="filterSearch dataManagementSearch emp-health-search" style={{marginRight: -70}}>
                <div className="filter">
                      <div  className="mb-0 filterSearchForm-control">
                         <form className="serach-form">
                            <SearchBar {...props.searchProps} />
                            <span className="search-icon"></span>
                         </form>
                      </div>
                   </div>
                </div>
             <div className="accordionTable">
                <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps}/>
             </div>
          </div>
          ) }
        </ToolkitProvider>
        </div>       
      </Fragment>
      );
   }
}
export default LeaveAttendance;
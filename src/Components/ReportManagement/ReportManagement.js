import React, { Component, Fragment } from 'react';
import { Row, Col, Card, ProgressBar, Button, Modal, Table, Form, Spinner } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import OwlCarousel from 'react-owl-carousel';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import EditRosterData from './EditRosterData';
import AssignRosterData from './AssignRosterData';
import ChangeShiftData from './ChangeShiftData';
import filter from '../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../assets/images/download-lite.svg';
import uploadIcon from '../../assets/images/upload.svg';
import uploadedImg from '../../assets/images/uploaded-img.png';
import {
   RangeDatePicker,
   SingleDatePicker
} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import * as ReportManagementService from "./ReportManagementService";
import * as RosterManagementService from '../RosterManagement/RosterManagementService';
import EmpHealthReport from './EmpReport/EmpHealthReport';
import './inner.css';
import sharingService from '../../Service/DataSharingService';
import EmpReportExcelFormat from './EmpReport/EmpReportExcelFormat';

class ReportManagement extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Data: [],
         DummyRosterData: [],
         expendViewClass: 'bottom-action',
         ChangeShiftModelShow: false,
         AssignShiftModelShow: false,
         EditRosterDataModelShow: false,
         downloadFileClass: 'form1 form-fourth',
         filterClickEventClass: 'accordionTable',
         getAllShiftLine: [],
         shiftList: [],
         DesignationList: [],
         DepartmentList: [],
         selectedDepartment: '0',
         selectedDesignation: '0',
         selectedShift: '0',
         onRangeDatePickerEvent: 'serach-form active',
         AllPlantMasterData: [],
         PlantLocation: '',
         getAllShiftLineClone: [],
         pageLoader: false,
         plantId: 0,
         statuscode: 5
      };
   }
   componentDidMount() {
      var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
      this.setState({ plantId: plantId })
      this.subscription = sharingService.getMessage().subscribe(message => {
         if (message) {
            var plantId = +message.text
            this.setState({ plantId: plantId })
         } else {
            // clear messages when empty message received
         }
      });
      // this.getShiftList();
      // this.getDesignationList();
      // this.init();
      // this.getAllPlantMaster();

   }
   componentWillUnmount() {
      this.subscription.unsubscribe();
   }
   downloadShiftPDF = () => {
      let params = "?department=" + this.state.selectedDepartment + "&designation=" +
         this.state.selectedDesignation + "&clientShiftName=" + this.state.selectedShift;
      ReportManagementService.downloadShiftReportPDF(params).then(Response => {
      })
   }
   downloadShiftCSV = () => {
      let params = "?department=" + this.state.selectedDepartment + "&designation=" +
         this.state.selectedDesignation + "&clientShiftName=" + this.state.selectedShift;
      ReportManagementService.downloadShiftReportCSV(params).then(Response => {
      })
   }
   getShiftList = () => {
      ReportManagementService.getAllClientShiftMaster().then(Response => {
         if (Response.data) {
            this.setState({
               shiftList: Response.data
            })
         }
      })
   }

   getDesignationList = () => {
      ReportManagementService.getAllUserMaster().then(Response => {
         if (Response.data) {
            let DesignationList = [];
            let DepartmentList = [];
            for (var i = 0; i < Response.data.length; i++) {
               if (Response.data[i].department) {
                  DepartmentList.push({
                     'department': Response.data[i].department
                  });
               }
               if (Response.data[i].designation) {
                  DesignationList.push({
                     'designation': Response.data[i].designation
                  });
               }
            }
            // let DesignationListuniq = [...new Set(DesignationList)];
            // let DepartmentListuniq = [...new Set(DepartmentList)];
            var dups = [];
            var DesignationListuniq = DesignationList.filter(function (el) {
               if (dups.indexOf(el.designation) == -1) {
                  dups.push(el.designation);
                  return true;
               }
               return false;
            });
            var DepartmentListuniq = DepartmentList.filter(function (el) {
               if (dups.indexOf(el.department) == -1) {
                  dups.push(el.department);
                  return true;
               }
               return false;
            });
            this.setState({
               DepartmentList: DepartmentListuniq,
               DesignationList: DesignationListuniq
            });
         }
      })
   }
   deleteRow = (Param) => {
   }
   editRow = (Param, Object) => {
      // this.SetEditRosterDataModelShow();
      this.SetEditRosterDataModelShow();
   }
   SetEditRosterDataModelShow = (e) => {
      this.setState({ EditRosterDataModelShow: true });
   }
   HideEditRosterDataModelShow = (e) => {
      this.setState({ EditRosterDataModelShow: true });
   }
   SetChangeShiftModelShow = (e) => {
      this.setState({ ChangeShiftModelShow: true });
   }
   HideChangeShiftModelShow = (e) => {
      this.setState({ ChangeShiftModelShow: false });
   }
   SetAssignShiftModelShow = (e) => {
      this.setState({ AssignShiftModelShow: true });
   }
   HideAssignShiftModelShow = (e) => {
      this.setState({ AssignShiftModelShow: false });
   }
   // expendView=()=>{
   //    if(this.state.expendViewClass == 'accordionTable'){
   //       this.setState({expendViewClass:'accordionTable active'});
   //    }else{
   //       this.setState({expendViewClass:'accordionTable'});
   //    }
   // }
   selectDesignation = (searchText) => {
      this.setState({
         selectedDesignation: searchText
      })
   }
   selectDepartment = (searchText) => {
      this.setState({
         selectedDepartment: searchText
      })
   }
   selectShift = (searchText) => {
      this.setState({
         selectedShift: searchText
      })
   }
   init = () => {
      this.setState({ pageLoader: true });
      let params = "?department=IT&designation=Manager&clientShiftName=morning";
      ReportManagementService.getAllShiftLine().then(Response => {
         if (Response.data) {
            let Data = [];
            for (var i = 0; i < Response.data.length; i++) {
               Data.push({
                  bcmUserId: Response.data[i].bcmUser.bcmUserId,
                  clientShiftLineId: Response.data[i].clientShiftLineId,
                  clientShiftMasterId: Response.data[i].clientShiftMaster.clientShiftMasterId,
                  clientPlantMasterId: Response.data[i].clientShiftMaster.clientPlantMaster.clientPlantMasterId,
                  plant: Response.data[i].clientShiftMaster.clientPlantMaster.plant,
                  location: Response.data[i].clientShiftMaster.clientPlantMaster.location,
                  clientShiftName: Response.data[i].clientShiftMaster.clientShiftName,
                  inTime: Response.data[i].clientShiftMaster.inTime,
                  outTime: Response.data[i].clientShiftMaster.outTime,
                  isWorkingOnMon: Response.data[i].clientShiftMaster.isWorkingOnMon,
                  isWorkingOnTue: Response.data[i].clientShiftMaster.isWorkingOnTue,
                  isWorkingOnWed: Response.data[i].clientShiftMaster.isWorkingOnWed,
                  isWorkingOnThurs: Response.data[i].clientShiftMaster.isWorkingOnThurs,
                  isWorkingOnFri: Response.data[i].clientShiftMaster.isWorkingOnFri,
                  isWorkingOnSat: Response.data[i].clientShiftMaster.isWorkingOnSat,
                  isWorkingOnSun: Response.data[i].clientShiftMaster.isWorkingOnSun,
                  startDate: Response.data[i].clientShiftMaster.startDate,
                  endDate: Response.data[i].clientShiftMaster.endDate,
                  userName: Response.data[i].userName,
                  department: Response.data[i].bcmUser.department,
                  designation: Response.data[i].bcmUser.designation,
                  inTimeOutTime: Response.data[i].clientShiftMaster.inTime + " - " + Response.data[i].clientShiftMaster.outTime
               });
            }
            localStorage.addShift = '';
            this.setState({ getAllShiftLine: Data, getAllShiftLineClone: Data });
            this.setState({ pageLoader: false });
         }
      });
   }
   selectPlantLocation = (object) => {
      this.setState({ pageLoader: true });
      this.setState({ PlantLocation: object.target.value });
      if (object.target.selectedOptions[0].text == 'All Branch') {
         var tep = this.state.getAllShiftLineClone;
         this.setState({ getAllShiftLine: tep });
      } else {
         var tempary = [];
         for (var i = 0; i < this.state.getAllShiftLineClone.length; i++) {
            if (object.target.selectedOptions[0].text == this.state.getAllShiftLineClone[i].location) {
               tempary.push({
                  bcmUserId: this.state.getAllShiftLineClone[i].bcmUserId,
                  clientShiftLineId: this.state.getAllShiftLineClone[i].clientShiftLineId,
                  clientShiftMasterId: this.state.getAllShiftLineClone[i].clientShiftMasterId,
                  clientPlantMasterId: this.state.getAllShiftLineClone[i].clientPlantMasterId,
                  plant: this.state.getAllShiftLineClone[i].plant,
                  location: this.state.getAllShiftLineClone[i].location,
                  clientShiftName: this.state.getAllShiftLineClone[i].clientShiftName,
                  inTime: this.state.getAllShiftLineClone[i].inTime,
                  outTime: this.state.getAllShiftLineClone[i].outTime,
                  isWorkingOnMon: this.state.getAllShiftLineClone[i].isWorkingOnMon,
                  isWorkingOnTue: this.state.getAllShiftLineClone[i].isWorkingOnTue,
                  isWorkingOnWed: this.state.getAllShiftLineClone[i].isWorkingOnWed,
                  isWorkingOnThurs: this.state.getAllShiftLineClone[i].isWorkingOnThurs,
                  isWorkingOnFri: this.state.getAllShiftLineClone[i].isWorkingOnFri,
                  isWorkingOnSat: this.state.getAllShiftLineClone[i].isWorkingOnSat,
                  isWorkingOnSun: this.state.getAllShiftLineClone[i].isWorkingOnSun,
                  startDate: this.state.getAllShiftLineClone[i].startDate,
                  endDate: this.state.getAllShiftLineClone[i].endDate,
                  userName: this.state.getAllShiftLineClone[i].userName,
                  department: this.state.getAllShiftLineClone[i].department,
                  designation: this.state.getAllShiftLineClone[i].designation,
                  inTimeOutTime: this.state.getAllShiftLineClone[i].inTimeOutTime
               });
            }
         }
         this.setState({ getAllShiftLine: tempary });
      }
      this.setState({ pageLoader: false });
   }
   clearFilter = () => {
      let arr = this.state.getAllShiftLineClone;
      this.setState({ getAllShiftLine: arr });
   }
   clickFilterSubmit = () => {
      if (this.state.selectedDesignation == '0' && this.state.selectedDepartment == '0' && this.state.selectedShift == '0') {
         let arr = this.state.getAllShiftLineClone;
         this.setState({ getAllShiftLine: arr });
      } else {
         var tempary = [];
         for (var i = 0; i < this.state.getAllShiftLineClone.length; i++) {
            if (this.state.selectedDesignation == this.state.getAllShiftLineClone[i].designation &&
               this.state.selectedDepartment == this.state.getAllShiftLineClone[i].department &&
               this.state.selectedShift == this.state.getAllShiftLineClone[i].clientShiftName) {
               tempary.push({
                  bcmUserId: this.state.getAllShiftLineClone[i].bcmUserId,
                  clientShiftLineId: this.state.getAllShiftLineClone[i].clientShiftLineId,
                  clientShiftMasterId: this.state.getAllShiftLineClone[i].clientShiftMasterId,
                  clientPlantMasterId: this.state.getAllShiftLineClone[i].clientPlantMasterId,
                  plant: this.state.getAllShiftLineClone[i].plant,
                  location: this.state.getAllShiftLineClone[i].location,
                  clientShiftName: this.state.getAllShiftLineClone[i].clientShiftName,
                  inTime: this.state.getAllShiftLineClone[i].inTime,
                  outTime: this.state.getAllShiftLineClone[i].outTime,
                  isWorkingOnMon: this.state.getAllShiftLineClone[i].isWorkingOnMon,
                  isWorkingOnTue: this.state.getAllShiftLineClone[i].isWorkingOnTue,
                  isWorkingOnWed: this.state.getAllShiftLineClone[i].isWorkingOnWed,
                  isWorkingOnThurs: this.state.getAllShiftLineClone[i].isWorkingOnThurs,
                  isWorkingOnFri: this.state.getAllShiftLineClone[i].isWorkingOnFri,
                  isWorkingOnSat: this.state.getAllShiftLineClone[i].isWorkingOnSat,
                  isWorkingOnSun: this.state.getAllShiftLineClone[i].isWorkingOnSun,
                  startDate: this.state.getAllShiftLineClone[i].startDate,
                  endDate: this.state.getAllShiftLineClone[i].endDate,
                  userName: this.state.getAllShiftLineClone[i].userName,
                  department: this.state.getAllShiftLineClone[i].department,
                  designation: this.state.getAllShiftLineClone[i].designation,
                  inTimeOutTime: this.state.getAllShiftLineClone[i].inTimeOutTime
               });
            }
         }
         this.setState({ getAllShiftLine: tempary });
      }
   }
   downloadFile = () => {
      if (this.state.downloadFileClass == 'form1 form-fourth') {
         this.setState({ downloadFileClass: 'form1 form-fourth active' })
      } else {
         this.setState({ downloadFileClass: 'form1 form-fourth' })
      }
   }
   filterClickEvent = () => {
      if (this.state.filterClickEventClass == 'accordionTable') {
         this.setState({ filterClickEventClass: 'accordionTable active' })
      } else {
         this.setState({ filterClickEventClass: 'accordionTable' })
      }
   }
   changeHealthStatus = (e) => {
      this.setState({ statuscode: e.target.value });
      if (e.target.value == 4) {
         window.open('https://development.merit.cloudnowtech.com/core/api/v1/bcm-protocol/audit/healthtracker/download?token=' + sessionStorage.loginUserToken);
      }
   }
   onRangeDatePickerEvent = () => {
      if (this.state.onRangeDatePickerEvent == 'serach-form active') {
         this.setState({ onRangeDatePickerEvent: 'serach-form' });
      } else {
         this.setState({ onRangeDatePickerEvent: 'serach-form active' });
      }
   }
   getAllPlantMaster = () => {
      this.setState({ loader: true });
      RosterManagementService.getAllPlantMaster().then(Response => {
         this.setState({ AllPlantMasterData: Response.data ? Response.data : [], loader: false });
      });
   }
   render() {
      const { SearchBar } = Search;
      const commonColums = [
         {
            dataField: 'userName',
            text: 'Name',
            sort: true
         },
         {
            dataField: 'department',
            text: 'Department',
            sort: true
         },
         {
            dataField: 'designation',
            text: 'Designation',
            sort: true
         },
         {
            dataField: 'clientShiftName',
            text: 'Shift Name',
            sort: true
         },
         {
            dataField: 'inTimeOutTime',
            text: 'Shift Timing',
            sort: true
         }
      ];

      return (
         <Fragment>
            <div className="dashboard-container roster-management-container" id="reportManagementTable">
               <div className="dashboard-section">

                  {
                     this.state.ChangeShiftModelShow ? (
                        <ChangeShiftData HideChangeShiftModelShow={this.HideChangeShiftModelShow} ChangeShiftModelShow={this.state.ChangeShiftModelShow} />
                     ) : null
                  }
                  {
                     this.state.AssignShiftModelShow ? (
                        <AssignRosterData HideAssignShiftModelShow={this.HideAssignShiftModelShow} AssignShiftModelShow={this.state.AssignShiftModelShow} />
                     ) : null
                  }
                  {
                     this.state.EditRosterDataModelShow ? (
                        <EditRosterData HideEditRosterDataModelShow={this.HideEditRosterDataModelShow} EditRosterDataModelShow={this.state.EditRosterDataModelShow} />
                     ) : null
                  }


                  <div className="welcome-text">
                     <div className="employee-header">
                        <h2>Report Management</h2>
                        <div className="roster-management  Choose-onSite">
                           <Form.Group controlId="exampleForm.ControlSelect1" className="roster-option-form">
                              <Form.Control as="select" onChange={(e) => this.changeHealthStatus(e)}
                                 value={this.state.statuscode} className={this.state.selectOptionColorName}>
                                 {/* <option value={0}>Shift Management</option> */}
                                 {/* <option value={3}>Employee Health (PDF)</option> */}
                                 <option value={5}>Employee Health</option>
                                 <option value={4}>Audit Report</option>
                              </Form.Control>
                           </Form.Group>
                        </div>
                     </div>
                  </div>
                  {
                     this.state.pageLoader ? (
                        <div className="loader">
                           <Spinner animation="grow" variant="dark">
                           </Spinner>
                        </div>
                     ) : null
                  }
                  {this.state.statuscode == 3 ?
                     <EmpHealthReport {...this.props} /> : null}
                  {this.state.statuscode == 5 ? <EmpReportExcelFormat {...this.props} /> : null}

                  {this.state.statuscode == 0 ?
                     <div className="tableList">
                        <div className="accordion__item">
                           <div className="accordion__button shiftManagement-title">
                              <div className="accordionHeader">
                                 <h5>Shift Management Details</h5>
                              </div>
                              <div className="tableSearch">
                                 <div className="filterSearch ml-auto filterSearch-2 filterSearch-3">

                                    <div className="form1">
                                       <form class={this.state.onRangeDatePickerEvent} id="RangeDatePicker" >
                                          <RangeDatePicker startDate={new Date()} endDate={new Date()}
                                             startDatePlaceholder="Start Date" endDatePlaceholder="End Date" />

                                          {/* <RangeDatePicker
                              startDate={new Date()}
                              endDate={new Date()}
                              dateFormat="D"
                              monthFormat="MMM YYYY"
                              startDatePlaceholder="Start Date"
                              endDatePlaceholder="End Date"
                              disabled={false}
                              className="my-own-class-name"
                              startWeekDay="monday"
                              /> */}
                                          <label htmlFor="search-bar-0" class="search-label"><span id="search-bar-0-label" class="sr-only">Search this table</span>

                                          </label>
                                       </form>
                                    </div>
                                    <div className="form1 form-two">
                                       <form class="serach-form">
                                          <Form.Control as="select" class="form-control searchSelect"
                                             style={{ color: '#dddddd !important', backgroundColor: '#5D5D5D !important' }}
                                             value={this.state.PlantLocation} name="clientPlanAreaDetailId"
                                             onChange={this.selectPlantLocation.bind(this)}>
                                             <option value={0} style={{ backgroundColor: '#ffffff', color: '#222222' }} selected>All Branch</option>
                                             {this.state.AllPlantMasterData.map((PlantObject, index) =>
                                                <option style={{ backgroundColor: '#ffffff', color: '#222222' }} key={index}
                                                   value={PlantObject.location}>{PlantObject.location}
                                                </option>)}
                                          </Form.Control>
                                       </form>
                                    </div>
                                    <div className="form1 form-two">
                                       <form class="serach-form">
                                          <label htmlFor="search-bar-0" class="search-label"><span id="search-bar-0-label" class="sr-only">Search this table</span>
                                             <input id="search-bar-0" type="text" aria-labelledby="search-bar-0-label" class="form-control " placeholder="Search" value="" />
                                          </label><span class="search-icon"></span>
                                       </form>
                                    </div>
                                    <div className="form1 form-three mr-0">
                                       <div className="filterSection" onClick={this.filterClickEvent}>
                                          <img src={filter} alt="filter icon" />
                                       Filter
                                 </div>
                                    </div>
                                    {
                                       // form1 form-fourth active
                                       // download-icon Click
                                    }
                                    <div className={this.state.downloadFileClass}>
                                       {
                                          // <ul className="download-list">
                                          //    <li onClick={()=>this.downloadShiftCSV()}><span>CSV</span></li>
                                          //    <li onClick={()=>this.downloadShiftPDF()}><span>PDF</span></li>
                                          //    <li><span>Excel Sheet</span></li>
                                          // </ul>
                                          // <div className="download-icon" onClick={this.downloadFile}>
                                          //    <img src={downloadIcon} alt="download Icon" />
                                          // </div>
                                       }
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <ToolkitProvider keyField="id" data={this.state.getAllShiftLine} columns={commonColums} search>{props => (
                           <div className={this.state.filterClickEventClass}>{/* accordionTable => filter
                              <div className="filterSearch ml-auto">
                                  <div className="filter">
                                      <div className="mb-0 filterSearchForm-control">
                                          <form className="serach-form">
                                              <SearchBar {...props.searchProps} /> <span className="search-icon"></span>
                                          </form>
                                      </div>
                                  </div>
                              </div>*/}

                              <div className="filterContent">
                                 <div className="form1">
                                    <form class="serach-form">
                                       <label>Department</label>
                                       <select class="form-control" onChange={(e) => this.selectDepartment(e.target.value)} id="exampleFormControlSelect1">
                                          <option value="0">Select Department</option>
                                          {this.state.DepartmentList.map(DepartmentList =>
                                             <option key={DepartmentList.department} value={DepartmentList.department} >
                                                {DepartmentList.department}
                                             </option>)}
                                       </select>
                                    </form>
                                 </div>
                                 <div className="form1">
                                    <form class="serach-form">
                                       <label>Designation</label>
                                       <select class="form-control" onChange={(e) => this.selectDesignation(e.target.value)} id="exampleFormControlSelect1">
                                          <option value="0">Select Designation</option>
                                          {this.state.DesignationList.map(designation =>
                                             <option key={designation.bcmUserId} value={designation.designation} >
                                                {designation.designation}
                                             </option>)}
                                       </select>
                                    </form>
                                 </div>
                                 <div className="form1">
                                    <form class="serach-form">
                                       <label>ShiftName</label>
                                       <select class="form-control" onChange={(e) => this.selectShift(e.target.value)} id="exampleFormControlSelect1">
                                          <option value="0">ShiftName</option>
                                          {this.state.shiftList.map(shift =>
                                             <option key={shift.clientShiftMasterId} value={shift.clientShiftName} >
                                                {shift.clientShiftName}
                                             </option>)}
                                       </select>
                                    </form>
                                 </div>
                                 <div className="form-btn">
                                    {
                                       (this.state.selectedDesignation == '0' || this.state.selectedDepartment == '0' ||
                                          this.state.selectedShift == '0') ? (
                                             <span className="submit-btn">Submit</span>
                                          ) : (
                                             <span className="submit-btn" onClick={() => this.clickFilterSubmit()}>Submit</span>
                                          )
                                    }
                                    <span className="clear-btn" onClick={() => this.clearFilter()}>Clear</span>
                                 </div>
                              </div>


                              <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps} />
                           </div>)}</ToolkitProvider>
                        {/* <div className={this.state.expendViewClass}> z z
                           <ul className="actionList">
                              <li className="changeShift" onClick={this.SetChangeShiftModelShow}><span>Change Shift</span><i className="icon"></i></li>
                              <li className="assignShift" onClick={this.SetAssignShiftModelShow}><span>Assign Shift</span><i className="icon"></i></li>
                           </ul>
                           <span className="action-btn" onClick={this.expendView}><i className="edit"></i></span>
                        </div> */}

                     </div> : null}
               </div>
            </div>
         </Fragment>
      );
   }
}
export default ReportManagement;
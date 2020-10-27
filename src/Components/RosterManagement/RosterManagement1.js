import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-accessible-accordion/dist/fancy-example.css';
import OwlCarousel from 'react-owl-carousel';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import EditShiftData from './EditShiftData';
import AssignShiftData from './AssignShiftData';
import ChangeShiftData from './ChangeShiftData';
import SwapChangeShift from './SwapChangeShift';
import * as RosterManagementService from './RosterManagementService';

class RosterManagement1 extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Data: [],
         DummyRosterData: [],
         expendViewClass: 'bottom-action',
         ChangeShiftModelShow: false,
         AssignShiftModelShow: false,
         EditRosterDataModelShow: false,
         getAllShiftLine: [],
         getAllShiftLineClone: [],
         selectShiftRowData: [],
         pageLoader: true,
         ShowSeleteShiftModel: false,
         ChangeShiftData: [],
         deleteShiftObject: '',
         showMessage: false,
         message: '',
         showAllDeleteShiftModal: false,
         seletedShiftData: [],
         showSwapChangeShiftModel: false,
         PlantLocation: '',
         AllPlantMasterData: [],
         AllClientShiftMaster: [],
         filterShift: 0,
         clientPlantMasterId: '',
         headerType:""
      };
   }
   componentDidMount() {
      this.init();
      this.getAllPlantMaster();
      this.getAllClientShiftMaster();
   }

   init = () => {
      this.setState({ pageLoader: false });
      RosterManagementService.getAllShiftLine().then(Response => {
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
         this.setState({ pageLoader: false });
      });
   }
   getAllClientShiftMaster = () => {
      this.setState({ loader: true });
      RosterManagementService.getAllClientShiftMaster().then(Response => {
         this.setState({ AllClientShiftMaster: Response.data ? Response.data : [], loader: false });
      });
   }
   getAllPlantMaster = () => {
      this.setState({ loader: true });
      RosterManagementService.getAllPlantMaster().then(Response => {
         this.setState({ AllPlantMasterData: Response.data ? Response.data : [], loader: false });
      });
   }
   deleteRow = (Param) => {
      this.setState({ ShowSeleteShiftModel: true, deleteShiftObject: Param });
   }
   deleteEmployeeShift = () => {
      this.setState({ pageLoader: true });
      RosterManagementService.deleteShiftLine(this.state.deleteShiftObject.clientShiftLineId).then(Response => {

         this.setState({ pageLoader: false });
         this.HideSeleteShiftModel();
         this.showNotification('Deleted ' + this.state.deleteShiftObject.userName + ' ' + this.state.deleteShiftObject.clientShiftName + ' shift.');
         this.init();
      });
   }
   showNotification = (message) => {
      this.setState({ message: message, showMessage: true })
      setTimeout(() => {
         this.setState({ message: '', showMessage: false });
      }, 4000);
   }

   HideSeleteShiftModel = () => {
      this.setState({ ShowSeleteShiftModel: false });
   }
   editRow = (Param, Object) => {
      localStorage.EditFlog = '';
      this.setState({ selectShiftRowData: Object });
      this.SetEditRosterDataModelShow();
   }
   SetEditRosterDataModelShow = (e) => {
      this.setState({ EditRosterDataModelShow: true });
   }
   HideEditRosterDataModelShow = (e) => {
      this.setState({ EditRosterDataModelShow: false });
      if (localStorage.EditFlog == '') {
      } else {
         var msg = 'Shift Updated Successfully.';
         this.showNotification(msg);
         this.init();
      }
   }
   SetChangeShiftModelShow = (e) => {
      localStorage.ChangeShiftRes = 0;
      this.setState({ ChangeShiftModelShow: true });
   }
   HideChangeShiftModelShow = (e) => {
      if (localStorage.ChangeShiftRes == 0) {
         this.setState({ ChangeShiftModelShow: false });
      } else {
         this.setState({ ChangeShiftModelShow: false });
         var msg = 'Shift Assigned Successfully.';
         this.showNotification(msg);
         this.setState({ pageLoader: true });
         setTimeout(() => {
            this.init();
         }, 1000);
      }
   }
   SetAssignShiftModelShow = (e) => {
      localStorage.addShift = '';
      this.setState({ AssignShiftModelShow: true });
   }
   HideAssignShiftModelShow = (e) => {
      if (localStorage.addShift == '') {
         this.setState({ AssignShiftModelShow: false });
      } else {
         this.setState({ AssignShiftModelShow: false });
         this.setState({ message: 'Shift Assigned Successfully.', showMessage: true });
         setTimeout(() => {
            this.setState({ message: '', showMessage: false });
         }, 4000);
         this.setState({ pageLoader: true });
         setTimeout(() => {
            for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
               document.getElementsByName('childCheckbox')[i].checked = false;
            }
            this.init();
         }, 1000);
      }
   }
   expendView = () => {
      if (this.state.expendViewClass == 'bottom-action') {
         this.setState({ expendViewClass: 'bottom-action active' });
      } else {
         this.setState({ expendViewClass: 'bottom-action' });
      }
   }
   multipleDelete = () => {
      var parentCheckboxFlag = 0;
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == true) {
            parentCheckboxFlag++;
         }
      }
      if (parentCheckboxFlag == 0) {
         this.setState({ message: 'Please select any one checkbox', plsSelectErrorAlret: true });
         this.showNotification('Please select any one checkbox');
      } else {
         this.setState({ showAllDeleteShiftModal: true });
      }
   }
   parentCheckboxEvent = (object) => {
      if (object.target.checked == true) {
         for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            document.getElementsByName('childCheckbox')[i].checked = true;
         }
      } else {
         for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            document.getElementsByName('childCheckbox')[i].checked = false;
         }
      }
   }
   childCheckboxEvent = (object, row, cell) => {
      this.setState({ clientPlantMasterId: row.clientPlantMasterId });
      if (document.getElementById(row.clientShiftLineId).checked == true) {
         document.getElementById(row.clientShiftLineId).checked = false;
      } else {
         document.getElementById(row.clientShiftLineId).checked = true;
      }
      var parentCheckboxFlag = 0;
      var howManychildChecked = 0;
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == false) {
            parentCheckboxFlag = 1;
         } else {
            howManychildChecked = howManychildChecked + 1;
         }
      }
      document.getElementById('parenCheckbox').checked = (parentCheckboxFlag == 0) ? true : false;
      if (howManychildChecked == 1 || howManychildChecked == 0) {
         this.setState({ expendViewClass: 'bottom-action' });
      } else {
         this.setState({ expendViewClass: 'bottom-action active' });
      }
   }
   alldeleteShiftModalHide = () => {
      this.setState({ showAllDeleteShiftModal: false });
   }
   conformDeleteAllShift = async () => {
      this.setState({ pageLoader: true });
      let ids = [];
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == true) {
            ids.push(document.getElementsByName('childCheckbox')[i].value);
         }
      }
      let Done = Promise.all(ids.map(id => this.getCharacter(id)));
      document.getElementById('parenCheckbox').checked = false;
      this.alldeleteShiftModalHide();
      this.setState({ message: 'Seleted row deleted successfully', showMessage: true });
      setTimeout(() => {
         for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            document.getElementsByName('childCheckbox')[i].checked = false;
         }
         this.setState({ message: '', showMessage: false });
         this.init();
      }, 3000);
   }
   getCharacter = async id => {
      let res = await RosterManagementService.deleteShiftLine(id).then(Response => {
         return true;
      });
   };
   showChangeShiftModels = () => {
      let count = 0;
      let branchID = [];
      let UserData = []
      let shiftID = [];
      const allEqual = arr => arr.every(v => v === arr[0])

      for (let i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == true) {

            branchID.push(document.getElementsByName('childCheckbox')[i].getAttribute('branch'));
            shiftID.push(document.getElementsByName('childCheckbox')[i].getAttribute('shiftid'));
            UserData.push({
               branchID: document.getElementsByName('childCheckbox')[i].getAttribute('branch'),
               shiftID: document.getElementsByName('childCheckbox')[i].getAttribute('shiftid'),
               clientShiftLineId: document.getElementsByName('childCheckbox')[i].value,
               bcmUserId: document.getElementsByName('childCheckbox')[i].getAttribute('bcmuserid')
            });
            count++;
         }
      }

      if (count == 0) {
         this.SetChangeShiftModelShow();
      } else {
         if (allEqual(branchID) == true && allEqual(shiftID) == true) {
            localStorage.InitBranchID = branchID[0];
            localStorage.InitShiftID = shiftID[0];
            this.setState({ selectShiftRowData: UserData });
            this.setState({ showSwapChangeShiftModel: true });
         } else {
            this.setState({ message: 'Please select same branch and shift', showMessage: true });
            setTimeout(() => {
               this.setState({ message: '', showMessage: false });
            }, 4000);
         }
      }
   }
   hideSwapChangeShiftModel = () => {
      if (localStorage.swapEmpShiftRes == 1) {
         this.setState({ message: 'Employee shift swap successfully.', showMessage: true });
         setTimeout(() => {
            for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
               document.getElementsByName('childCheckbox')[i].checked = false;
            }
            this.setState({ message: '', showMessage: false });
         }, 4000);
         this.setState({ showSwapChangeShiftModel: false });
         this.init();
      } else {
         for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            document.getElementsByName('childCheckbox')[i].checked = false;
         }
         this.setState({ showSwapChangeShiftModel: false });
      }
   }
   selectPlantLocation = (object) => {
      this.setState({ pageLoader: true });
      this.setState({ PlantLocation: object.target.value });
      if (object.target.value == 0) {
         this.setState({ getAllShiftLineClone: this.state.getAllShiftLine });
         this.setState({ pageLoader: false });
      } else {
         var Data = [];
         for (var i = 0; i < this.state.getAllShiftLine.length; i++) {
            if (this.state.getAllShiftLine[i].clientPlantMasterId == object.target.value) {
               Data.push({
                  bcmUserId: this.state.getAllShiftLine[i].bcmUserId,
                  clientShiftLineId: this.state.getAllShiftLine[i].clientShiftLineId,
                  clientShiftMasterId: this.state.getAllShiftLine[i].clientShiftMasterId,
                  clientPlantMasterId: this.state.getAllShiftLine[i].clientPlantMasterId,
                  plant: this.state.getAllShiftLine[i].plant,
                  location: this.state.getAllShiftLine[i].location,
                  clientShiftName: this.state.getAllShiftLine[i].clientShiftName,
                  inTime: this.state.getAllShiftLine[i].inTime,
                  outTime: this.state.getAllShiftLine[i].outTime,
                  isWorkingOnMon: this.state.getAllShiftLine[i].isWorkingOnMon,
                  isWorkingOnTue: this.state.getAllShiftLine[i].isWorkingOnTue,
                  isWorkingOnWed: this.state.getAllShiftLine[i].isWorkingOnWed,
                  isWorkingOnThurs: this.state.getAllShiftLine[i].isWorkingOnThurs,
                  isWorkingOnFri: this.state.getAllShiftLine[i].isWorkingOnFri,
                  isWorkingOnSat: this.state.getAllShiftLine[i].isWorkingOnSat,
                  isWorkingOnSun: this.state.getAllShiftLine[i].isWorkingOnSun,
                  startDate: this.state.getAllShiftLine[i].startDate,
                  endDate: this.state.getAllShiftLine[i].endDate,
                  userName: this.state.getAllShiftLine[i].userName,
                  department: this.state.getAllShiftLine[i].department,
                  designation: this.state.getAllShiftLine[i].designation,
                  inTimeOutTime: this.state.getAllShiftLine[i].inTimeOutTime
               });
            }
         }
         this.setState({ getAllShiftLineClone: Data });
         this.setState({ pageLoader: false });
      }
   }
   filterShiftEvent = (object) => {
      this.setState({ pageLoader: true });
      this.setState({ filterShift: object.target.value });
      if (object.target.value == 0) {
         this.setState({ getAllShiftLineClone: this.state.getAllShiftLine });
         this.setState({ pageLoader: false });
      } else {
         var Data = [];
         for (var i = 0; i < this.state.getAllShiftLine.length; i++) {
            if (this.state.getAllShiftLine[i].clientShiftMasterId == object.target.value) {
               Data.push({
                  bcmUserId: this.state.getAllShiftLine[i].bcmUserId,
                  clientShiftLineId: this.state.getAllShiftLine[i].clientShiftLineId,
                  clientShiftMasterId: this.state.getAllShiftLine[i].clientShiftMasterId,
                  clientPlantMasterId: this.state.getAllShiftLine[i].clientPlantMasterId,
                  plant: this.state.getAllShiftLine[i].plant,
                  location: this.state.getAllShiftLine[i].location,
                  clientShiftName: this.state.getAllShiftLine[i].clientShiftName,
                  inTime: this.state.getAllShiftLine[i].inTime,
                  outTime: this.state.getAllShiftLine[i].outTime,
                  isWorkingOnMon: this.state.getAllShiftLine[i].isWorkingOnMon,
                  isWorkingOnTue: this.state.getAllShiftLine[i].isWorkingOnTue,
                  isWorkingOnWed: this.state.getAllShiftLine[i].isWorkingOnWed,
                  isWorkingOnThurs: this.state.getAllShiftLine[i].isWorkingOnThurs,
                  isWorkingOnFri: this.state.getAllShiftLine[i].isWorkingOnFri,
                  isWorkingOnSat: this.state.getAllShiftLine[i].isWorkingOnSat,
                  isWorkingOnSun: this.state.getAllShiftLine[i].isWorkingOnSun,
                  startDate: this.state.getAllShiftLine[i].startDate,
                  endDate: this.state.getAllShiftLine[i].endDate,
                  userName: this.state.getAllShiftLine[i].userName,
                  department: this.state.getAllShiftLine[i].department,
                  designation: this.state.getAllShiftLine[i].designation,
                  inTimeOutTime: this.state.getAllShiftLine[i].inTimeOutTime
               });
            }
         }
         this.setState({ getAllShiftLineClone: Data });
         this.setState({ pageLoader: false });
      }
   }
   onChangeEvent = (e) => {
      var value=e.target.value;
      if(value==0){
         this.setState({headerType:"AssignShift"})
      }
      else{
         this.setState({headerType:"ChangeShift"})
      }
      this.init()
   }
   render() {
      const { SearchBar } = Search;
      const commonColums = [
         {
            text: <div className="action-btn header-action" style={{ textAlign: 'initial' }}>
               <input type="checkbox" id="parenCheckbox" onClick={this.parentCheckboxEvent.bind(this)} />
               <i className="icon-delete" onClick={this.multipleDelete}><span>All</span></i>
            </div>,
            formatter: (row, cell) => (
               <div className="form-group-check" onClick={this.childCheckboxEvent.bind(this, row, cell)}>
                  <input type="checkbox" branch={cell.clientPlantMasterId} shiftId={cell.clientShiftMasterId}
                     id={cell.clientShiftLineId} bcmUserId={cell.bcmUserId} value={cell.clientShiftLineId} name="childCheckbox" />
                  <label htmlFor="html"></label>
               </div>)
         },
         {
            dataField: 'userName',
            text: 'Name',
            sort: true
         },
         {
            dataField: 'clientPlantMasterId',
            text: 'clientPlantMasterId',
            sort: true,
            hidden: true
         },
         {
            dataField: 'location',
            text: 'Branch',
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
         },
         {
            text: 'Actions',
            sort: false,
            formatter: (row, cell) => (<div className="action-btn">
               <i className="icon-edit" onClick={() => this.editRow(this, cell)}></i>
               <i className="icon-delete" onClick={e => this.deleteRow(cell)}></i>
            </div>)
         }
      ];
      const selectRow = {
         mode: 'checkbox',
         clickToSelect: true,
      };
      return (
         <Fragment>
            <div className="dashboard-container roster-management-container">
               <div className="dashboard-section">
                  {
                     this.state.ChangeShiftModelShow ? (
                        <ChangeShiftData HideChangeShiftModelShow={this.HideChangeShiftModelShow}
                           ChangeShiftModelShow={this.state.ChangeShiftModelShow} />
                     ) : null
                  }
                  {
                     this.state.AssignShiftModelShow ? (
                        <AssignShiftData HideAssignShiftModelShow={this.HideAssignShiftModelShow} AssignShiftModelShow={this.state.AssignShiftModelShow} />
                     ) : null
                  }
                  {
                     this.state.EditRosterDataModelShow ? (
                        <EditShiftData HideEditRosterDataModelShow={this.HideEditRosterDataModelShow}
                           rowData={this.state.selectShiftRowData}
                           EditRosterDataModelShow={this.state.EditRosterDataModelShow} />
                     ) : null
                  }
                  {
                     this.state.showSwapChangeShiftModel ? (
                        <SwapChangeShift hideSwapChangeShiftModel={this.hideSwapChangeShiftModel}
                           rowData={this.state.selectShiftRowData} clientPlantMasterId={this.state.clientPlantMasterId}
                           showSwapChangeShiftModel={this.state.showSwapChangeShiftModel} />
                     ) : null
                  }
                  {this.state.showMessage ? <Alert variant="dark" className="mark">
                     <div className="alert-container">
                        <p><i className="icons"></i> {this.state.message}</p>
                      </div>
                  </Alert> : null}
                  {
                     this.state.pageLoader ? (
                        <div className="loader">
                           <Spinner animation="grow" variant="dark">
                           </Spinner>
                        </div>
                     ) : null
                  }
                  <div className="welcome-text">
                     <div className="employee-header">
                        <h2>Roster Management</h2>
                        <div className="roster-management  Choose-onSite">
                           <Form.Group controlId="exampleForm.ControlSelect1" className="roster-option-form">
                              <Form.Control as="select" onChange={(e) => this.changeHealthStatus(e)} value={this.state.statuscode} className={this.state.selectOptionColorName}>
                                 <option value={0}>Employee Shift Details</option>
                                 {
                                    // <option value={1}>COVID Confirmed</option>
                                    // <option value={2}>Suspected</option>
                                    // <option value={3}>Stay at Home</option>
                                    // <option value={4}>Recovered</option>
                                    // <option value={5}>OnSite</option>
                                 }
                              </Form.Control>
                           </Form.Group>
                        </div>
                        <div className="roster-management  Choose-onSite">
                           <Form.Group controlId="exampleForm.ControlSelect1" className="roster-option-form">
                              <Form.Control as="select" onChange={(e) => this.onChangeEvent(e)} value={this.state.statuscode} className={this.state.selectOptionColorName}>
                                 <option value={0}>Un Assigned</option>
                                 <option value={1}>Assigned</option>
                              </Form.Control>
                           </Form.Group>
                        </div>
                     </div>
                  </div>
                  <div className="tableList">
                     <div className="accordion__item">
                        <div className="accordion__button">
                           <div className="accordionHeader">
                              <h5>Employee Shift Details</h5>
                           </div>
                           <div className="tableSearch"></div>
                        </div>
                     </div>
                     <ToolkitProvider keyField="id" data={this.state.getAllShiftLineClone} columns={commonColums} search>{props => (
                        <div class="h-100">
                           <div className="filterSearch ml-auto mt-1">
                              <div className="form1">
                                 <form class="serach-form">
                                    <Form.Control as="select" class="form-control searchSelect"
                                       style={{ color: '#dddddd !important', backgroundColor: '#5D5D5D !important' }}
                                       value={this.state.PlantLocation} name="clientPlanAreaDetailId"
                                       onChange={this.selectPlantLocation.bind(this)}>
                                       <option value={0} style={{ backgroundColor: '#ffffff', color: '#222222' }} selected>Select Branch</option>
                                       {this.state.AllPlantMasterData.map((PlantObject, index) =>
                                          <option style={{ backgroundColor: '#ffffff', color: '#222222' }} key={index}
                                             value={PlantObject.clientPlantMasterId}>{PlantObject.location}
                                          </option>)}
                                    </Form.Control>
                                 </form>
                              </div>
                              <div className="form1">
                                 <form class="serach-form">
                                    <Form.Control as="select" name="clientPlanAreaDetailId"
                                       style={{ color: '#dddddd !important', backgroundColor: '#5D5D5D !important' }} value={this.state.filterShift}
                                       onChange={this.filterShiftEvent.bind(this)}>
                                       <option value={0} selected style={{ backgroundColor: '#ffffff', color: '#222222' }}>Select Shift</option>
                                       {this.state.AllClientShiftMaster.map((Object, index) =>
                                          <option key={index} style={{ backgroundColor: '#ffffff', color: '#222222' }}
                                             value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                          </option>)}
                                    </Form.Control>

                                 </form>
                              </div>
                              <div className="form1">
                                 <form class="serach-form">
                                    {/* Refer AssignTaskModal.js */}
                                    {/* <Form.Group className="datePicker">
                                          <DatePicker value={taskDateString} selected={taskDateString} placeholderText="From"
                                             minDate={new Date()} dateFormat="dd-MM-yyyy"
                                             onChange={e => this.formValChange({ target: { name: 'taskDateString', value: e ? e : '' } })} />
                                          <i className="calIcon"></i>
                                          {isError.taskDateString.length > 0 && (
                                             <Form.Text className="error-msg"> {isError.taskDateString} </Form.Text>
                                          )}
                                       </Form.Group>  */}
                                 </form>
                              </div>
                              <div className="form1">
                                 <form class="serach-form">
                                    {/* Refer AssignTaskModal.js */}
                                    {/* <Form.Group className="datePicker">
                                          <DatePicker value={taskDateString} selected={taskDateString} placeholderText="To"
                                             minDate={new Date()} dateFormat="dd-MM-yyyy"
                                             onChange={e => this.formValChange({ target: { name: 'taskDateString', value: e ? e : '' } })} />
                                          <i className="calIcon"></i>
                                          {isError.taskDateString.length > 0 && (
                                             <Form.Text className="error-msg"> {isError.taskDateString} </Form.Text>
                                          )}
                                       </Form.Group>  */}
                                 </form>
                              </div>
                              <div class="form1">
                                 <form class="serach-form">
                                    <Button variant="success">Assign Shift</Button>
                                 </form>
                              </div>
                           </div>

                           <div className="roster-management-table">
                              <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps} />
                           </div>
                        </div>)}
                     </ToolkitProvider>
                     <div className={this.state.expendViewClass}>
                        <ul className="actionList">
                           <li className="changeShift" onClick={this.showChangeShiftModels}><span>Change Shift</span><i className="icon"></i></li>
                           <li className="assignShift" onClick={this.SetAssignShiftModelShow}><span>Assign Shift</span><i className="icon"></i></li>
                        </ul>
                        <span className="action-btn" onClick={this.expendView}><i className="edit"></i></span>
                     </div>

                     <Modal centered className="delete-confirm" show={this.state.ShowSeleteShiftModel}
                        onHide={this.HideSeleteShiftModel}>
                        <Modal.Body>
                           <p className="text-center">Do you want to delete {this.state.deleteShiftObject.userName} {this.state.deleteShiftObject.clientShiftName} shift ?</p>
                           <div className="text-center">
                              <Button className="confirm-btn" onClick={this.deleteEmployeeShift}>Confirm</Button>
                              <Button onClick={this.HideSeleteShiftModel}>Cancel</Button>
                           </div>
                        </Modal.Body>
                     </Modal>

                     <Modal centered className="delete-confirm" show={this.state.showAllDeleteShiftModal} onHide={this.alldeleteShiftModalHide}>
                        <Modal.Body>
                           <p className="text-center">Do you want to delete seleted shift ?</p>
                           <div className="text-center">
                              <Button className="confirm-btn" onClick={this.conformDeleteAllShift}>Confirm</Button>
                              <Button onClick={this.alldeleteShiftModalHide}>Cancel</Button>
                           </div>
                        </Modal.Body>
                     </Modal>

                  </div>
               </div>
            </div>
         </Fragment>
      );
   }
}
export default RosterManagement1;
import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import OwlCarousel from 'react-owl-carousel';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import EditRosterData from './EditRosterData';
import AssignRosterData from './AssignRosterData';
import ChangeShiftData from './ChangeShiftData';
import AddShiftModel from './AddShiftModel';
import EditShiftModel from './EditShiftModel';
import filter from '../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../assets/images/download-lite.svg';
import thinPlus from '../../assets/images/thin-plus.svg';
import uploadIcon from '../../assets/images/upload.svg';
import uploadedImg from '../../assets/images/uploaded-img.png';
import fever from '../../assets/images/fever.png';
import feverTwo from '../../assets/images/dry-cough.png';
import EmpHealth from './empHealth/EmpHealth';
import SurveyManagement from './surveyManagement/SurveyManagement';
import LeaveManagementContainer from './leaveManagement/LeaveManagementContainer';
import { RangeDatePicker, SingleDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import * as DataManagementService from './DataManagementService';
import * as RosterManagementService from '../RosterManagement/RosterManagementService';
import sharingService from '../../Service/DataSharingService';
import CourseManagement from './CourseManagement/CourseManagement';
class DataManagement extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Data: [],
         ChangeShiftModelShow: false,
         AssignShiftModelShow: false,
         EditRosterDataModelShow: false,
         downloadFileClass: 'form1 form-fourth',
         filterClickEventClass: 'accordionTable',
         statuscode: 3,
         shiftDataList: [],
         addShiftModelShow: false,
         editShiftModelShow: false,
         getAllClientShiftMaster: [],
         getAllClientShiftMasterClone: [],
         getAllClientShiftMasterCloneList: [],
         pageLoader: true,
         seletedEditShiftData: [],
         showDeleteShiftModal: false,
         selectDeleteShiftData: [],
         message: '',
         showMessage: false,
         plsSelectErrorAlret: false,
         showAllDeleteShiftModal: false,
         AllPlantMasterData: [],
         AllClientShiftMaster: [],
         sessionExpired: false,
         deleteLoader: false,
         plantId: 0
      };
   }
   //  getAllClientShiftMaster getAllPlantMaster AllPlantMasterData AllClientShiftMaster
   componentDidMount() {
      var plantId = +sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
      this.setState({ plantId: plantId })
      this.subscription = sharingService.getMessage().subscribe(message => {
         if (message) {
            if (this.props.history.location.pathname == '/home/datamanagement') {
               var plantId = +message.text
               this.setState({ plantId: plantId }, () => {
                  this.init();
               });

               this.setState({ showHeaderMsg: false });

            }
         }
      });
      var Code = '';
      if (this.props.history.location.search.split('?navi=')[1]) {
         const statuscode = this.props.history.location.search.split('?navi=')[1];
         Code = statuscode;
      } else {
         Code = 0;
      }
      this.setState({ statuscode: Code });
      if (Code == 0) {
         // this.init();
      }
      // this.getAllClientShiftMaster();
      this.getAllPlantMaster();
   }
   init = () => {
      this.setState({ pageLoader: true, getAllClientShiftMasterClone: [] });
      console.log(this.state.plantId)
      DataManagementService.getAllClientShiftMaster(this.state.plantId).then(Response => {
         this.setState({
            getAllClientShiftMaster: Response.data
         });
         if (Response.totalResults == 0) {
            this.setState({ pageLoader: false });
         } else {
            let tempObject = [];
            if (Response.data) {
               for (var i = 0; i < Response.data.length; i++) {
                  var Day = '';
                  Day += Response.data[i].isWorkingOnMon == true ? 'Mon ' : '';
                  Day += Response.data[i].isWorkingOnTue == true ? 'Tue ' : '';
                  Day += Response.data[i].isWorkingOnWed == true ? 'Wed ' : '';
                  Day += Response.data[i].isWorkingOnThurs == true ? 'Thu ' : '';
                  Day += Response.data[i].isWorkingOnFri == true ? 'Fri ' : '';
                  Day += Response.data[i].isWorkingOnSat == true ? 'Sat ' : '';
                  Day += Response.data[i].isWorkingOnSun == true ? 'Sun ' : '';
                  tempObject.push({
                     plant: Response.data[i].clientPlantMaster.plant,
                     inTime: Response.data[i].inTime,
                     outTime: Response.data[i].outTime,
                     clientShiftName: Response.data[i].clientShiftName,
                     ShiftDays: Day,
                     clientShiftMasterId: Response.data[i].clientShiftMasterId
                  });
               }
            }
            this.setState({ getAllClientShiftMasterClone: tempObject, getAllClientShiftMasterCloneList: tempObject, pageLoader: false });
         }
         this.setState({ pageLoader: false });
      }, error => {
         this.setState({ pageLoader: false });
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ pageLoader: false });
            }, 3000);
         }
      });
   }
   filterShift = (object) => {
      this.setState({ pageLoader: true });
      var shiftname = object.target.selectedOptions[0].text;
      let tempObject = [];
      if (shiftname == 'All Shift') {
         var arryvalue = this.state.getAllClientShiftMasterCloneList;
         this.setState({ getAllClientShiftMasterClone: arryvalue, pageLoader: false });
      } else {
         for (var i = 0; i < this.state.getAllClientShiftMasterCloneList.length; i++) {
            if (this.state.getAllClientShiftMasterCloneList[i].clientShiftName == shiftname) {
               tempObject.push({
                  plant: this.state.getAllClientShiftMasterCloneList[i].plant,
                  inTime: this.state.getAllClientShiftMasterCloneList[i].inTime,
                  outTime: this.state.getAllClientShiftMasterCloneList[i].outTime,
                  clientShiftName: this.state.getAllClientShiftMasterCloneList[i].clientShiftName,
                  ShiftDays: this.state.getAllClientShiftMasterCloneList[i].ShiftDays,
                  clientShiftMasterId: this.state.getAllClientShiftMasterCloneList[i].clientShiftMasterId
               });
            }
         }
         this.setState({ getAllClientShiftMasterClone: tempObject, pageLoader: false });
      }
   }
   filterPlant = (object) => {
      this.setState({ pageLoader: true });
      var Plantname = object.target.selectedOptions[0].text;
      let tempObject = [];
      if (Plantname == 'All Branch') {
         var arryvalue = this.state.getAllClientShiftMasterCloneList;
         this.setState({ getAllClientShiftMasterClone: arryvalue, pageLoader: false });
      } else {
         for (var i = 0; i < this.state.getAllClientShiftMasterCloneList.length; i++) {
            if (this.state.getAllClientShiftMasterCloneList[i].plant == Plantname) {
               tempObject.push({
                  plant: this.state.getAllClientShiftMasterCloneList[i].plant,
                  inTime: this.state.getAllClientShiftMasterCloneList[i].inTime,
                  outTime: this.state.getAllClientShiftMasterCloneList[i].outTime,
                  clientShiftName: this.state.getAllClientShiftMasterCloneList[i].clientShiftName,
                  ShiftDays: this.state.getAllClientShiftMasterCloneList[i].ShiftDays,
                  clientShiftMasterId: this.state.getAllClientShiftMasterCloneList[i].clientShiftMasterId
               });
            }
         }
         this.setState({ getAllClientShiftMasterClone: tempObject, pageLoader: false });
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
   changeHealthStatus = (object) => {
      this.setState({ statuscode: object.target.value });
      if (object.target.value == '3') {
         this.init();
      }
   }
   addShift = () => {
      if (this.state.addShiftModelShow == true) {
         this.setState({ addShiftModelShow: false });
      } else {
         this.setState({ addShiftModelShow: true });
      }
   }
   addShiftModelHide = () => {
      this.setState({ addShiftModelShow: false });
      if (localStorage.ShiftMsg == '') {
      } else {
         this.showNotification(localStorage.ShiftMsg);
         this.init();
      }
   }
   addShiftModelShow = () => {
      this.setState({ addShiftModelShow: true });
   }
   editShiftData = (Object) => {
      for (var i = 0; i < this.state.getAllClientShiftMaster.length; i++) {
         if (this.state.getAllClientShiftMaster[i].clientShiftMasterId == Object.clientShiftMasterId) {
            this.setState({ seletedEditShiftData: this.state.getAllClientShiftMaster[i] });
            break;
         }
      }
      this.setState({ editShiftModelShow: true });
   }
   editShiftModelHide = () => {
      this.setState({ editShiftModelShow: false });
      if (localStorage.ShiftMsg == '') {
      } else {
         this.showNotification(localStorage.ShiftMsg);
         this.init();
      }
   }
   deleteRowShiftData = (Object) => {
      this.setState({ selectDeleteShiftData: Object, showDeleteShiftModal: true });
   }
   deleteShiftModalHide = () => {
      this.setState({ showDeleteShiftModal: false });
      if (localStorage.ShiftMsg == '') {
      } else {
         this.showNotification(localStorage.ShiftMsg);
         for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            document.getElementsByName('childCheckbox')[i].checked = false;
         }
         this.init()
      }
   }
   conformDeleteShift = () => {
      this.setState({ deleteLoader: true })
      let id = this.state.selectDeleteShiftData.clientShiftMasterId;
      DataManagementService.shiftMasterDelete(id).then(Response => {
         if (Response.status.success == "SUCCESS") {
            localStorage.ShiftMsg = Response.status.message;
         }
         else {
            localStorage.ShiftMsg = Response.status.message
         }
         this.setState({ deleteLoader: false })
         this.deleteShiftModalHide();
      }, error => {
         this.setState({ deleteLoader: false })
         localStorage.ShiftMsg = Response.status.message
         this.deleteShiftModalHide();
      }).catch(error => {
         if (error.message == "Request failed with status code 401") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {
               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ pageLoader: false });
            }, 3000);
         }
      });;;
   }
   showNotification = (message) => {
      localStorage.ShiftMsg = '';
      console.log(message)
      this.setState({ message: message, showMessage: true });
      this.init();
      setTimeout(() => {
         this.setState({ message: '', showMessage: false });
      }, 3000);
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
      if (document.getElementById(row.clientShiftMasterId).checked == true) {
         document.getElementById(row.clientShiftMasterId).checked = false;
      } else {
         document.getElementById(row.clientShiftMasterId).checked = true;
      }
      var parentCheckboxFlag = 0;
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == false) {
            parentCheckboxFlag = 1;
         }
      }
      document.getElementById('parenCheckbox').checked = (parentCheckboxFlag == 0) ? true : false;
   }
   multipleDelete = () => {
      var parentCheckboxFlag = 0;
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == true) {
            parentCheckboxFlag++;
         }
      }
      if (parentCheckboxFlag == 0) {
         this.setState({ message: 'Please select atleast one shift', plsSelectErrorAlret: true });
         setTimeout(() => {
            this.setState({ message: '', plsSelectErrorAlret: false });
         }, 2000);
      } else {
         this.setState({ showAllDeleteShiftModal: true });
      }
   }
   alldeleteShiftModalHide = () => {
      this.setState({ showAllDeleteShiftModal: false });
   }
   conformDeleteAllShift = async () => {
      this.setState({ deleteLoader: true, message: "" })
      let shifts = [];
      for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
         if (document.getElementsByName('childCheckbox')[i].checked == true) {
            var clientShiftMasterId = document.getElementsByName('childCheckbox')[i].value
            shifts.push({
               clientShiftMasterId: clientShiftMasterId
            });
         }
      }

      DataManagementService.deleteAllShifts(shifts).then(Response => {
         if (Response.status.success == "SUCCESS") {
            for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
               document.getElementsByName('childCheckbox')[i].checked = false;
            }
            this.init();
            this.alldeleteShiftModalHide();
            this.setState({ message: Response.status.message, showMessage: true });

         }
         else {
            this.setState({ message: Response.status.message, showMessage: true });
         }
         setTimeout(() => {
            this.setState({ showMessage: false })
         }, 3000);
         this.setState({ deleteLoader: false });
      }, error => {
         this.setState({ message: Response.status.message, showMessage: true, deleteLoader: false });
         setTimeout(() => {
            this.setState({ shiftError: false })
         }, 3000);
      }).catch(error => {
         if (error.message == "Request failed with status code 401") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {
               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ deleteLoader: false });
            }, 3000);
         }
      });;
      //call this on success

   }
   getCharacter = async id => {
      let res = await DataManagementService.shiftMasterDelete(id).then(Response => {
         return true;
      });
   };
   getAllPlantMaster = () => {
      this.setState({ loader: true });
      RosterManagementService.getAllPlantMaster().then(Response => {
         this.setState({ AllPlantMasterData: Response.data ? Response.data : [], loader: false });
      });
   }

   getAllClientShiftMaster = () => {
      this.setState({ loader: true });
      RosterManagementService.getAllClientShiftMaster().then(Response => {
         this.setState({ AllClientShiftMaster: Response.data ? Response.data : [], loader: false });
      });
   }
   render() {
      const { SearchBar } = Search;
      const shiftDataListColumn = [
         {
            text: <div className="action-btn header-action">
               <i className="icon-delete" onClick={this.multipleDelete}> <span className="all-text">All</span></i>
               <input type="checkbox" id="parenCheckbox" onClick={this.parentCheckboxEvent.bind(this)} />

            </div>,
            formatter: (row, cell) => (

               <div className="form-group-check" onClick={this.childCheckboxEvent.bind(this, row, cell)}>
                  <input type="checkbox" id={cell.clientShiftMasterId} value={cell.clientShiftMasterId} name="childCheckbox" />
                  <label htmlFor="html"></label>
               </div>)
         },
         {
            dataField: 'plant',
            text: 'Branch',
            sort: true
         },
         {
            dataField: 'clientShiftName',
            text: 'Shift Name',
            sort: true
         },
         {
            dataField: 'inTime',
            text: 'In-Time',
            sort: true
         },
         {
            dataField: 'outTime',
            text: 'Out-Time',
            sort: true
         },
         {
            dataField: 'ShiftDays',
            text: 'Shift Days'
         },
         {
            text: 'Actions',
            sort: false,
            formatter: (row, cell) => (<div className="action-btn">
               <i className="icon-edit" onClick={() => this.editShiftData(cell)}></i>
               <i className="icon-delete" onClick={e => this.deleteRowShiftData(cell)}></i>
            </div>)
         }
      ];
      const selectRow = {
         mode: 'checkbox',
         clickToSelect: true,
      };
      return (
         <Fragment>
            <div className="dashboard-container" id="dataManagement">
               {
                  this.state.addShiftModelShow ? (
                     <AddShiftModel addShiftModelHide={this.addShiftModelHide} addShiftModelShow={this.state.addShiftModelShow} />
                  ) : null
               }
               {
                  this.state.editShiftModelShow ? (
                     <EditShiftModel editShiftModelHide={this.editShiftModelHide}
                        editShiftModelShow={this.state.editShiftModelShow} EditData={this.state.seletedEditShiftData} />
                  ) : null
               }
               {this.state.showMessage ? <Alert variant="success" className="mark">
                  <div className="alert-container">
                     <p><i className="icons"></i>{this.state.message}  Session Expired,Please login again.</p>
                     <div className="alert-btn">
                            <Button className="mt-2" variant="secondary">OK</Button>
                       </div>
                  </div>
               </Alert> : null}

               {this.state.plsSelectErrorAlret ? <Alert variant="dark">
                  <div className="alert-container">
                     <p><i className="icons"></i>{this.state.message} </p>
                  </div>
                  
               </Alert> : null}
               <Alert show={this.state.sessionExpired} variant="danger">
                  <div className="alert-container">
                     <p><i className="icons"></i> Session Expired,Please login again.</p>
                  </div>
               </Alert>


               <div className="dashboard-section">
                  <div className="welcome-text">
                     <div className="employee-header">
                        <h2>Data Management</h2>
                        <div className="roster-management  Choose-onSite">
                           <Form.Group controlId="exampleForm.ControlSelect1" className="roster-option-form">
                              <Form.Control as="select" onChange={(e) => this.changeHealthStatus(e)}
                                 value={this.state.statuscode} className={this.state.selectOptionColorName}>
                                 <option value={0}>Employee Health</option>
                                 {/* <option value={5}>Leave Management</option> */}
                                 <option value={3}>Shift Management</option>
                                 <option value={6}>Course Management</option>
                                 {/* <option value={3}>Shift Management</option> */}
                              </Form.Control>
                              {
                                 // <option value={1}>Cleaning and Sanitization</option>
                                 // <option value={2}>Training and Awareness</option>
                                 // <option value={4}>Survey Management</option>
                              }
                           </Form.Group>
                        </div>
                     </div>
                  </div>
                  {
                     this.state.statuscode == 3 ? (
                        <div className="tableList">
                           <div className="accordion__item">
                              <div className="accordion__button" style={{ cursor: 'auto' }}>
                                 <div className="accordionHeader">
                                    <div><h5>Shift Management</h5></div>
                                 </div>
                                 <div className="tableSearch">
                                    <div className=" ml-auto">
                                       <div className="download-icon add">
                                          <img src={thinPlus} alt="download Icon" onClick={this.addShift} />
                                       </div>
                                    </div>
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
                           <ToolkitProvider keyField="id" data={this.state.getAllClientShiftMasterClone} columns={shiftDataListColumn} search>
                              {props => (
                                 <div className="h-100">
                                    <div className="filterSearch shift-filter  ml-auto mt-1">
                                       {/* <div className="form1">
                              <form className="serach-form">
                              <Form.Control as="select" name="clientPlanAreaDetailId" onChange={this.filterShift.bind(this)}
                              style={{color: '#dddddd !important',backgroundColor:'#5D5D5D !important'}} value={this.state.filterShift}>
                              <option value={0} style={{backgroundColor: '#ffffff',color: '#222222'}}>All Shift</option>
                                  {this.state.AllClientShiftMaster.map((Object, index) => 
                                    <option key={index} style={{backgroundColor: '#ffffff',color: '#222222'}}
                                      value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                      </option>)}
                              </Form.Control>                                                                                                         
                              </form>
                           </div>
                           <div className="form1">
                           <form className="serach-form">
                              <Form.Control as="select" className="form-control searchSelect" onChange={this.filterPlant.bind(this)}
                              style={{color: '#dddddd !important',backgroundColor:'#5D5D5D !important'}}
                              value={this.state.PlantLocation} name="clientPlanAreaDetailId">
                              <option value={0} style={{backgroundColor: '#ffffff',color: '#222222'}} >All Branch</option>
                                 {this.state.AllPlantMasterData.map((PlantObject, index) => 
                                 <option   style={{backgroundColor: '#ffffff',color: '#222222'}} key={index}
                                 value={PlantObject.clientPlantMasterId}>{PlantObject.plant}
                              </option>)}
                              </Form.Control>
                           </form>
                        </div> */}
                                       <div className="form1">
                                          <div className="filter">
                                             <div className="mb-0 filterSearchForm-control">
                                                <form className="serach-form">
                                                   <SearchBar {...props.searchProps} />
                                                   <span className="search-icon"></span>
                                                </form>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordionTable">
                                       <BootstrapTable className="data-management-table" bordered={false} noDataIndication="No Shifts Found" {...props.baseProps} />
                                    </div>
                                 </div>
                              )}
                           </ToolkitProvider>
                        </div>
                     ) : null
                  }
                  {
                     this.state.statuscode == 4 ? (
                        <SurveyManagement {...this.props}/>
                     ) : null
                  }
                  {
                     this.state.statuscode == 0 ? (
                        <EmpHealth {...this.props}/>
                     ) : null
                  }
                  {
                     this.state.statuscode == 5 ? (
                        <LeaveManagementContainer {...this.props} />
                     ) : null
                  }
                  {this.state.statuscode == 6 ? (
                     <CourseManagement {...this.props} />
                  ) : null}
               </div>
               <Modal centered className="delete-confirm" show={this.state.showDeleteShiftModal} onHide={this.deleteShiftModalHide}>
                  <Modal.Body>
                     {
                        this.state.deleteLoader ? (
                           <div className="loader">
                              <Spinner animation="grow" variant="dark">
                              </Spinner>
                           </div>
                        ) : null
                     }
                     <p className="text-center">Do you want to delete {this.state.selectDeleteShiftData.clientShiftName} shift in Branch {this.state.selectDeleteShiftData.plant} ?</p>
                     <div className="text-center">
                        <Button className="confirm-btn" onClick={this.conformDeleteShift}>Confirm</Button>
                        <Button onClick={this.deleteShiftModalHide}>Cancel</Button>
                     </div>
                  </Modal.Body>
               </Modal>

               <Modal centered className="delete-confirm" show={this.state.showAllDeleteShiftModal} onHide={this.alldeleteShiftModalHide}>
                  <Modal.Body>
                     {
                        this.state.deleteLoader ? (
                           <div className="loader">
                              <Spinner animation="grow" variant="dark">
                              </Spinner>
                           </div>
                        ) : null
                     }
                     <p className="text-center">Do you want to delete seleted shifts ?</p>
                     <div className="text-center">
                        <Button className="confirm-btn" onClick={this.conformDeleteAllShift}>Confirm</Button>
                        <Button onClick={this.alldeleteShiftModalHide}>Cancel</Button>
                     </div>
                  </Modal.Body>
               </Modal>
            </div>
         </Fragment>
      );
   }
}
export default DataManagement;
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
import thinPlus from '../../assets/images/thin-plus.svg';
import uploadIcon from '../../assets/images/upload.svg';
import uploadedImg from '../../assets/images/uploaded-img.png';
import fever from '../../assets/images/fever.png';
import feverTwo from '../../assets/images/dry-cough.png';
import {
   RangeDatePicker,
   SingleDatePicker
 } from "react-google-flight-datepicker";
 import "react-google-flight-datepicker/dist/main.css";
class HealthManagement extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: [],
            DummyRosterData:[],
            expendViewClass:'bottom-action',
            ChangeShiftModelShow:false,
            AssignShiftModelShow:false,
            EditRosterDataModelShow:false,
            downloadFileClass:'form1 form-fourth',
            filterClickEventClass:'accordionTable',
            statuscode:0     
        };      
   }
   componentDidMount() {
      var TempData = [];
      for(var i=0;i<20;i++){
         TempData.push({
            id:i,
            areas:'Area'+i,
            employeeName:'Kishore Rajan'+i,
            department: 'Short Answer - Numbers'+i,
            designation: 'Line Supervisor'+i,
            projects: 'Project'+i,
            shiftname: 'COVID Confirmed',
            shifttiming: '12:00 pm - 08:00 pm',
            contactNumber: '+91 123456 7890',       
         });
      }
      this.setState({
         DummyRosterData:TempData
      })
   }
   deleteRow=(Param)=>{
      
   }
   editRow=(Param,Object)=>{
      // this.SetEditRosterDataModelShow();
      this.SetEditRosterDataModelShow();
   }
   SetEditRosterDataModelShow=(e)=>{
      this.setState({EditRosterDataModelShow:true});
   }
   HideEditRosterDataModelShow=(e)=>{
      this.setState({EditRosterDataModelShow:true});
   }
   SetChangeShiftModelShow = (e) =>{
      this.setState({ChangeShiftModelShow:true});
   }
   HideChangeShiftModelShow = (e) =>{
      this.setState({ChangeShiftModelShow:false});
   }
   SetAssignShiftModelShow = (e) =>{
      this.setState({AssignShiftModelShow:true});
   }
   HideAssignShiftModelShow = (e) =>{
      this.setState({AssignShiftModelShow:false});
   }
   // expendView=()=>{
   //    if(this.state.expendViewClass == 'accordionTable'){
   //       this.setState({expendViewClass:'accordionTable active'});
   //    }else{
   //       this.setState({expendViewClass:'accordionTable'});
   //    }
   // }
   downloadFile=()=>{
      if(this.state.downloadFileClass == 'form1 form-fourth'){
         this.setState({downloadFileClass:'form1 form-fourth active'})
      }else{
         this.setState({downloadFileClass:'form1 form-fourth'})
      }
   }
   filterClickEvent=()=>{
      if(this.state.filterClickEventClass == 'accordionTable'){
         this.setState({filterClickEventClass:'accordionTable active'})
      }else{
         this.setState({filterClickEventClass:'accordionTable'})
      }
   }
   changeHealthStatus=(e)=>{
      
      console.log(e);
      
      // statuscode
   }
   render() {
      const { SearchBar } = Search;
      const commonColums = [
         {
            text: 'Order',
            sort: false,
            formatter: (row, cell) => (<div className="custom-sort">
             <i className="up"></i>
               <i className="down"></i>
            </div>)
         },
         {
            dataField: 'employeeName',
            text: 'Question',
            sort: false,
            formatter: (row, cell) => (<p className="question-text ignoreBlue">
            What symptoms are you going through? [multiple selections]
            </p>)
         },
         {
            dataField: 'department',
            text: 'Type',
            sort: true
         },
         {
            dataField: 'designation',
            text: 'Options',
            sort: false,
            formatter: (row, cell) => (<p className="options">
               Fever
            </p>)
         },
         {
            text: 'Action',
            sort: false,
            formatter: (row, cell) => (<div className="action-btn">
               <i className="icon-edit" onClick={() => this.editRow(this, cell)}></i>
               <i className="icon-delete" onClick={e => this.deleteRow(cell)}></i>
            </div>)
         }
      ];
      return (
        <Fragment>
          <div className="dashboard-container healthManagement" id="dataManagement">
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
                     ):null
                  }
                  
                  <div className="welcome-text">
                      <div className="employee-header">
                          <h2>Data Management</h2>
                          <div className="roster-management  Choose-onSite">
                              <Form.Group controlId="exampleForm.ControlSelect1" className="roster-option-form">
                                  <Form.Control as="select" onChange={(e) => this.changeHealthStatus(e)}
                                  value={this.state.statuscode} className={this.state.selectOptionColorName}>
                                      <option value={0}>Employee Health</option>
                                      <option value={1}>Cleaning and Sanitization</option>
                                      <option value={2}>Training and Awareness</option>
                                      <option value={3}>Shift Management</option>
                                      
                                  </Form.Control>
                              </Form.Group>
                          </div>
                      </div>
                  </div>
                  <div className="tableList">
                  <div className="symptomsTop">
                  <div className="accordion__item">
                        <div className="accordion__button">
                           <div className="accordionHeader">
                              <h5>Symptoms</h5>
                           </div>
                           <div className="tableSearch">
                              <div className="filterSearch ml-auto filterSearch-2">
                                 <div className="download-icon add">
                                    <img src={thinPlus} alt="download Icon" onClick={this.SetChangeShiftModelShow}/>
                                 </div>
                              </div>
                           </div>
                        </div>                
                  </div>
                      <div className="symptoms-container">
                          <div className="symptoms-data">
                            <div className="symptoms edit">
                                <img src={fever} alt="symptoms" />
                                <p>Fever</p>
                            </div>
                            <div className="symptoms edit">
                                <img src={feverTwo} alt="symptoms" />
                                <p>Shortness <br /> of Breath</p>
                            </div>
                            <div className="symptoms edit">
                                <img src={fever} alt="symptoms" />
                                <p>Sneezing</p>
                            </div>
                            <div className="symptoms edit">
                                <img src={feverTwo} alt="symptoms" />
                                <p>Cough</p>
                            </div>
                          </div>
                          <div className="add-symptoms">
                              <div className="symptoms">
                                <span className="add-icon">
                                    <img src={thinPlus} alt="Add Button" onClick={() => this.editRow()}/>
                                </span>
                              </div>
                          </div>
                        </div>  
                     </div>
                      <div className="accordion__item">
                        <div className="accordion__button">
                           <div className="accordionHeader">
                              <h5>Survey Questions</h5>
                           </div>
                           <div className="tableSearch">
                              <div className="filterSearch ml-auto filterSearch-2">
                                 <div className="form1 form-two">
                                    <form class="serach-form">
                                    <label htmlFor="search-bar-0" class="search-label"><span id="search-bar-0-label" class="sr-only">Search this table</span>
                                    <Form.Control type="text" placeholder="Search" />
                                       </label><span class="search-icon"></span>
                                    </form>
                                 </div>
                                 <div className="download-icon add">
                                    <img src={thinPlus} alt="download Icon" onClick={this.SetAssignShiftModelShow}/>
                                 </div>
                              </div>
                           </div>
                        </div>                
                     </div>

                      <ToolkitProvider keyField="id" data={this.state.DummyRosterData} columns={commonColums} search>{ props => (
                          <div className={this.state.filterClickEventClass} id="accordionTable">{/* accordionTable => filter
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
                              <select class="form-control" id="exampleFormControlSelect1">
                                 <option value="">Select Department</option>
                                 <option value="AC Plant Area2">Option 1</option>
                                 <option value="Area 3 - Conference Room">Option 1</option>
                              </select>
                           </form>
                        </div>
                        <div className="form1">
                           <form class="serach-form">
                              <label>Status</label>
                              <select class="form-control" id="exampleFormControlSelect1">
                                 <option value="">All</option>
                                 <option value="AC Plant Area2">Option 1</option>
                                 <option value="Area 3 - Conference Room">Option 1</option>
                                 </select>
                           </form>
                        </div>
                        <div className="form-btn">
                        <span className="submit-btn">Submit</span> <span className="clear-btn">Clear</span>
                        </div>
                     </div>
                    

                              <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps}/>
                          </div>) }</ToolkitProvider>
                        {/* <div className={this.state.expendViewClass}>
                           <ul className="actionList">
                              <li className="changeShift" onClick={this.SetChangeShiftModelShow}><span>Change Shift</span><i className="icon"></i></li>
                              <li className="assignShift" onClick={this.SetAssignShiftModelShow}><span>Assign Shift</span><i className="icon"></i></li>
                           </ul>
                           <span className="action-btn" onClick={this.expendView}><i className="edit"></i></span>
                        </div> */}

                  </div>
              </div>
          </div>
      </Fragment>
      );
   }
}
export default HealthManagement;
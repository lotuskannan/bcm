import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {RangeDatePicker,SingleDatePicker} from "react-google-flight-datepicker";
import filter from '../../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../../assets/images/download-lite.svg';
import thinPlus from '../../../../assets/images/thin-plus.svg';
import eye from '../../../../assets/images/eye.svg';
import AccessTime from './AccessTime';

class Attendance extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: [],
            LeaveManagementList : [
                {
                    leaveName : "CNT10002",
                    description : "Santosh Pranav",
                    month: "39",
                    intime : "39",
                    outtime : "39",
                    workinghours: "39",
                    action : "",
                },
            ],
            downloadFileClass:'form1 form-fourth',
            AccessTimeModelShow:false                  
        };      
    }
    componentDidMount() {                  
    }  
    AccessTimeModelShow=()=>{
        this.setState({AccessTimeModelShow:true});
    }
    AccessTimeModelHide=()=>{
        this.setState({AccessTimeModelShow:false})
    }
    render() {
        const { SearchBar } = Search;
        const columns=[
            {
                dataField: 'leaveName',
                text: 'Date',
                sort: true           
            },
            {         
                dataField: 'Employee Name',
                text: 'Description',            
                sort: true
            },
            {
                dataField: 'month',
                text: 'Shift',            
                sort: true
            },
            {
                dataField: 'intime',
                text: 'In-Time',            
                sort: true
            },
            {
                dataField: 'outtime',
                text: 'out-Time',            
                sort: true
            },
            {
                dataField: 'workinghours',
                text: 'Working Hours',            
                sort: true
            },
            {
                dataField:'action',
                text: 'Access Time',
                sort: false,
                formatter: (row, cell) => (
                    <div className="action-btn">
                    <img src={eye} alt="eye" className="eye-btn" />
                 </div>
                )            
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
            {            
                this.state.AccessTimeModelShow == true ?(
                    <AccessTime AccessTimeModelShow={this.state.AccessTimeModelShow} 
                    AccessTimeModelHide={this.AccessTimeModelHide}></AccessTime>
                ):null        
            }
            <div className="tableList leave-acc">
                <div className="accordion__item">
                    <div className="accordion__button">
                        <div className="accordionHeader">
                            <div><h5>Employee Attendance</h5></div>                             
                        </div> 
                        
                        <div className="tableSearch">
                            <div className=" ml-auto d-flex">
                            <div className="filterSection ml-2 mr-2" >
                             <img src={filter} alt="filter icon" />
                             Filter
                            </div>
                            <div className="download-icon add">
                                <img src={thinPlus} alt="download Icon"  onClick={this.AccessTimeModelShow}/>
                            </div>
                            {/* "active" for show option */}
                            <div className="upload-list">
                                <ul className="list">
                                    <li>Upload Leave Policy</li>
                                    <li>Add Leave Policy</li>
                                </ul>
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
                  
                    <div className="form1"></div>
                    <div className="form-btn">
                         <span className="submit-btn" >Submit</span> 
                         <span className="clear-btn" >Clear</span>
                    </div>
                </div>
                ):null
            }        
            <ToolkitProvider keyField="bcmUserId" data={this.state.LeaveManagementList} columns={columns} search>
            { props => (
              <div className="h-100">
                 <div className="filterSearch dataManagementSearch emp-health-search">
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
export default Attendance;
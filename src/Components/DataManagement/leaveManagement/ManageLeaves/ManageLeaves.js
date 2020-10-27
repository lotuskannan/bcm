import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {RangeDatePicker,SingleDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import * as DataManagementService from '../../DataManagementService';
import filter from '../../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../../assets/images/download-lite.svg';
import thinPlus from '../../../../assets/images/thin-plus.svg';
class ManageLeaves extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: [],
            LeaveManagementList : [
                {
                    leaveName : "SL",
                    description : "Sick Leave",
                    month: "0",
                    applicable : "Immediately",
                    action : "",



                },
            ],
            downloadFileClass:'form1 form-fourth',                   
        };      
    }
    componentDidMount() {                  
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
                dataField: 'leaveName',
                text: 'Employee ID',
                sort: true           
            },
            {         
                dataField: 'description',
                text: 'Employee Status',            
                sort: true
            },
            {
                dataField: 'month',
                text: 'Total Leaves',            
                sort: true
            },
            {
                dataField:'action',
                text: 'Action',
                sort: false,
                formatter: (row, cell) => (
                    <div className="action-btn">
                      <i className="icon-edit"></i>
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
            <div className="tableList leave-acc">
                <div className="accordion__item">
                    <div className="accordion__button">
                        <div className="accordionHeader">
                            <div><h5>Manage Leave Balance</h5></div>                             
                        </div> 
                        <div className="tableSearch">
                            <div className=" ml-auto d-flex">
                                <div className="filterSection ml-2 mr-2" >
                                    <img src={filter} alt="filter icon" />
                                    Filter
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
                 <div className="filterSearch dataManagementSearch manage-leave-search">
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
export default ManageLeaves;
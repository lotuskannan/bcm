import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {RangeDatePicker,SingleDatePicker} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import filter from '../../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../../assets/images/download-lite.svg';
import thinPlus from '../../../../assets/images/thin-plus.svg';

class LeaveDetails extends Component {
   constructor(props) {
        super(props);
        this.state = {
            Data: []                   
        };      
    }
    componentDidMount() {                  
    }     
    render() {
        const { SearchBar } = Search;
      return (
        <Fragment>
            <div className="tableList leave-acc">
                <div className="accordion__item">
                    <div className="accordion__button">
                        <div className="accordionHeader">
                            <div><h5>Manage Leave Details</h5></div>                             
                        </div> 
                        <div className="tableSearch">
                            <div className="ml-auto d-flex">
                                <div className="filterSection ml-2 mr-2" >
                                    <img src={filter} alt="filter icon" />
                                    Filter
                                </div>
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
                            </div>               
                        </div>        
                    </div>                
                </div>
                <div className="manage-leave-details">
                    <div className="row">
                        <div className="col-12 permission">
                            <h6>Maximum Permission(Hrs) Per Month:</h6>
                            <div className="hours-radio-btn">
                              <div className="radio">
                                <input id="radio-1" name="radio" type="radio" checked />
                                <label htmlFor="radio-1" class="radio-label">1 Hour</label>
                              </div>
                              <div className="radio">
                                <input id="radio-2" name="radio" type="radio" checked />
                                <label htmlFor="radio-2" class="radio-label">2 Hour</label>
                              </div>
                              <div className="radio">
                                <input id="radio-3" name="radio" type="radio" checked />
                                <label htmlFor="radio-3" class="radio-label">3 Hour</label>
                              </div>
                              <div className="radio">
                                <input id="radio-4" name="radio" type="radio" checked />
                                <label htmlFor="radio-4" class="radio-label">4 Hour</label>
                              </div>
                              <div className="radio">
                                <input id="radio-5" name="radio" type="radio" checked />
                                <label htmlFor="radio-5" class="radio-label">None</label>
                              </div>
                            </div>
                        </div>
                        <div className="col-12 permission">
                            <h6>No. Of Permission Allowed Per Month:</h6>
                            <div className="hours-radio-btn">
                              <div className="radio">
                                <input id="radio-6" name="radio" type="radio" checked />
                                <label htmlFor="radio-6" class="radio-label">1 </label>
                              </div>
                              <div className="radio">
                                <input id="radio-7" name="radio" type="radio" checked />
                                <label htmlFor="radio-7" class="radio-label">2 </label>
                              </div>
                              <div className="radio">
                                <input id="radio-8" name="radio" type="radio" checked />
                                <label htmlFor="radio-8" class="radio-label">3 </label>
                              </div>
                              <div className="radio">
                                <input id="radio-9" name="radio" type="radio" checked />
                                <label htmlFor="radio-9" class="radio-label">4 </label>
                              </div>
                              <div className="radio">
                                <input id="radio-10" name="radio" type="radio" checked />
                                <label htmlFor="radio-10" class="radio-label">No Limit</label>
                              </div>
                            </div>
                        </div>
                        <div className="col-12 permission">
                           <div className="row ml-0 pl-0">
                               <div className="col-12 col-md-6 pl-0">
                                    <h6>No. Of Permission Allowed Per Month:</h6>
                                    <div className="leave-iput">
                                        <div className="leave-form-control">
                                            <input type="text" value="01" /> : 
                                        </div>
                                        <div className="leave-form-control">
                                            <input type="text" value="01" />
                                        </div>
                                    </div>
                               </div>
                               <div className="col-12 col-md-6">
                                    <h6>Exclude Leave For:</h6>
                                    <div className="checkbox-leave">
                                        <label class="container">
                                            <input type="checkbox" />
                                            <span class="checkmark"></span>
                                            <span className="checkbox-text"> Non Working Days</span>
                                        </label>
                                        <label class="container">
                                            <input type="checkbox" checked="checked" />
                                            <span class="checkmark"></span>
                                            <span className="checkbox-text">Holidays</span>
                                        </label>
                                    </div>
                               </div>
                               <div className="col-12 col-md-10 col-lg-4 ml-0 pl-0">
                                    <div className="row ml-0 pl-0">
                                        <div className="col-12 col-md-4 ml-0 pl-0 leave-type-input">
                                            <h6>CL Per Year:</h6>
                                            <input type="text" value="01" />
                                        </div>
                                        <div className="col-12 col-md-4 ml-0 pl-0 leave-type-input">
                                            <h6>SL Per Year:</h6>
                                            <input type="text" value="01" />
                                        </div>
                                        <div className="col-12 col-md-4 ml-0 pl-0 leave-type-input">
                                            <h6>EL Per Year:</h6>
                                            <input type="text" value="01" />
                                        </div>
                                    </div>
                               </div>
                               <div className="col-12">
                               <div className="text-right leave-btn">
                                    <Button className="confirm-btn">
                                        Confirm
                                    </Button>
                                    <Button className="cancel">
                                    Update
                                    </Button>
                                </div>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
      </Fragment>
      );
   }
}
export default LeaveDetails;
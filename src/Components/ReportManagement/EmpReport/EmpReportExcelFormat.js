import React, { Component } from 'react'
import {
    RangeDatePicker,
} from "react-google-flight-datepicker";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import "react-google-flight-datepicker/dist/main.css";
import filter from '../../../assets/images/Filter-Icon.svg';
import 'react-accessible-accordion/dist/fancy-example.css';

import downloadIcon from '../../../assets/images/download-lite.svg';

import { EmployeeHealthReportService } from './EmployeeHealthReportService';
import { Spinner, Form, Alert } from 'react-bootstrap';
import BaseUrl from '../../../Service/BaseUrl';
import sharingService from '../../../Service/DataSharingService';
import Pagination from "react-js-pagination";

class EmpReportExcelFormat extends Component {


    constructor(props) {
        super(props)

        this.state = {
            filterClass: 'active',
            downloadClass: 'form1 form-fourth',
            expendViewClass: 'bottom-action',
            dateClass: 'active',
            employeeList: [],
            Loader: false,
            healthStatus: '',
            employeeName: '',
            department: '',
            isError: {
                healthStatus: '',
                employeeName: '',
                date: '',
                department: ""
            },
            fromDate: '',
            toDate: '',
            departmentList: [],
            plantId: 0,
            includedColumns: ["designation", "department", "name", 'lastUpdatedStatus', 'trackerStatus', 'userCode'],
            filterList: [],
            filterText: '',
            perpage: 10,
            activePage: 1,
            totalItemsCount: 0,
            start: 0,
            limit: 10,
            sessionExpired: false
        }
    }


    componentDidMount() {
        var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m - 1, date.getDate());
        var lastDay = new Date(y, m, date.getDate());
        this.setState({ plantId, fromDate: firstDay, toDate: lastDay }, () => {
            const fromDate = this.formatDate(this.state.fromDate)
            const toDate = this.formatDate(this.state.toDate)
            if (fromDate && toDate) {
                this.getEmployeeList();
            }
            this.getDepartmentList();
        });
        this.setDateClass();
        this.subscription = sharingService.getMessage().subscribe(message => {
            if (message) {
                var plantId = +message.text
                if (window.location.href.includes('/home/reportmanagement')) {
                    this.setState({
                        plantId, filterText: '', healthStatus: '',
                        employeeName: '',
                        department: '',
                    }, () => {
                        this.getDepartmentList();
                        const fromDate = this.formatDate(this.state.fromDate)
                        const toDate = this.formatDate(this.state.toDate)
                        if (fromDate && toDate) {
                            this.getEmployeeList();
                        }
                    })
                }
            }
        });

    }


    getDepartmentList = () => {
        const { plantId } = this.state;
        // this.setState({ Loader: true });
        EmployeeHealthReportService.getDepartmentList(plantId)
            .then(response => {
                if (response.status.success == 'SUCCESS') {
                    this.setState({ departmentList: response.data })
                }
                // this.setState({ Loader: false });
            }).catch(error => {
                if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
                    this.setState({ sessionExpired: true });
                    setTimeout(() => {

                        sessionStorage.clear();
                        this.props.history.push("login");
                        this.setState({ Loader: false });
                    }, 3000);
                }
            })
    }

    getEmployeeList = () => {
        const fromDate = this.formatDate(this.state.fromDate)
        const toDate = this.formatDate(this.state.toDate)
        
        if (fromDate && toDate) {
            const { plantId, start, limit } = this.state;
            // &start=${start}&limit=${limit}
            var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
            const url = `?fromDate=${fromDate}&toDate=${toDate}${this.state.healthStatus ? '&lastUpdatedStatus=' + this.state.healthStatus : ''}${this.state.employeeName ? '&employeeName=' + this.state.employeeName : ''}${this.state.department ? '&department=' + this.state.department : ''}` + param;
            this.setState({ Loader: true, employeeList: [] });
            const ApiUrl = 'employees/data' + url;
            EmployeeHealthReportService.getEmployeeList(ApiUrl)
                .then(response => {

                    if (response.status.success == 'SUCCESS') {
                        this.setState({
                            employeeList: response.data,
                            filterList: response.data,
                            totalItemsCount: response.totalResults
                        });
                    }
                    this.setState({ Loader: false });
                }).catch(error => {
                    // if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
                    if (error.message == "Request failed with status code 401") {
                        this.setState({ sessionExpired: true });
                        setTimeout(() => {
                            sessionStorage.clear();
                            this.props.history.push("login");
                            this.setState({ Loader: false });
                        }, 3000);
                    }
                })
        } else {

            var { isError } = this.state;
            isError.date = this.dateValidator(fromDate ? fromDate : toDate);
            this.setState({ isError });

        }
    }

    downloadReportPDF = () => {
        const fromDate = this.formatDate(this.state.fromDate)
        const toDate = this.formatDate(this.state.toDate)
        if (fromDate && toDate) {
            const { plantId } = this.state;
            var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
            const url = `?token=${sessionStorage.loginUserToken}&fromDate=${fromDate}&toDate=${toDate}${this.state.healthStatus ? '&lastUpdatedStatus=' + this.state.healthStatus : ''}${this.state.employeeName ? '&employeeName=' + this.state.employeeName : ''}${this.state.department ? '&department=' + this.state.department : ''}` + param;
            const fullEndPoint = BaseUrl.BaseUrl + 'bcm-protocol/healthtrackerreport/employees/excel/download' + url;
            window.open(fullEndPoint);
            this.setState({ downloadClass: '' })
        } else {
            var { isError } = this.state;
            isError.date = this.dateValidator(fromDate ? fromDate : toDate);
            this.setState({ isError, downloadClass: '' });
        }
    }


    formvalueChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        }, () => {
            this.SearchEmployee();
        });


    }


    SearchEmployee = () => {
        const fromDate = this.formatDate(this.state.fromDate)
        const toDate = this.formatDate(this.state.toDate)

        if (fromDate && toDate) {
            const { plantId, start, limit } = this.state;
            // &start=${start}&limit=${limit}
            var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
            const url = `?fromDate=${fromDate}&toDate=${toDate}${this.state.healthStatus ? '&lastUpdatedStatus=' + this.state.healthStatus : ''}${this.state.employeeName ? '&employeeName=' + this.state.employeeName : ''}${this.state.department ? '&department=' + this.state.department : ''}` + param;
            // this.setState({ employeeList: [] });
            const ApiUrl = 'employees/data' + url;
            EmployeeHealthReportService.getEmployeeList(ApiUrl)
                .then(response => {

                    if (response.status.success == 'SUCCESS') {
                        this.setState({
                            employeeList: response.data,
                            filterList: response.data,
                            totalItemsCount: response.totalResults
                        });
                    }
                    this.setState({ Loader: false });
                }).catch(error => {
                    if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
                        this.setState({ sessionExpired: true });
                        setTimeout(() => {

                            sessionStorage.clear();
                            this.props.history.push("login");
                            this.setState({ Loader: false });
                        }, 3000);
                    }
                })
        } else {

            var { isError } = this.state;
            isError.date = this.dateValidator(fromDate ? fromDate : toDate);
            this.setState({ isError });

        }
    }


    dateValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Start Date and End Date is required';
            this.setState({ filterClass: 'active' })
        } else {
            returnMsg = '';
            this.setState({ filterClass: 'active' })
        }
        return returnMsg;
    }

    onDateChange = (startDate, endDate) => {

        this.setState({
            fromDate: startDate ? startDate : '',
            toDate: endDate ? endDate : ''
        })

        const fromDate = this.formatDate(startDate ? startDate : '')
        const toDate = this.formatDate(endDate ? endDate : '')
        if (startDate != null || startDate != null) {
            var { isError } = this.state;
            isError.date = this.dateValidator(fromDate ? fromDate : toDate);
            this.setState({ isError, dateClass: '' });
        }
    }

    resetForm = () => {
        this.setState({
            healthStatus: '',
            employeeName: '',
            department: '',
            filterText: '',
            fromDate: null,
            toDate: null,
            employeeList: this.state.filterList
        });
        var btn = document.getElementsByClassName('reset-button')[0]
        if (btn) {
            btn.click();
            var { isError } = this.state;
            isError.date = '';
            this.setState({ isError });
        }
    }

    formatDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return str ? [day, mnth, date.getFullYear()].join("-") : '';
    }

    setDateClass = () => {
        window.addEventListener('click', (event) => {
            if (window.location.href.includes('/home/reportmanagement')) {
                this.setdatePickerColor();
            }
        });
    }

    handleChange = (e) => {
        this.setState({ filterText: e.target.value });
        this.filterData(e.target.value);
    }

    // filter records by search text
    filterData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") {
            this.setState({ employeeList: this.state.filterList })
        }
        else {
            const filteredData = this.state.filterList.filter(item => {
                return Object.keys(item).some(key => {
                    return this.state.includedColumns.includes(key) ? (item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : '') : false;

                });
            });
            this.setState({ employeeList: filteredData })

        }
    }

    setdatePickerColor() {
        var close = document.getElementsByClassName('dialog-date-picker hide')[0];
        if (close || (this.state.fromDate && this.state.toDate)) {
            this.setState({ dateClass: 'active' });
        } else {
            this.setState({ dateClass: '' });
        }
    }


    sizePerPageCountChange = (object, object1) => {
        let limit = object.target.value;
        let start = 0;
        this.setState({ start, limit, perpage: limit, activePage: 1 }, () => {
            this.getEmployeeList();
        });

    }
    handlePageChange = (pageNumber) => {
        let start = pageNumber - 1;
        let limit = this.state.perpage;
        this.setState({ start, limit, activePage: pageNumber }, () => {
            this.getEmployeeList();
        });
    }

    render() {
        const { employeeList, healthStatus, employeeName,
            departmentList, filterText,
            fromDate, toDate, Loader, downloadClass,
            filterClass, isError, department, dateClass } = this.state;
        const { SearchBar, ClearSearchButton } = Search;

        const commonColums = [
            {
                dataField: 'userCode',
                text: 'Employee Code',
                sort: true
            },
            {
                dataField: 'name',
                text: 'Employee Name',
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
                dataField: 'lastUpdatedStatus',
                text: 'Statusdd',
                sort: true,
                formatter: (row, cell) => (
                    <div>
                        <span style={{
                            color:
                                cell.lastUpdatedStatus == 'Work From Home' ? '#BE83FF' :
                                    cell.lastUpdatedStatus == 'On Site' ? '#4ABF21' :
                                        cell.lastUpdatedStatus == 'Stay at Home' ? '#FF8000' :
                                            cell.lastUpdatedStatus == 'Recovered' ? '#2d5d00' :
                                                (cell.lastUpdatedStatus == 'COVID Confirmed' || cell.lastUpdatedStatus == 'Confirmed') ? '#C90000' :
                                                    cell.lastUpdatedStatus == 'Suspected' ? 'red' : ''
                        }} title={
                            cell.lastUpdatedStatus == 'Work From Home' ? 'Work From Home':
                            cell.lastUpdatedStatus == 'On Site' ? 'Work From Office':''
                        }>{cell.lastUpdatedStatus ? (
                            cell.lastUpdatedStatus == 'Stay at Home' ? 'Quarantine' :
                                cell.lastUpdatedStatus == 'Work From Home' ? 'WFH' :
                                    cell.lastUpdatedStatus == 'On Site' ? 'WFO' : cell.lastUpdatedStatus) : '--'}</span>
                    </div>
                )
            }
        ];
        return (
            <>
                <Alert show={this.state.sessionExpired} variant="danger">
                <div className="alert-container">
                    <p><i className="icons"></i>  Session Expired,Please login again.</p>
                </div>
                </Alert>
                <ToolkitProvider keyField="healhtrackerline_id" data={employeeList} columns={commonColums} search>{props => (
                    <div className="tableList">
                        <div className="accordion__item">
                            <div className="accordion__button">
                                <div className="accordionHeader">
                                    <h5>Employee Health Details</h5>
                                </div>
                                <div className="tableSearch">
                                    <div className="filterSearch ml-auto filterSearch-2">

                                        <div className="form1">
                                            <form className={`serach-form ${dateClass}`} id="RangeDatePicker">
                                                <RangeDatePicker
                                                    startDate={fromDate ? new Date(fromDate) : null}
                                                    endDate={toDate ? new Date(toDate) : null}
                                                    onChange={(startDate, endDate) => this.onDateChange(startDate, endDate)}
                                                    startDatePlaceholder="Start Date"
                                                    endDatePlaceholder="End Date"
                                                    dateFormat="MMM DD,YYYY"
                                                />
                                                {isError.date.length > 0 && <Form.Text className="error-msg text-center report-date-error"> {isError.date} </Form.Text>}
                                                <label htmlFor="search-bar-0" className="search-label"><span id="search-bar-0-label" className="sr-only">Search this table</span>

                                                </label>

                                            </form>

                                        </div>

                                        <div className="form1 form-two">
                                            <form className="serach-form">
                                                <label htmlFor="search-bar-0" className="search-label">
                                                    <span id="search-bar-0-label" className="sr-only">Search this table</span>
                                                    {/* <SearchBar {...props.searchProps} /> */}
                                                    <input className="form-control" placeholder="Search " value={filterText} onChange={e => this.handleChange(e)} />
                                                </label><span className="search-icon"></span>
                                            </form>
                                        </div>
                                        <div className="form1 form-three">
                                            <div className="filterSection" onClick={() => this.setState({ filterClass: filterClass ? '' : 'active', isError: { date: '' } })}>
                                                <img src={filter} alt="filter icon" />
                                               Filter
                                               </div>
                                        </div>

                                        <div className={`form1 form-fourth ${downloadClass}`}>
                                            <ul className="download-list">
                                                {/* <li onClick={() => this.setState({ downloadClass: '' })}><span>CSV</span></li>
                                 <li onClick={() => this.setState({ downloadClass: '' })}><span>Excel Sheet</span></li> */}
                                                <li onClick={() => this.downloadReportPDF()}><span>PDF</span></li>
                                            </ul>
                                            <div className="download-icon" onClick={() => this.downloadReportPDF()}>
                                                {/*  this.setState({ downloadClass: downloadClass ? '' : 'active' }) */}
                                                <img src={downloadIcon} alt="download Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={`accordionTable ${filterClass}`}>


                            <div className="filterContent report-filter">
                                <div className="form1">
                                    <form className="serach-form">
                                        <label className="employee-name-label">Employee Name</label>
                                        <input type="text" className="form-control " name="employeeName" value={employeeName} onChange={e => this.formvalueChange(e)} placeholder="Employee Name" />
                                    </form>
                                </div>
                                <div className="form1">
                                    <form className="serach-form">
                                        <label>Department</label>
                                        <select className="form-control" onChange={e => this.formvalueChange(e)} value={department} name="department" >
                                            <option value={''}>All</option>
                                            {departmentList.map((elem, index) =>
                                                <option key={index} value={elem} >{elem}</option>)}
                                        </select>
                                    </form>
                                </div>
                                <div className="form1">
                                    <form className="serach-form">
                                        <label>Status</label>
                                        <select className="form-control" onChange={e => this.formvalueChange(e)} value={healthStatus} name="healthStatus" >
                                            <option value={''} >All</option>
                                            <option value={'Confirmed'} >COVID Confirmed</option>
                                            <option value={'Suspected'} >Suspected</option>
                                            <option value={'Stay at Home'} >Quarantine</option>
                                            <option value={'Recovered'} >Recovered</option>
                                            <option value={'On Site'} >WFO (Work From Office)</option>
                                            <option value={'Work from Home'} >WFH (Work From Home)</option>
                                        </select>
                                    </form>
                                </div>
                                <div className="form-btn">
                                    <span className="submit-btn cursor-pointer" onClick={this.getEmployeeList} >Submit</span> <span className="clear-btn cursor-pointer" onClick={this.resetForm}>Clear</span>
                                </div>
                            </div>


                            <BootstrapTable bordered={false} noDataIndication="No Records Found" {...props.baseProps} />
                            {Loader ? <div className="loader">
                                <Spinner animation="grow" variant="dark" />
                            </div> : null}

                        </div>
                    </div>
                )}
                </ToolkitProvider>
                {/* <div className="row pagination-row">
                    <div className="col-md-3 pb-0 mb-0">
                        <Form.Control className="show-list d-inline-block" as="select" value={this.state.perpage}
                            onChange={this.sizePerPageCountChange.bind(this)}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                            <option value={this.state.totalItemsCount}>All</option>
                        </Form.Control>
                        <span className="showing">Showing {this.state.start == 0 ? 1 : this.state.start == 1 ? (this.state.start + 10) : (this.state.start * 10) + 1} to {this.state.activePage * this.state.limit} of {this.state.totalItemsCount} Results</span>
                    </div>
                    <div className="col-md-9 pb-0 mb-0">
                        <Pagination activePage={this.state.activePage} itemsCountPerPage={+this.state.perpage}
                            totalItemsCount={this.state.totalItemsCount} itemClass="page-item"
                            linkClass="page-link" pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />
                    </div>
                </div> */}
            </>

        )
    }

}

export default EmpReportExcelFormat

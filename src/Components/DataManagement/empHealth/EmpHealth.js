import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Tab, Nav, Table, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Pagination from "react-js-pagination";
import filter from '../../../assets/images/Filter-Icon.svg';
import downloadIcon from '../../../assets/images/download-lite.svg';
import thinPlus from '../../../assets/images/thin-plus.svg';
import uploadIcon from '../../../assets/images/upload.svg';
import uploadedImg from '../../../assets/images/uploaded-img.png';
import fever from '../../../assets/images/fever.png';
import feverTwo from '../../../assets/images/dry-cough.png';
import sort from '../../../assets/images/sort-swtich.svg';
import AddEmpHealth from './AddEmpHealth';
import EditEmpHeath from './EditEmpHeath';
import * as commonData from '../../util/commonData';
import * as DataManagementService from './../DataManagementService';
import * as RosterManagementService from '../../RosterManagement/RosterManagementService';
import * as  EmployeeHealthService from '../../EmployeeHealth/EmployeeHealthService';
import * as OnSiteSurveyService from '../../OnSiteSurvey/OnSiteSurveyService';
import sharingService from '../../../Service/DataSharingService';

class EmpHealth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            tempData: [],
            AddEmpHealthModelShow: false,
            EditEmpHealthModelShow: false,
            employeeStatusViewData: [],
            employeeStatusVieRowData: [],
            pageLoader: false, showMessage: false, message: '',
            PlantLocation: '',
            AllPlantMasterData: [],
            AllClientShiftMaster: [],
            plantId: 0,
            deleteEmpObject: [],
            showDeleteEmpModal: false,
            pageLoaderForDelete: false,
            showSuccessMsg: '',
            perpage: 10,
            activePage: 1,
            totalItemsCount: 0,
            showOrHideOnsite: false,
            onsiteEmpObj: "",
            changeStatus: 0,
            changeStatusErr: 0,
            fever: false,
            cough: false,
            achesAndPain: false,
            shortnessofBreath: false,
            senseOfSmell: false,
            syntamsflag: false,
            quarantineErrFlag: false,
            changeStatusSubmit: 0,
            statusUpdateLoader: false,
            sessionExpired: false
        }
    }
    componentDidMount() {
        this.setState({ pageLoader: true });
        var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        this.setState({ plantId }, () => {
            this.initEmpList();
            // this.getAllPlantMaster();
            // this.getAllClientShiftMaster();
        });
        this.subscription = sharingService.getMessage().subscribe(message => {
            if (message) {
                if (window.location.href.includes('/home/datamanagement')) {
                    var plantId = +message.text
                    this.setState({ plantId }, () => {
                        this.initEmpList();
                        // this.getAllPlantMaster();
                        // this.getAllClientShiftMaster();
                        // document.getElementById('clearSearchBtn').click();
                    });
                }
            }
        });
    }
    clear = (props) => {
        this.props.searchProps.onSearch('');
        // document.getElementById('search_txt').value = "";
    }
    initEmpList = () => {
        this.setState({ pageLoader: true });
        const { plantId } = this.state;
        let start = 0;
        let limit = 10;
        DataManagementService.employeeStatusViewData(plantId, start, limit).then(response => {
            this.setState({ employeeStatusViewData: response.data ? response.data : [], pageLoader: false, totalItemsCount: response.totalResults });
            this.setState({ pageLoader: false });
            this.setState({ loader: false });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    getAllPlantMaster = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllPlantMaster().then(Response => {
            this.setState({ AllPlantMasterData: Response.data ? Response.data : [], loader: false });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    getAllClientShiftMaster = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllClientShiftMaster().then(Response => {
            this.setState({ AllClientShiftMaster: Response.data ? Response.data : [], loader: false });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    addEmpHealthModelShow = () => {
        this.setState({ AddEmpHealthModelShow: true });
    }
    AddEmpHealthModelShowHide = () => {
        this.setState({ AddEmpHealthModelShow: false });
    }
    EditEmpHealthModelShow = (object) => {
        this.setState({ employeeStatusVieRowData: object });
        this.setState({ EditEmpHealthModelShow: true });
    }
    EditEmpHealthModelShowHide = () => {
        this.setState({ EditEmpHealthModelShow: false });
    }
    showNotification = (message) => {
        this.setState({ message: message, showMessage: true });
        setTimeout(() => {
            this.setState({ message: '', showMessage: false });
        }, 3000);
    }
    deleteEmp = (empObject) => {
        this.setState({ deleteEmpObject: empObject, showDeleteEmpModal: true });
    }
    deleteEmpModalHide = () => {
        this.setState({ showDeleteEmpModal: false });
    }
    conformDeleteEmp = (employee) => {
        this.setState({ pageLoaderForDelete: true });
        let selectedRole = '';
        let reportingTo = '';
        let tempObj = [];
        EmployeeHealthService.getUserDetails(employee.bcmUserId).then(response => {
            if (response.data != null) {
                if (response.data.plantOrBranchList.length == 0) {
                } else {
                    for (var i = 0; i < response.data.plantOrBranchList.length; i++) {
                        tempObj.push({
                            'id': response.data.plantOrBranchList[i].clientPlantMasterId,
                            'name': response.data.plantOrBranchList[i].plantName
                        });
                    }
                    selectedRole = response.data.bcmUserGroupWrapper.bcmUserGroupId;
                    reportingTo = response.data.reportToId;
                }
                let Request = {
                    "bcmDesignation": {
                        "bcmDepartment": {
                            "bcmDepartmentId": response.data.departmentId
                        },
                        "bcmDesignationId": response.data.designationId
                    },
                    "bcmUserGroup": {
                        "bcmUserGroupId": selectedRole
                    },
                    "bcmOrganization": {
                        "bcmOrganizationId": 2
                    },
                    "clientPlantMasterList": tempObj,
                    "bcmUserId": response.data.bcmUserId,
                    "firstName": response.data.firstName,
                    "lastName": response.data.lastName,
                    "password": "Bcm@123",
                    "isActive": 0,
                    "phoneNumber": response.data.mobileNo,
                    "reportingManagerId": reportingTo,
                    "userCode": response.data.userCode,
                    "username": response.data.username
                }
                DataManagementService.deleteUser(Request).then(response => {
                    console.log(response);
                    this.setState({ showDeleteEmpModal: false });
                    this.setState({ pageLoaderForDelete: false });
                    this.initEmpList();
                    this.setState({
                        showSuccessMsg: true,
                        messageType: 'success',
                        successMsg: "Employee details deleted successfully"
                    });
                    setTimeout(() => {
                        this.setState({
                            showSuccessMsg: false,
                        });
                    }, 3000);
                });
            }
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    refreshList = () => {
        this.setState({
            showSuccessMsg: true,
            messageType: 'success',
            successMsg: "Employee details saved successfully"
        });
        setTimeout(() => {
            this.setState({
                showSuccessMsg: false,
            });
        }, 3000);
        this.initEmpList();
    }
    updareRefreshList = () => {
        this.setState({
            showSuccessMsg: true,
            messageType: 'success',
            successMsg: "Employee details updated successfully"
        });
        setTimeout(() => {
            this.setState({
                showSuccessMsg: false,
            });
        }, 3000);
        this.initEmpList();
    }
    hideAlret = () => {
        this.setState({ showSuccessMsg: false, successMsg: "" });
    }
    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing { from} to { to} of { size} Results
        </span>
    );
    SerachChange = object => {
        var paginationOptions = { ...this.state.paginationOptions }
        this.setState({ paginationOptions });
    }
    sizePerPageCountChange = (object, object1) => {
        this.setState({ pageLoader: true });
        let limit = object.target.value;
        let start = 0;
        const { plantId } = this.state;
        DataManagementService.employeeStatusViewData(plantId, start, limit).then(response => {
            this.setState({ employeeStatusViewData: response.data ? response.data : [], pageLoader: false });
            this.setState({ perpage: limit, activePage: 1 });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    handlePageChange = (pageNumber) => {
        this.setState({ pageLoader: true });
        let start = pageNumber;
        let limit = this.state.perpage;
        const { plantId } = this.state;
        DataManagementService.employeeStatusViewData(plantId, start - 1, limit).then(response => {
            this.setState({ employeeStatusViewData: response.data ? response.data : [], pageLoader: false });
            this.setState({ perpage: limit, activePage: start });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    ShowOrHideOnsiteModal = (cell) => {
        this.setState({ showOrHideOnsite: !this.state.showOrHideOnsite, onsiteEmpObj: cell });
        this.setState({
            changeStatus: 0, changeStatusErr: 0, changeStatusSubmit: 0, fever: false,
            cough: false, achesAndPain: false, shortnessofBreath: false, senseOfSmell: false,
            syntamsflag: false, quarantineErrFlag: false
        });

        if (cell.lastUpdatedStatus == 'Stay at Home') {
            this.setState({ changeStatus: '2', syntamsflag: true });
        }
        if (cell.lastUpdatedStatus == 'Work From Home') {
            this.setState({ changeStatus: '1' });
        }
        if (cell.lastUpdatedStatus == 'On Site') {
            this.setState({ changeStatus: '3' });
        }
    }
    CloneShowOrHideOnsiteModal = () => {
        this.setState({ showOrHideOnsite: false, changeStatus: 0, changeStatusErr: 0 });
        this.setState({ changeStatusSubmit: 0 });
    }
    confirmOnSite = () => {
        this.setState({ pageLoaderForonSite: true, statusUpdateLoader: true });
        var userId = this.state.onsiteEmpObj.bcmUserId
        DataManagementService.updateStatusToOnsite(userId).then(response => {
            this.setState({ pageLoaderForDelete: false, showOrHideOnsite: false, statusUpdateLoader: false });
            this.initEmpList();
            this.setState({
                showSuccessMsg: true,
                messageType: 'success',
                successMsg: "Employee status changed to On Site"
            });
            this.hideAlert();
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    handleChangeStatus = (object, value) => {
        this.setState({ changeStatus: object.target.value, quarantineErrFlag: true, changeStatusSubmit: 0 });
        if (object.target.value == '2') {
            this.setState({
                shortnessofBreath: false,
                senseOfSmell: false,
                achesAndPain: false,
                cough: false,
                fever: false
            });
        }
    }
    changeEmpStatus = () => {
        this.setState({ changeStatusSubmit: 1 });
        if (this.state.changeStatus == 0) {
        } else {
            if (this.state.changeStatus == '1') {
                // change to Work form home
                this.statusWorkFromHome();
            }
            if (this.state.changeStatus == '2') {
                // change to Quarantine
                if (this.validSymptom()) {
                } else {
                    this.statusQuarantine();
                }
            }
            if (this.state.changeStatus == '3') {
                // change to Onsite
                this.confirmOnSite();
            }
        }
    }
    statusQuarantine = () => {
        this.setState({ statusUpdateLoader: true });
        var userCode = this.state.onsiteEmpObj.userCode;
        var RequestObject = {
            "anyContactWithCovidPositive": '',
            "familyTestedPositive": '',
            "providePpeForSiteEmployees": '',
            "employeeId": userCode,
            "feverSymtomValue": this.state.fever == true ? 99.7 : 0,
            "coughSymtomValue": this.state.cough,
            "achesPain": this.state.achesAndPain,
            "shortnessOfBreathValue": this.state.shortnessofBreath,
            "workStatus": "SEC",
            "oximeterReading": 0,
            "senseOfSmell": this.state.senseOfSmell
        }
        OnSiteSurveyService.submitEntryHealthCheckDetails(RequestObject).then(Response => {
            this.setState({ pageLoaderForDelete: false, showOrHideOnsite: false });
            this.setState({ pageLoaderForonSite: true, statusUpdateLoader: false });
            this.initEmpList();
            this.setState({
                showSuccessMsg: true,
                messageType: 'success',
                successMsg: "Employee status changed to Quarantine"
            });
            this.hideAlert();
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    hideAlert = () => {
        setTimeout(() => {
            this.setState({ showSuccessMsg: false });
        }, 3000);
    }
    statusWorkFromHome = () => {
        this.setState({ pageLoaderForonSite: true, statusUpdateLoader: true });
        var userCode = this.state.onsiteEmpObj.userCode;
        DataManagementService.workFromHome(userCode).then(response => {
            this.setState({ pageLoaderForDelete: false, showOrHideOnsite: false, statusUpdateLoader: false });
            this.initEmpList();
            this.setState({
                showSuccessMsg: true,
                messageType: 'success',
                successMsg: "Employee status changed to Work from home"
            });
            this.hideAlert();
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {

                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 2000);
            }
        });
    }

    validSymptom() {
        return this.state.fever == false && this.state.cough == false &&
            this.state.achesAndPain == false && this.state.shortnessofBreath == false &&
            this.state.senseOfSmell == false;
    }

    render() {
        const { SearchBar, ClearSearchButton } = Search;
        const shiftDataListColumn = [
            {
                dataField: 'userCode',
                text: 'Employee Code',
                sort: true
            },
            {
                dataField: 'firstName',
                text: 'Employee Name ',
                sort: true,
                formatter: (row, cell) => (
                    <div>
                        { (cell.lastName == null || cell.lastName == '' || cell.lastName == undefined) ? (
                            <p>{cell.firstName}</p>
                        ) : <p>{cell.firstName + ' ' + cell.lastName}</p>
                        }
                    </div>
                )
            },
            {
                dataField: 'department',
                text: 'Department',
                sort: true,
                formatter: (row, cell) => (
                    <div>
                        {
                            (cell.department == undefined) ? ('--') : (
                                (cell.department.length < 10) ? (<p>{cell.department}</p>) : (<p title={cell.department}>{cell.department.substr(0, 10) + ' ...'}</p>)
                            )
                        }
                    </div>
                )
            },
            {
                dataField: 'designation',
                text: 'Designation',
                sort: true,
                formatter: (row, cell) => (
                    <div>
                        {
                            (cell.designation == undefined) ? ('--') : (
                                (cell.designation.length < 10) ? (<p>{cell.designation}</p>) : (<p title={cell.designation}>{cell.designation.substr(0, 10) + ' ...'}</p>)
                            )
                        }
                    </div>
                )
            },
            {
                dataField: 'phoneNumber',
                text: 'Contact Number'
            },
            {
                dataField: 'lastUpdatedStatus',
                text: 'Status ',
                sort: true,
                formatter: (row, cell) => (
                    <div className="status-td-details">
                        {
                            (cell.lastUpdatedStatus == undefined) ? (
                                <span onClick={() => this.ShowOrHideOnsiteModal(cell)}>--<i className="icon-sort">
                                    &nbsp;<img src={sort} /></i></span>
                            ) : (
                                    (cell.lastUpdatedStatus == 'Stay at Home' || cell.lastUpdatedStatus == 'Work From Home' || cell.lastUpdatedStatus == 'On Site' || cell.lastUpdatedStatus == 'Suspected') ? (
                                        cell.lastUpdatedStatus == 'Stay at Home' ? (
                                            <span style={{ color: '#FF8000', cursor: 'pointer' }} onClick={() => this.ShowOrHideOnsiteModal(cell)}>Quarantine
                                                <i className="icon-sort">
                                                    &nbsp;<img src={sort} /></i></span>
                                        ) : (
                                                cell.lastUpdatedStatus == 'Work From Home' ? (
                                                    <span style={{ color: '#BE83FF', cursor: 'pointer' }} onClick={() => this.ShowOrHideOnsiteModal(cell)} title="Work From Home">WFH
                                                        <i className="icon-sort">
                                                            &nbsp;<img src={sort} /></i></span>
                                                ) : (
                                                        cell.lastUpdatedStatus == 'Suspected' ? (
                                                            <span style={{ color: '#FF0000', cursor: 'pointer' }} onClick={() => this.ShowOrHideOnsiteModal(cell)}>Suspected
                                                                <i className="icon-sort">
                                                                    &nbsp;<img src={sort} /></i></span>
                                                        ) : (
                                                                <span style={{ color: '#77E500', cursor: 'pointer' }} onClick={() => this.ShowOrHideOnsiteModal(cell)} title="Work From Office">WFO
                                                                    <i className="icon-sort">
                                                                        &nbsp;<img src={sort} /></i></span>
                                                            )
                                                    )
                                            )
                                    ) : (
                                            <span style={{ cursor: 'pointer' }} onClick={() => this.ShowOrHideOnsiteModal(cell)}>{cell.lastUpdatedStatus}
                                                <i className="icon-sort">
                                                    &nbsp;<img src={sort} /></i></span>
                                        )
                                )
                        }
                    </div>
                )
            },
            {
                dataField: 'reportingManagerName',
                text: 'Reporting To',
                sort: true,
                formatter: (row, cell) => (
                    <div>
                        {
                            (cell.reportingManagerName == undefined) ? ('--') : (
                                (cell.reportingManagerName.length < 10) ? (<p>{cell.reportingManagerName}</p>) : (<p title={cell.reportingManagerName}>{cell.reportingManagerName.substr(0, 10) + ' ...'}</p>)
                            )
                        }
                    </div>
                )
            },
            {
                text: 'Action',
                sort: false,
                formatter: (row, cell) => (
                    <div className="action-btn" style={{ cursor: 'auto' }}>
                        <i className="icon-edit" style={{ cursor: 'pointer' }} onClick={() => this.EditEmpHealthModelShow(cell)}></i>
                        <i className="icon-delete" style={{ cursor: 'pointer' }} onClick={() => this.deleteEmp(cell)}></i>
                    </div>)
            }
        ];
        const styles = {
            fontSize: "20px"
        };
        const afterSearch = (newResult) => {
            if (newResult.length == this.state.initPerpage) {
                this.SerachChange()
            }
        };

        return (
            <Fragment>
                {
                    this.state.showMessage ? <Alert variant="dark" className="mark">
                        <div className="alert-container">
	                        <p><i className="icons"></i>{this.state.message}</p>
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
                <Alert show={this.state.showSuccessMsg} variant={this.state.messageType}>
                    <div className="alert-container">
	                    <p  style={styles}><i className="icons"></i>{this.state.successMsg}</p>
                       <div className="alert-btn">
                            <Button className="mt-2" variant="secondary" onClick={this.hideAlret}>OK</Button>
                       </div>
                    </div>
                    {/* <p className="mb-0">
                        {this.state.successMsg}
                    </p> */}
                </Alert>
                <Alert show={this.state.sessionExpired} variant="danger">
                    <div className="alert-container">
                        <p><i className="icons"></i> Session Expired,Please login again.</p>
                    </div>
                </Alert>
                <div className="tableList">
                    <div className="accordion__item">
                        <div className="accordion__button" style={{ cursor: 'auto' }}>
                            <div className="accordionHeader">
                                <div><h5>Employee Management</h5></div>
                            </div>
                            <div className="tableSearch">
                                <div className=" ml-auto d-flex">
                                    <div className="download-icon add mr-2" style={{ cursor: 'pointer' }}>
                                        <img src={thinPlus} alt="download Icon" onClick={this.addEmpHealthModelShow} />
                                    </div>
                                    {
                                        // <div className="download-icon">
                                        //     <img src={downloadIcon} alt="download Icon" />
                                        // </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToolkitProvider keyField="bcmUserId" data={this.state.employeeStatusViewData} columns={shiftDataListColumn} search>
                        {props => (
                            <div className="h-100">
                                <div className="form1">
                                    <div className="filterSearch dataManagementSearch emp-health-search">
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
                                <div className="accordionTable merits-table data-management-emp-health-table">
                                    <BootstrapTable bordered={false}
                                        noDataIndication="No Records Found" {...props.baseProps} />
                                </div>
                            </div>
                        )}
                    </ToolkitProvider>
                    <div className="row pagination-row">
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
                            {/* <span className="showing">Showing 1 to 10 of 1000 Results</span>                    */}
                        </div>
                        <div className="col-md-9 pb-0 mb-0">
                            <Pagination activePage={this.state.activePage} itemsCountPerPage={+this.state.perpage}
                                totalItemsCount={this.state.totalItemsCount} itemClass="page-item"
                                linkClass="page-link" pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />
                        </div>
                    </div>

                </div>
                {
                    this.state.AddEmpHealthModelShow == true ? (
                        <AddEmpHealth AddEmpHealthModelShow={this.state.AddEmpHealthModelShow}
                            AddEmpHealthModelShowHide={this.AddEmpHealthModelShowHide}
                            refreshList={this.refreshList}></AddEmpHealth>
                    ) : null
                }
                {
                    this.state.EditEmpHealthModelShow == true ? (
                        <EditEmpHeath EditEmpHealthModelShow={this.state.EditEmpHealthModelShow}
                            employeeStatusVieRowData={this.state.employeeStatusVieRowData}
                            EditEmpHealthModelShowHide={this.EditEmpHealthModelShowHide} updareRefreshList={this.updareRefreshList}></EditEmpHeath>
                    ) : null
                }
                <Modal centered className="delete-confirm" show={this.state.showDeleteEmpModal} onHide={this.deleteEmpModalHide}>
                    {
                        this.state.pageLoaderForDelete ? (
                            <div className="loader">
                                <Spinner animation="grow" variant="dark">
                                </Spinner>
                            </div>
                        ) : null
                    }
                    <Modal.Body>

                        <p className="text-center">Do you want to delete {this.state.deleteEmpObject.firstName} employee details ?</p>
                        <div className="text-center">
                            <Button className="confirm-btn" onClick={() => this.conformDeleteEmp(this.state.deleteEmpObject)}>Confirm</Button>
                            <Button onClick={this.deleteEmpModalHide}>Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal id="changeShiftModal" centered className="delete-confirm" show={this.state.showOrHideOnsite} onHide={this.CloneShowOrHideOnsiteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Employee Status
                  </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {
                            this.state.statusUpdateLoader ? (
                                <div className="loader">
                                    <Spinner animation="grow" variant="dark">
                                    </Spinner>
                                </div>
                            ) : null
                        }
                        <Row>
                            <Col xs={12} sm="12" xl="12" className="order-1 order-sm-1">
                                <Row className="align-items-center">
                                    <Col xs={4} sm="4" xl="4" className="addPlantForm">
                                        <Form.Label>Employee Code </Form.Label>
                                    </Col>
                                    <Col xs={8} sm="8" xl="8 pl-3" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" readonly name="userCode" placeholder="employee code" style={{ cursor: 'not-allowed !important' }} value={this.state.onsiteEmpObj.userCode} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} sm="4" xl="4" className="addPlantForm">
                                        <Form.Label>Employee Name </Form.Label>
                                    </Col>
                                    <Col xs={8} sm="8" xl="8 pl-3" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" readonly name="userCode" placeholder="employee name"
                                                style={{ cursor: 'not-allowed !important' }} value={this.state.onsiteEmpObj.firstName} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} sm="4" xl="4" className="addPlantForm">
                                        <Form.Label>Status</Form.Label>
                                    </Col>
                                    <Col xs={8} sm="8" xl="8 pl-3" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control as="select" className="change-shift-formcontrol" value={this.state.changeStatus}
                                                onChange={this.handleChangeStatus.bind(this)}>
                                                <option value="0" selected="selected" disabled style={{ backgroundColor: '#f4f4f4', cursor: 'not-allowed !important' }}>Select Status</option>
                                                {commonData.masterStatus.map((Object, index) =>
                                                    <option key={index} value={Object.id}>
                                                        {Object.name}
                                                    </option>)}
                                            </Form.Control>
                                            {
                                                this.state.changeStatus == '0' && this.state.changeStatusSubmit == '1' ? (
                                                    <Form.Text className="error-msg"> Please select employee status </Form.Text>
                                                ) : null
                                            }
                                        </Form.Group>
                                    </Col>
                                    {
                                        this.state.changeStatus == '2' ? (
                                            <Fragment>
                                                <Col xs={4} sm="4" xl="4" className="addPlantForm">
                                                    <Form.Label></Form.Label>
                                                </Col>
                                                <Col xs={8} sm="8" xl="8 pl-3" className="addPlantForm mt-2">
                                                    <h6 className="symptoms-title">Symptoms</h6>
                                                    <div className="checkbox-leave">
                                                        <label className="container">
                                                            <input type="checkbox" checked={this.state.fever} onChange={e => this.setState({ fever: !this.state.fever })} />
                                                            <span className="checkmark"></span>
                                                            <span className="checkbox-text">Fever</span>
                                                        </label>
                                                    </div>
                                                    <div className="checkbox-leave">
                                                        <label className="container">
                                                            <input type="checkbox" checked={this.state.cough} onChange={e => this.setState({ cough: !this.state.cough })} />
                                                            <span className="checkmark"></span>
                                                            <span className="checkbox-text">Cough</span>
                                                        </label>
                                                    </div>
                                                    <div className="checkbox-leave">
                                                        <label className="container">
                                                            <input type="checkbox" checked={this.state.achesAndPain} onChange={e => this.setState({ achesAndPain: !this.state.achesAndPain })} />
                                                            <span className="checkmark"></span>
                                                            <span className="checkbox-text">Aches & Pain</span>
                                                        </label>
                                                    </div>
                                                    <div className="checkbox-leave">
                                                        <label className="container">
                                                            <input type="checkbox" checked={this.state.shortnessofBreath} onChange={e => this.setState({ shortnessofBreath: !this.state.shortnessofBreath })} />
                                                            <span className="checkmark"></span>
                                                            <span className="checkbox-text">Shortness of Breath</span>
                                                        </label>
                                                    </div>
                                                    <div className="checkbox-leave">
                                                        <label className="container">
                                                            <input type="checkbox" checked={this.state.senseOfSmell} onChange={e => this.setState({ senseOfSmell: !this.state.senseOfSmell })} />
                                                            <span className="checkmark"></span>
                                                            <span className="checkbox-text">Sense of Smell</span>
                                                        </label>
                                                    </div>
                                                    {
                                                        this.state.changeStatus == '2' && this.state.changeStatusSubmit == '1' && this.validSymptom() ? (
                                                            <Form.Text className="error-msg"> Please select any one symptoms </Form.Text>
                                                        ) : null
                                                    }
                                                </Col>
                                            </Fragment>
                                        ) : null
                                    }
                                </Row>
                            </Col>
                        </Row>
                        <div className="text-center mt-3">
                            {
                                this.state.changeStatus == '0' ? (
                                    <Button className="mb-0" style={{ marginLeft: 100 }} onClick={this.changeEmpStatus}>Update</Button>
                                ) : (
                                        (this.state.changeStatus == '1' || this.state.changeStatus == '3') ? (
                                            <Button className="confirm-btn mb-0" style={{ marginLeft: 100 }} onClick={this.changeEmpStatus}>Update</Button>
                                        ) : (
                                                this.state.changeStatus == '2' ? (
                                                    (this.validSymptom()) ?
                                                        (
                                                            <Button className="mb-0" style={{ marginLeft: 100 }} onClick={this.changeEmpStatus}>Update</Button>
                                                        ) : (
                                                            <Button className="confirm-btn mb-0" style={{ marginLeft: 100 }} onClick={this.changeEmpStatus}>Update</Button>
                                                        )
                                                ) : null
                                            )
                                    )
                            }
                            <Button className="mb-0" onClick={this.ShowOrHideOnsiteModal}>Cancel</Button>
                        </div>

                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }
}
export default EmpHealth;
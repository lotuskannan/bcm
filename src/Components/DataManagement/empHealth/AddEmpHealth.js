import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UrlConstants } from '../../../Service/UrlConstants';
import { Multiselect } from 'multiselect-react-dropdown';
import * as DataManagementService from '../DataManagementService';
import * as RosterManagementService from '../../RosterManagement/RosterManagementService';
import * as RoleManagementService from '../../RoleManagement/RoleManagementService';
import { GenericApiService } from '../../../Service/GenericApiService';
import sharingService from '../../../Service/DataSharingService';

class AddEmpHealth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddEmpHealthModelShow: props.AddEmpHealthModelShow,
            userCode: '',
            empName: '',
            department: '',
            designation: '',
            phoneNumber: '',
            phoneNumberClone: 0,
            errors: {},
            pageLoader: false,
            submitflag: 0,
            employeeCodeList: [],
            ReportToUserId: '',
            isLoading: false,
            Loader: false,
            departmentList: [],
            designationList: [],
            employeeList: [],
            reportingTo: '',
            taskAssigneeName: '',
            DesignationListLoder: false,
            plantId: '',
            selectedPlant: '',
            plants: [],
            getAllUserGroupListByIdAndName: [],
            selectedRole: '',
            selectedPlants: []
        }
    }
    componentDidMount() {
        var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        this.setState({ plantId: plantId });
        this.subscription = sharingService.getMessage().subscribe(message => {
            if (message) {
                var plantId = +message.text
                this.setState({ plantId: plantId });
            }
        });
        this.getDepartmentList();
        this.getPlantsByManager();
        this.getAllUserGroupListByIdAndName();
    }
    setModalHide = () => {
        this.props.AddEmpHealthModelShowHide();
    }
    getAllUserGroupListByIdAndName = () => {
        RoleManagementService.getAllUserGroupListByIdAndName().then(response => {
            this.setState({ getAllUserGroupListByIdAndName: response.data });
        });
    }
    getDepartmentList = () => {
        this.setState({ pageLoader: true });
        DataManagementService.getAlldepartmentList().then(Response => {
            this.setState({ departmentList: Response.data ? Response.data : [], pageLoader: false });
        });
    }
    getDesignationList = (id) => {
        this.setState({ designation: '', designationList: [] });
        DataManagementService.getDepartWiseDesignationList(id).then(Response => {
            this.setState({ designationList: Response.data ? Response.data : [], DesignationListLoder: false });
        });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ submitflag: 1 });
        if (this.validForm()) {
        } else {
            this.userSave();
        }
    }
    userSave = () => {
        let clientPlantMasterId = [];
        for (var i = 0; i < this.state.selectedPlants.length; i++) {
            clientPlantMasterId.push({
                'clientPlantMasterId': this.state.selectedPlants[i].id
            })
        }
        let Request = {
            "bcmDesignation": {
                "bcmDepartment": {
                    "bcmDepartmentId": this.state.department
                },
                "bcmDesignationId": this.state.designation
            },
            "bcmOrganization": {
                "bcmOrganizationId": 2 // sessionStorage.orgId
            },
            "bcmUserGroup": {
                "bcmUserGroupId": this.state.selectedRole
            },
            "clientPlantMasterList": clientPlantMasterId,
            "bcmUserId": null,
            "firstName": this.state.empName,
            "lastName": "",
            "password": "Bcm@123",
            "isActive": 1,
            "phoneNumber": this.state.phoneNumber,
            "reportingManagerId": this.state.reportingTo,
            "userCode": this.state.userCode,
            "username": this.state.userCode
        }
        this.setState({ pageLoader: true });
        DataManagementService.saveUserObject(Request).then(Response => {
            this.props.AddEmpHealthModelShowHide();
            this.props.refreshList();
            this.setState({ pageLoader: false });
        });
    }
    handlePlantChange = (e) => {
        var plantId = e.target.value
        this.setState({ selectedPlant: plantId });
    }
    handleRoleChange = (e) => {
        var selectedRole = e.target.value
        this.setState({ selectedRole: selectedRole });
    }
    getPlantsByManager = () => {
        RosterManagementService.getPlantsBasedOnUser().then(response => {
            if (response.data != null) {
                let tempObj = [];
                var plants = response.data;
                // this.setState({
                //     plants: plants               
                // });
                for (var i = 0; i < response.data.length; i++) {
                    tempObj.push({
                        'id': response.data[i].clientPlantMasterId,
                        'name': response.data[i].plantName
                    });
                }
                this.setState({
                    plants: tempObj
                });
            }
        });
    }
    userCodeEvent = (object) => {
        this.setState({ userCode: object.target.value });
    }
    empNameEvent = (object) => {
        this.setState({ empName: object.target.value });
    }
    phoneNumberEvent = (object) => {
        const re = /^[0-9\b]+$/;
        if (object.target.value === '' || re.test(object.target.value)) {
            this.setState({ phoneNumber: object.target.value, phoneNumberClone: object.target.value });
        }
    }
    selectDepartment = (object) => {
        this.setState({ department: object.target.value, DesignationListLoder: true });
        this.getDesignationList(object.target.value);
    }
    selectDesignation = (object) => {
        this.setState({ designation: object.target.value });
    }
    getEmployeeList = (searchText) => {
        const url = UrlConstants.getEmployeeBySearchUrl + searchText;
        this.setState({ isLoading: true });
        GenericApiService.getAll(url).then(Response => {
            if (Response.data.length != 0) {
                Response.data.filter(user => {
                    user.fullName = user.firstName + ' ' + user.lastName;
                })
                this.setState({
                    employeeList: Response.data,
                    isLoading: false
                });
            } else {
                this.setState({
                    employeeList: [],
                    isLoading: false
                });
            }

        }).catch(error => {

        })
    }
    employeeCode = (e) => {
        if (e.length === 0) {
            this.setState({
                reportingTo: '',
                taskAssigneeName: ''
            });
            return false;
        } else {
            const user = e[0];
            this.setState({
                reportingTo: user.bcmUserId,
                taskAssigneeName: user.firstName + ' ' + user.lastName
            });
        }
    }
    onSelect = (selectedList, selectedItem) => {
        this.setState({ selectedPlants: selectedList });
    }
    onRemove = (selectedList, removedItem) => {
        this.setState({ selectedPlants: selectedList });
    }
    validForm() {
        return this.state.userCode == '' || this.state.empName == '' || this.state.department == '' || this.state.designation == '' ||
            this.state.phoneNumber.length < 10 || this.state.reportingTo == '' || this.state.selectedPlants.length == 0 || this.state.selectedRole == '';
    }

    render() {
        return (
            <Modal id="dataEmpAdd" className="addShiftModel" show={this.state.AddEmpHealthModelShow}
                onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.state.pageLoader ? (
                            <div className="loader">
                                <Spinner animation="grow" variant="dark">
                                </Spinner>
                            </div>
                        ) : null
                    }
                    <Row>
                        <Col xs={12} sm="12" xl="12" className="order-1 order-sm-1">
                            <Row className="align-items-center">
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Multiselect options={this.state.plants} // Options to display in the dropdown
                                            selectedValues={this.state.selectedPlants} // Preselected value to persist in dropdown
                                            onSelect={this.onSelect} // Function will trigger on select event
                                            onRemove={this.onRemove} // Function will trigger on remove event
                                            displayValue="name" // Property name to display in the dropdown options
                                        />
                                        {
                                            this.state.selectedPlants.length == 0 && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please select branch </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Employee Code</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control type="text" name="userCode" onChange={this.userCodeEvent.bind(this)}
                                            value={this.state.userCode} placeholder="employee code" maxLength="10" />
                                        {
                                            this.state.userCode == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please enter the employee code </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Employee Name</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control type="text" name="employeeName" onChange={this.empNameEvent.bind(this)}
                                            value={this.state.empName} placeholder="Employee Name" />
                                        {
                                            this.state.empName == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please enter the employee name </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Department</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.department}
                                            name="clientPlantMasterId" onChange={this.selectDepartment.bind()}>
                                            <option value="">Department</option>
                                            {this.state.departmentList.map((Object, index) =>
                                                <option key={index} value={Object.bcmDepartmentId}>
                                                    {Object.name}
                                                </option>)}
                                        </Form.Control>
                                        {
                                            this.state.department == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please select department </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} sm="12" xl="12" className="order-2 order-sm-3">
                            <Row>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Designation</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    {
                                        this.state.DesignationListLoder ? (
                                            <div className="loader">
                                                <Spinner animation="grow" variant="dark">
                                                </Spinner>
                                            </div>
                                        ) : null
                                    }
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.designation}
                                            name="clientPlantMasterId" onChange={this.selectDesignation.bind()}>
                                            <option value="">Designation</option>
                                            {this.state.designationList.map((Object, index) =>
                                                <option key={index} value={Object.bcmDesignationId}>
                                                    {Object.name}
                                                </option>)}
                                        </Form.Control>
                                        {
                                            this.state.designation == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please select designation </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>

                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Contact Number</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control type="text" name="phoneNumber" maxLength="10" placeholder="Contact number"
                                            onChange={this.phoneNumberEvent.bind(this)} value={this.state.phoneNumber} />
                                        {
                                            this.state.submitflag == 1 ? (
                                                this.state.phoneNumber == '' ? (
                                                    <Form.Text className="error-msg"> Please enter the contact number </Form.Text>
                                                ) : (
                                                        this.state.phoneNumber.length < 10 ? (
                                                            <Form.Text className="error-msg"> Contact number should be 10 digit number </Form.Text>
                                                        ) : null
                                                    )
                                            ) : (
                                                    this.state.phoneNumberClone.length == 0 ? (
                                                        <Form.Text className="error-msg"> Please enter the contact number </Form.Text>
                                                    ) : (
                                                            this.state.phoneNumberClone.length < 10 ? (
                                                                <Form.Text className="error-msg"> Contact number should be 10 digit number </Form.Text>
                                                            ) : null
                                                        )
                                                )
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Reporting To </Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group controlId="empId">
                                        <AsyncTypeahead
                                            id="basic-typeahead-example" labelKey="fullName"
                                            isLoading={this.state.isLoading}
                                            onChange={this.employeeCode}
                                            options={this.state.employeeList}
                                            onSearch={this.getEmployeeList} placeholder="Reporting To"
                                        />
                                        {
                                            this.state.taskAssigneeName == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please select reporting to user </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="4" xl="3" className="addPlantForm">
                                    <Form.Label>Role</Form.Label>
                                </Col>
                                <Col xs={9} sm="8" xl="9 pl-3" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.selectedRole}
                                            placeholder="Select role" onChange={this.handleRoleChange.bind(this)}>
                                            <option value="">Select role</option>
                                            {this.state.getAllUserGroupListByIdAndName.map((role, index) =>
                                                <option key={index} value={role.bcmUserGroupId}>{role.userGroup}</option>
                                            )}
                                        </Form.Control>
                                        {
                                            this.state.selectedRole == '' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Please select role </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn order-3 order-sm-4">
                            <button className="btn" onClick={this.setModalHide}>Cancel</button>
                            <button className={this.validForm() == false ? 'verify-btn-green btn' : 'btn'} onClick={this.handleSubmit}>Save</button>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>

        )
    }
}

export default AddEmpHealth;
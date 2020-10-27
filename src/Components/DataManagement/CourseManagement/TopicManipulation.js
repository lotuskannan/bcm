import Axios from 'axios';
import React, { Component } from 'react'
import { Row, Col, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import uploadIcon from '../../../assets/images/Browse-Image.svg';
import rightArrow from '../../../assets/images/ic-chevron-down.svg';
import BaseUrl from '../../../Service/BaseUrl';
import sharingService from '../../../Service/DataSharingService';
import * as CourseManagementService from './CourseManagementService';

class TopicManipulation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addTopicModelShow: false,
            orgName: sessionStorage.orgName,
            courseObject: JSON.parse(sessionStorage.seletedCourseObject),
            categoryName: JSON.parse(sessionStorage.seletedCourseObject).categoryName,
            categoryId: JSON.parse(sessionStorage.seletedCourseObject).categoryId,
            courseName: '',
            code: '',
            description: '',
            isError: {
                courseName: '',
                code: '',
                description: ''
            },
            isActive: true,
            showMessage: '',
            message: '',
            Loader: '',
            topicList: [],
            editTopicObject: [],
            manipulation: 'Add Topic',
            deleteTopic: [],
            deleteModal: false,
            formLoader: false,
            dModalLoader: false,
            errorMessage: '',
            courseList: [],
            listStatus: true
        }
    }
    componentDidMount() {
        this.getTopicList();
        this.getCourseList();
    }


    getTopicList = () => {
        let categoryId = this.state.courseObject.categoryId;
        this.setState({ Loader: true });
        var reqobj = { isActive: this.state.listStatus, categoryId: categoryId };
        CourseManagementService.getListTopic(reqobj).then(response => {
            this.setState({ topicList: response.data });
            this.setState({ Loader: false });
        }).catch(error => {
            this.setState({ Loader: false });
        });
    }

    getCourseList = () => {
        const orgId = sessionStorage.orgId;
        const token = sessionStorage.token;
        var payload = { organisationId: orgId };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/category/courseManagementViewList";
        Axios(url, {
            method: 'POST',
            data: payload,
            headers: {
                'content-type': 'application/json',
                'token': token
            }
        })
            .then(response => {
                this.setState({ Loader: false });
                if (response.data.status.success == "Success") {
                    this.setState({
                        courseList: response.data.data
                    });
                }
            }).catch(error => {
                this.setState({ Loader: true });
            })
    }

    addTopic = () => {
        this.showTopicModal(true);
        this.setState({ manipulation: 'Add Topic' });
    }

    showTopicModal = (value) => {
        this.setState({ addTopicModelShow: value });
        if (!value) {
            this.resetForm();
        }
    }
    resetForm = () => {
        this.setState({
            courseName: '',
            code: '',
            description: '',
            isError: {
                courseName: '',
                code: '',
                description: ''
            },
            isActive: true,
            dModalLoader: false,
            formLoader: false,
            errorMessage: ''

        });
    }
    goTopicPage = (page) => {
        const activeCPT = page;
        sessionStorage.activeCPT = activeCPT;
        sharingService.sendMessage('activeCPT');
    }
    topicNameValidator = (Param) => {
        var returnMsg = '';
        var pattern = /^([a-zA-Z0-9 _-]+)$/;

        if (Param.length == 0) {
            returnMsg = 'Topic name is required';
        } else if (!pattern.test(Param)) {
            returnMsg = 'Unsupported text format.';
        } else if (Param.length < 3) {
            returnMsg = 'Topic name must be atleast 3 characters required.';
        }
        else {
            returnMsg = '';
        }
        return returnMsg;
    }

    topicCodeValidator = (Param) => {
        var returnMsg = '';
        var pattern = /^([a-zA-Z0-9_-]+)$/;

        if (Param.length == 0) {
            returnMsg = 'Topic code is required';
        } else if (!pattern.test(Param)) {
            returnMsg = 'Unsupported text format.';
        } else if (Param.length < 3) {
            returnMsg = 'Topic code must be atleast 3 characters required.';
        }
        else {
            returnMsg = '';
        }
        return returnMsg;
    }
    descriptionValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Description is required';
        } else if (Param.length < 3) {
            returnMsg = 'Description must be atleast 3 characters required.';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    handleValueChange = (e) => {
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "courseName":
                isError.courseName = this.topicNameValidator(value)
                break;
            case "code":
                isError.code = this.topicCodeValidator(value)
                break;
            case "description":
                isError.description = this.descriptionValidator(value)
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [name]: value
        });
    }
    submiTopic = () => {
        if (this.validForm()) {
            const { manipulation, courseName } = this.state;
            let RequestObject = this.setPayload();
            var formData = new FormData();
            formData.append("image", undefined);
            formData.append("courseObject", JSON.stringify(RequestObject));
            this.setState({ formLoader: true, errorMessage: '' });
            CourseManagementService.saveTopic(formData).then(response => {

                if (response.status.success == 'Success') {
                    this.showTopicModal(false);
                    const message = `${courseName} topic ${manipulation == 'Add Topic' ? 'created' : 'updated'} successfully`;
                    this.showNotification(message);
                    this.getTopicList();
                }
                else {
                    this.setState({
                        formLoader: false,
                        errorMessage: response.status.message,
                    });
                }
            }).catch(error => {
                this.setState({ formLoader: false });

            });
        } else {
            let isError = { ...this.state.isError };
            isError.code = this.topicCodeValidator(this.state.code);
            isError.courseName = this.topicNameValidator(this.state.courseName);
            isError.description = this.descriptionValidator(this.state.description);
            this.setState({ isError: isError });
        }
    }
    validForm = () => {
        var valid;
        if (this.state.code.trim().length == 0 ||
            this.state.courseName.trim().length == 0 ||
            this.state.description.trim().length == 0) {
            valid = false;
        } else {
            valid = true;
        }
        return valid;
    }
    editTopic = (value) => {
        this.showTopicModal(true);
        this.setState({ formLoader: true, manipulation: 'Edit Topic' });
        const token = sessionStorage.token;
        const { listStatus } = this.state;
        var payload = { courseId: value.courseId, isActive: listStatus };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/course/params";
        Axios(url, {
            method: 'POST',
            data: payload,
            headers: {
                'content-type': 'application/json',
                'token': token
            }
        })
            .then(response => {
                this.setState({ formLoader: false });
                if (response.data.status.success == "Success") {
                    this.setState({
                        editTopicObject: response.data.data,
                        isActive: response.data.data.isActive,
                        courseName: response.data.data.name,
                        code: response.data.data.code,
                        description: response.data.data.description
                    });
                }
            }).catch(error => {
                this.setState({ formLoader: true });
            })
    }
    deleteTopicObject = (Object) => {
        this.setState({ deleteModal: true });
        this.setState({ deleteTopic: Object });
    }
    hideDeleteTopicModel = () => {
        this.setState({ deleteModal: false, deleteTopic: [] });
    }
    deleteTopic = () => {
        let deleteTopicReq = {
            "courseId": this.state.deleteTopic.courseId,
            "organisationId": this.state.deleteTopic.organisationId,
            "category": {
                "categoryId": this.state.deleteTopic.categoryId
            }
        };
        this.setState({ dModalLoader: true });
        CourseManagementService.deleteTopic(deleteTopicReq).then(response => {
            this.setState({ deleteModal: false, dModalLoader: false });
            const message = `${this.state.deleteTopic.courseName} topic deleted successfully`;
            this.showNotification(message);
            this.getTopicList();
        }).catch(error => {

        });
    }
    goSectionPage = (page, value) => {
        const activeCPT = page;
        sessionStorage.activeCPT = activeCPT;
        sessionStorage.seletedTopicObject = JSON.stringify(value);
        sharingService.sendMessage('activeCPT');
    }

    setPayload() {
        let RequestObject;
        const { code, courseName, description, isActive, } = this.state;
        if (this.state.manipulation == 'Add Topic') {
            RequestObject = {
                name: courseName,
                code: code,
                isActive: isActive,
                description: description,
                visibility: true,
                organisationId: this.state.courseObject.organisationId,
                launchUrl: '',
                category: {
                    categoryId: this.state.courseObject.categoryId
                },
                createdBy: 1,
                createdOn: new Date(),
                updatedBy: 1,
                updatedOn: new Date()
            };
        } else {
            RequestObject = this.state.editTopicObject;
            RequestObject.name = courseName;
            RequestObject.code = code;
            RequestObject.isActive = isActive;
            RequestObject.description = description;
            RequestObject.createdOn = new Date();
            RequestObject.updatedOn = new Date();
        }
        return RequestObject;
    }
    showNotification(message) {
        if (message) {
            this.setState({
                message: message,
                showMessage: true
            });
            setTimeout(() => {
                this.setState({
                    message: '',
                    showMessage: false
                });
            }, 3000);
        }
    }

    changeCourse = (course) => {

        let categoryId = course.target.value;
        const { courseList } = this.state;
        let index = courseList.findIndex(c => c.categoryId == categoryId);
        this.setState({
            categoryId: categoryId,
            courseObject: courseList[index]
        }, () => {
            this.getTopicList();
        });
    }

    onChangeStatus = (e) => {
        let listStatus = e.target.checked;
        this.setState({ listStatus }, e => {
            this.getTopicList();
        });
    }

    render() {
        const { orgName, categoryName, isError, code, courseName, courseList, categoryId, listStatus,
            formLoader, description, isActive, manipulation, dModalLoader, addTopicModelShow,
            showMessage, message, Loader, deleteModal, topicList, errorMessage } = this.state;
        const columns = [
            {
                dataField: 'courseName',
                text: 'Topic Name',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goSectionPage(3, cell)}>
                        <span>
                            {cell.courseName}
                        </span>
                    </div>)
            }, {
                dataField: 'courseCode',
                text: 'Code',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goSectionPage(3, cell)}>
                        <span>
                            {cell.courseCode}
                        </span>
                    </div>)
            },
            {
                dataField: 'orgName',
                text: 'Organisation',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goSectionPage(3, cell)}>
                        <span>
                            {cell.orgName}
                        </span>
                    </div>)
            },
            {
                dataField: 'visibility',
                text: 'Status',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goSectionPage(3, cell)}>
                        <span>
                            {cell.visibility == true ? 'Active' : 'InActive'}
                        </span>
                    </div>)
            },
            {
                text: 'Action',
                formatter: (row, cell) => (
                    <div className="action-btn" style={{ cursor: 'auto' }} >
                        <i className="icon-edit" style={{ cursor: 'pointer' }} onClick={e => this.editTopic(cell)}></i>
                        <i className="icon-delete" style={{ cursor: 'pointer' }} onClick={e => this.deleteTopicObject(cell)}></i>
                    </div>)
            }
        ];
        return (
            <div className="course-management">
                <div className="row mx-0 align-items-center course-management-row">
                    <div className="col pl-0 table-header-title">
                        <p className="mb-0">
                            <span className="rightArrow cursor-pointer" onClick={e => this.goTopicPage(1)}>
                                {orgName}<img src={rightArrow} alt="Right Arrow" /></span>
                            {/* {categoryName} */}
                        </p>
                        <div className="course-management-select">
                            <Form.Group>
                                <Form.Control as="select" value={categoryId} onChange={this.changeCourse}>
                                    {courseList.map((course, index) => <option value={course.categoryId} key={index}>{course.categoryName}</option>)}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>
                    <div className="col ml-auto table-header">
                        <div> <Form.Check type="switch" id="custom-switch1" checked={listStatus} onChange={this.onChangeStatus} label={listStatus ? "Active" : 'In Active'} /></div>
                        <button className="btn ml-3" onClick={this.addTopic}>Add Topic</button>
                    </div>
                </div>
                {showMessage ? <Alert variant="dark" className="mark">
                <div className="alert-container"><p> <i className="icons"></i> {message}</p></div>

                </Alert> : <></>}
                {Loader ? <div className="loader">
                    <Spinner animation="grow" variant="dark" />
                </div> : <></>}

                <div className="tableList">
                    <div className="accordion__item">
                        <div className="accordion__button">
                            <div className="accordionHeader">
                                <div><h5>Course Details</h5></div>
                            </div>
                        </div>
                    </div>
                    <div className="accordionTable">
                        <BootstrapTable keyField='id' data={topicList} columns={columns} bordered={false} />
                    </div>
                </div>

                {/* Modal  */}
                <Modal id="addTopicModal" className="addShiftModel" show={addTopicModelShow} onHide={e => this.showTopicModal(false)} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="pl-1">{manipulation}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-0">
                        {formLoader ? <div className="loader">
                            <Spinner animation="grow" variant="dark" />
                        </div> : <></>}
                        <Row>
                            {errorMessage.length > 0 && <Form.Text className="error-msg">{errorMessage}</Form.Text>}
                            <Col xl="12">
                                <Row className="align-items-center">
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Organisation</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="ShiftName"
                                                placeholder="Organisation" disabled value={this.state.courseObject.orgName} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Course Name</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" disabled name="ShiftName"
                                                placeholder="Course Name" value={this.state.courseObject.categoryName} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Topic Name <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="courseName"
                                                value={courseName} placeholder="Topic Name" onChange={this.handleValueChange} />
                                            {isError.courseName.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.courseName} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Topic Code <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="code"
                                                value={code} placeholder="Topic Code" onChange={this.handleValueChange} />
                                            {isError.code.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.code} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Description <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="description"
                                                value={description} placeholder="Description" onChange={this.handleValueChange} />
                                            {isError.description.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.description} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm mt-4">
                                        <Form.Label>Status</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm mt-4">
                                        {
                                            //     <Form.Group className="toggle-switch">
                                            //     <input type="checkbox" id="switch"  checked={false} />
                                            //     <label for="switch">Toggle</label>
                                            //     <span className="ml-2">Active</span>
                                            // </Form.Group>
                                        }
                                        <Form.Check type="switch" id="custom-switch"
                                            onChange={e => this.setState({ isActive: !isActive })}
                                            label={isActive == false ? 'In Active' : 'Active'}
                                            checked={isActive} />
                                    </Col>
                                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                                        <button className="btn white-color-bg" onClick={e => this.showTopicModal(false)}>Cancel</button>
                                        <button className="btn black-color-bg" onClick={this.submiTopic}>Save</button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Modal id="addSectionModal" className="confirmation-delete" show={deleteModal}
                    onHide={this.hideDeleteTopicModel} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-0">
                        {dModalLoader ? <div className="loader">
                            <Spinner animation="grow" variant="dark" />
                        </div> : <></>}
                        <Row>
                            <Col xl="12 text-center" className="modal-btn rosterManagement-btn">
                                <p className="mt-2 mb-4">Are you sure want to delete this <b>{this.state.deleteTopic.courseName}</b> topic ? </p>
                                <button className="btn white-color-bg" onClick={this.hideDeleteTopicModel}>Cancel</button>
                                <button className="btn black-color-bg" onClick={this.deleteTopic}>Delete</button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default TopicManipulation

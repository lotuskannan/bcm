import React, { Component } from 'react'
import { Row, Col, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import uploadIcon from '../../../assets/images/Browse-Image.svg';
import BaseUrl from '../../../Service/BaseUrl';
import Axios from 'axios';
import sharingService from '../../../Service/DataSharingService';

class CourseManipulation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addCourseModal: false,
            courseList: [],
            Loader: false,
            orgName: sessionStorage.orgName,
            isActive: true,
            categoryName: '',
            description: '',
            isError: {
                categoryName: '',
                description: '',
                image: ''
            },
            image: '',
            errorMessage: '',
            modalLoader: false,
            deleteModal: false,
            dModalLoader: false,
            deleteCourseName: '',
            editCategoryObject: '',
            manipulation: 'Add Course',
            message: '',
            showMessage: false,
            selectedFile: '',
            listStatus: true

        }


    }

    componentDidMount() {
        this.getCourseList();
    }

    getCourseList = () => {
        this.setState({ Loader: true });
        const orgId = sessionStorage.orgId;
        const token = sessionStorage.token;
        var payload = { organisationId: orgId, isActive: this.state.listStatus };
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

    addcourse = () => {
        this.showAddCourseModal(true);
        this.setState({
            manipulation: 'Add Course',
        });
    }
    showAddCourseModal = (value) => {
        this.setState({
            addCourseModal: value,
        });
        if (value == false) {
            this.resetForm();
        }
    }


    courseNameValidator = (Param) => {
        var returnMsg = '';
        var pattern = /^([a-zA-Z0-9 _-]+)$/;
        if (Param.length == 0) {
            returnMsg = 'Course name is required';
        } else if (!pattern.test(Param)) {
            returnMsg = 'Unsupported text format.';
        } else if (Param.length < 3) {
            returnMsg = 'Course name must be atleast 3 characters required.';
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
        }
        else {
            returnMsg = '';
        }
        return returnMsg;
    }

    imageValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Image is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    handleValueChange = (e) => {
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "categoryName":
                isError.categoryName = this.courseNameValidator(value)
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

    submitCourse = () => {
        const { manipulation, categoryName, description, image, isActive, selectedFile } = this.state;

        if (this.validForm()) {
            const orgId = sessionStorage.orgId;
            const token = sessionStorage.token;
            var reqObj = this.setPayload(categoryName, description, isActive, orgId);
            var formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("categoryObject", JSON.stringify(reqObj));
            this.setState({ modalLoader: true, errorMessage: '' });
            const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/category";
            Axios(url, {
                method: 'POST',
                data: formData,
                headers: {
                    'content-type': 'application/json',
                    'token': token
                }
            }).then(response => {
                this.setState({ modalLoader: false });
                if (response.data.status.success == "Success") {
                    const message = `${categoryName} course ${manipulation == 'Add Course' ? 'created' : 'updated'} successfully`;
                    this.showNotification(message);
                    this.resetForm();
                    this.getCourseList();
                } else {
                    this.setState({ errorMessage: response.data.status.message });
                }
            }).catch(error => {
                this.setState({ modalLoader: false });
            })
        } else {
            let isError = { ...this.state.isError };
            isError.description = this.descriptionValidator(description);
            isError.categoryName = this.courseNameValidator(categoryName);
            isError.image = this.imageValidator(image);

            if (manipulation == 'Update Course') {
                isError.image = '';
            }
            this.setState({ isError: isError });
        }
    }

    validForm = () => {

        var valid;
        const { manipulation, categoryName, description, image } = this.state;
        if (this.courseNameValidator(categoryName) == ''
            && this.descriptionValidator(description) == '' &&
            (manipulation == 'Add Course' ? this.imageValidator(image) == '' : true)) {
            valid = true;
        }
        else {
            valid = false;
        }
        return valid;
    }

    goTopicPage = (page, Object) => {
        const activeCPT = page;
        sessionStorage.activeCPT = activeCPT;
        sessionStorage.seletedCourseObject = JSON.stringify(Object);
        sharingService.sendMessage('activeCPT');
    }

    handleFileChange = (event) => {
        const { target } = event;
        const { files } = target;
        let isError = { ...this.state.isError };
        let selectedFile = '';
        let image = '';
        if (files && files[0]) {
            var reader = new FileReader();
            var name = files[0].name.split('.')[1];
            if (!files[0].name.match(/\s/g)) {
                if (name.includes(name.toUpperCase()) == false) {
                    if (files[0].size < 1000000) {
                        reader.onloadstart = () => this.setState({ loading: true });
                        isError.image = '';
                        reader.onload = event => {
                            this.setState({
                                loading: false,
                                selectedFile: files[0],
                                image: event.target.result,
                                isError
                            });
                        };
                        reader.readAsDataURL(files[0]);

                    } else {
                        isError.image = 'File size should not Exceeds 1MB';
                        image = ''
                        selectedFile = '';
                        this.setState({ isError, image, selectedFile });

                    }
                } else {
                    isError.image = 'Image extension should be lower case like .png'
                    image = ''
                    selectedFile = '';
                    this.setState({ isError, image, selectedFile });
                }
            } else {
                isError.image = 'File name should not contain space.'
                image = ''
                selectedFile = '';
                this.setState({ isError, image, selectedFile });
            }
        }
    }

    fileTrigger = () => {
        document.getElementById("fileName").click();
    }

    // Edit Course Code
    editCourse = (value) => {
        this.showAddCourseModal(true);
        this.setState({
            manipulation: 'Update Course',
            modalLoader: true
        });
        const token = sessionStorage.token;
        const { listStatus } = this.state;
        var payload = { categoryId: value.categoryId, isActive: listStatus };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/category/params";
        Axios(url, {
            method: 'POST',
            data: payload,
            headers: {
                'content-type': 'application/json',
                'token': token
            }
        })
            .then(response => {
                this.setState({ modalLoader: false });
                if (response.data.status.success == "Success") {
                    this.setState({
                        editCategoryObject: response.data.data,
                        isActive: response.data.data.isActive,
                        categoryName: response.data.data.name,
                        description: response.data.data.description,
                    });
                }
            }).catch(error => {
                this.setState({ modalLoader: true });
            })

    }


    // Course Delete Code 
    showDeleteModal = (value) => {
        this.setState({ deleteModal: value })
    }
    deleteCourse = () => {
        this.setState({ dModalLoader: true });
        const orgId = sessionStorage.orgId;
        const token = sessionStorage.token;
        const { manipulation, deleteCourseName } = this.state;
        var payload = {
            categoryId: this.state.categoryId,
            organisation: { organisationId: orgId }
        };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/category";
        Axios(url, {
            method: 'DELETE',
            data: payload,
            headers: {
                'content-type': 'application/json',
                'token': token
            }
        })
            .then(response => {
                this.setState({ dModalLoader: false });
                if (response.data.Status == "Success") {
                    const message = `${deleteCourseName} course deleted successfully`;
                    this.showNotification(message);
                    this.getCourseList();
                    this.showDeleteModal(false);
                }
            }).catch(error => {
                this.setState({ dModalLoader: true });
            })
    }
    openDaleteModal = (value) => {
        this.setState({ categoryId: value.categoryId, deleteCourseName: value.categoryName });
        this.showDeleteModal(true);
    }

    resetForm = () => {
        this.setState({
            modalLoader: false,
            addCourseModal: false,
            dModalLoader: false,
            isActive: true,
            categoryName: '',
            description: '',
            isError: {
                categoryName: '',
                description: '',
                image: ''
            },
            image: '',
            errorMessage: '',
            manipulation: 'Add Course',
            selectedFile: ''
        });
    }

    setPayload = (categoryName, description, isActive, orgId) => {
        var reqObj;
        reqObj = {
            name: categoryName,
            description: description,
            isActive: isActive,
            organisation: { organisationId: orgId },
            createdBy: 1,
            createdOn: new Date(),
            updatedBy: 1,
            updatedOn: new Date()
        };

        if (this.state.editCategoryObject) {
            reqObj = this.state.editCategoryObject;
            reqObj.name = categoryName;
            reqObj.description = description;
            reqObj.isActive = isActive;
            reqObj.organisation = { organisationId: orgId };
            reqObj.createdOn = new Date();
            reqObj.updatedOn = new Date();
        }
        return reqObj;
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

    onChangeStatus = (e) => {

        let listStatus = e.target.checked;
        this.setState({ listStatus }, e => {
            this.getCourseList();
        });
    }

    render() {

        const { courseList, orgName, isActive, listStatus,
            Loader, modalLoader, dModalLoader, deleteModal, deleteCourseName,
            categoryName, manipulation, errorMessage, showMessage, message,
            description, isError, image } = this.state;
        const columns = [
            {
                dataField: 'categoryName',
                text: 'Course Name',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goTopicPage(2, cell)}>
                        <span>
                            {cell.categoryName}
                        </span>
                    </div>)

            },
            {
                dataField: 'orgName',
                text: 'Organisation',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goTopicPage(2, cell)}>
                        <span>
                            {cell.orgName}
                        </span>
                    </div>)

            },
            {
                dataField: 'isActive',
                text: 'Status',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left" style={{ cursor: 'pointer' }} onClick={e => this.goTopicPage(2, cell)}>
                        <span>
                            {cell.isActive ? 'Active' : 'In Active'}
                        </span>
                    </div>)

            },
            {
                dataField: '',
                text: 'Action',
                formatter: (row, cell) => (
                    <div className="action-btn" style={{ cursor: 'auto' }}>
                        <i className="icon-edit" style={{ cursor: 'pointer' }} onClick={e => this.editCourse(cell)}></i>
                        <i className="icon-delete" style={{ cursor: 'pointer' }} onClick={e => this.openDaleteModal(cell)} ></i>
                    </div>)
            }

        ];
        return (
            <div className="course-management">
                {showMessage ? <Alert variant="dark" className="mark">
                <div className="alert-container"><p> <i className="icons"></i> {message}</p></div>
                    
                </Alert> : null}
                <div className="row mx-0 align-items-center course-management-row">
                    <div className="col pl-0 table-header-title">
                        <p className="mb-0">{orgName}</p>
                    </div>
                    <div className="col ml-auto table-header">
                        <div> <Form.Check type="switch" id="custom-switch1" checked={listStatus} onChange={this.onChangeStatus} label={listStatus ? "Active" : 'In Active'} /></div>
                        <button className="btn">Assign</button>
                        <button className="btn ml-3" onClick={this.addcourse}>Add Course</button>
                    </div>
                </div>
                <div className="tableList">
                    {Loader ? <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                    </div> : null}
                    <div className="accordion__item">
                        <div className="accordion__button">
                            <div className="accordionHeader">
                                <div><h5>Course Details</h5></div>
                            </div>
                        </div>
                    </div>
                    <div className="accordionTable">
                        <BootstrapTable keyField='categoryId' data={courseList} columns={columns} bordered={false} />
                    </div>
                </div>

                {/* Course Add Modal  */}
                <Modal id="addCourseModal" className="addShiftModel" show={this.state.addCourseModal} onHide={e => this.showAddCourseModal(false)} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="pl-1">{manipulation}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-0">
                        {modalLoader ? <div className="loader">
                            <Spinner animation="grow" variant="dark" />
                        </div> : null}
                        <Row>
                            {errorMessage.length > 0 && <Form.Text className="error-msg">{errorMessage}</Form.Text>}
                            <Col xl="12">
                                <Row className="align-items-center">
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Organisation</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" value={orgName} name="orgName" placeholder="Organization Name" disabled />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Course Name  <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Course Name" onChange={this.handleValueChange} name="categoryName" value={categoryName} />
                                            {isError.categoryName.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.categoryName} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Description   <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="description" value={description} onChange={this.handleValueChange} />
                                            {isError.description.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.description} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Upload Banner </Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <div className="media-upload mt-2" onClick={this.fileTrigger}>
                                            <input type="file" style={{ display: 'none' }}
                                                id="fileName" name="fileName" accept="image/png, image/jpeg,image/jpg"
                                                onChange={this.handleFileChange} />
                                            {image ?
                                                <img src={image} style={{ height: '100px' }} alt="Course Image" /> :
                                                (<p className="mb-0"><img src={uploadIcon} alt="Browse Image" /> Browse Image </p>)}
                                        </div>
                                        <p className="guide-text">Only jpeg, png and jpg files are allowed. Maximum upload file size 1MB</p>
                                        {isError.image.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.image} </Form.Text>
                                        )}
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm mt-4">
                                        <Form.Label>Status </Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm mt-4">
                                        {/* <Form.Group className="toggle-switch">
                                            <input type="checkbox" id="switch" checked={isActive} onChange={e => this.setState({ isActive: !isActive })} />
                                            <label htmlFor="switch">Toggle</label>
                                            <span className="ml-2">{isActive ? 'Active' : 'In Active'}</span>
                                        </Form.Group> */}
                                        <Form.Check type="switch" id="custom-switch"
                                            onChange={e => this.setState({ isActive: !isActive })}
                                            label={isActive == false ? 'In Active' : 'Active'}
                                            checked={isActive} />
                                    </Col>
                                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                                        <button className="btn white-color-bg" onClick={e => this.showAddCourseModal(false)}>Cancel</button>
                                        <button className={"btn black-color-bg"} onClick={this.submitCourse}>Save</button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                {/* Course DeleteModal */}
                <Modal id="addSectionModal" className="confirmation-delete" show={deleteModal} onHide={e => this.showDeleteModal(false)} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-0">
                        {dModalLoader ? <div className="loader">
                            <Spinner animation="grow" variant="dark" />
                        </div> : null}
                        <Row>
                            <Col xl="12 text-center" className="modal-btn rosterManagement-btn">
                                <p className="mt-2 mb-4">Are you sure want to Delete this <b>{deleteCourseName}</b> Course ? </p>
                                <button className="btn white-color-bg" onClick={e => this.showDeleteModal(false)}>Cancel</button>
                                <button className="btn black-color-bg" onClick={this.deleteCourse}>Delete</button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>


        )
    }
}

export default CourseManipulation

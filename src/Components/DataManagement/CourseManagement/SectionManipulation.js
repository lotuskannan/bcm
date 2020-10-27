import React, { Component } from 'react'
import { Row, Col, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import uploadIcon from '../../../assets/images/Browse-Image.svg';
import rightArrow from '../../../assets/images/ic-chevron-down.svg';
import Axios from 'axios';
import BaseUrl from '../../../Service/BaseUrl';
import sharingService from '../../../Service/DataSharingService';
import * as CourseManagementService from './CourseManagementService';

class SectionManipulation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: JSON.parse(sessionStorage.seletedTopicObject).courseId,
            selectedTopic: JSON.parse(sessionStorage.seletedTopicObject),
            sectionList: [],
            sectionModel: false,
            deleteModal: false,
            dModalLoader: false,
            modalLoader: false,
            Loader: false,
            deleteSectionName: '',
            lessonId: '',
            sectionName: '',
            isActive: true,
            code: '',
            description: '',
            fileName: '',
            isError: {
                fileName: '',
                sectionName: '',
                code: '',
                description: '',
            },
            manipulation: 'Add Section',
            errorMessage: '',
            message: '',
            showMessage: false,
            selectedFile: '',
            topicList: [],
            listStatus: true
        }
    }

    componentDidMount() {
        this.getSectionList();
        this.getTopicList();
    }

    getSectionList = () => {
        this.setState({ Loader: true });
        const { courseId, listStatus } = this.state;
        const token = sessionStorage.token;
        var payload = { isActive: listStatus, courseId: courseId };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/lesson/courseManagementViewList";
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
                        sectionList: response.data.data
                    });
                }
            }).catch(error => {
                this.setState({ Loader: true });
            })
    }

    getTopicList = () => {
        let categoryId = this.state.selectedTopic.categoryId;
        // this.setState({ Loader: true });
        var req = { isActive: true, categoryId: categoryId };
        CourseManagementService.getListTopic(req).then(response => {
            this.setState({ topicList: response.data });
            this.setState({ Loader: false });
        }).catch(error => {
            this.setState({ Loader: false });
        });
    }

    addSection = () => {
        this.setState({ manipulation: 'Add Section' });
        this.showSectionModel(true);
    }
    showSectionModel = (value) => {
        this.setState({
            sectionModel: value
        });
        if (!value) {
            this.resetForm();
        }
    }
    showDeleteModal = (value) => {
        this.setState({
            deleteModal: value
        })
    }
    goSectionPage = (page) => {
        const activeCPT = page;
        sessionStorage.activeCPT = activeCPT;
        sharingService.sendMessage('activeCPT');
    }

    openDaleteModal = (value) => {
        this.setState({ lessonId: value.lessonId, deleteSectionName: value.lessonName });
        this.showDeleteModal(true);
    }

    deleteSection = () => {
        this.setState({ dModalLoader: true });
        const token = sessionStorage.token;
        var payload = {
            lessonId: this.state.lessonId,
        };

        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/lesson";
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
                    const message = `${this.state.deleteSectionName} section deleted successfully`;
                    this.showNotification(message);
                    this.getSectionList();
                    this.showDeleteModal(false);
                } else {

                }
            }).catch(error => {
                this.setState({ dModalLoader: true });
            })
    }

    submitForm = () => {
        const { sectionName, description, manipulation, code, selectedFile, fileName } = this.state;
        if (this.validForm()) {
            var token = sessionStorage.token;
            var orgId = sessionStorage.orgId;
            var reqObj = this.setSectionPayload(orgId);
            var formData = new FormData();
            formData.append("image", undefined);
            formData.append("file", selectedFile);
            formData.append("lessonObject", JSON.stringify(reqObj));
            this.setState({ modalLoader: true, errorMessage: '' });
            const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/lesson";
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
                    const message = `${sectionName} section ${manipulation == 'Add Section' ? 'created' : 'updated'} successfully`;
                    this.showNotification(message);
                    this.resetForm();
                    this.getSectionList();
                } else {
                    this.setState({ errorMessage: response.data.status.message });
                }
            }).catch(error => {
                this.setState({ modalLoader: false });
            })
        } else {
            let isError = { ...this.state.isError };
            isError.description = this.descriptionValidator(description);
            isError.sectionName = this.sectionNameValidator(sectionName);
            isError.code = this.codeValidator(code);
            isError.fileName = this.fileValidator(fileName);

            if (manipulation == 'Update Section') {
                isError.fileName = '';
            }
            this.setState({ isError: isError });
        }

    }

    fileTrigger = () => {
        document.getElementById("fileName").click();
    }

    handleFileChange = (event) => {
        const { target } = event;
        const { files } = target;
        let isError = { ...this.state.isError };
        let selectedFile = '';
        let fileName = '';
        if (files && files[0]) {
            var reader = new FileReader();
            var name = files[0].name;
            if (!name.match(/\s/g)) {
                if (files[0].size < 50000000) {
                    isError.fileName = '';
                    this.setState({
                        selectedFile: files[0],
                        fileName: files[0].name,
                        isError
                    });
                    reader.onload = event => {
                    };
                    reader.readAsDataURL(files[0]);

                } else {
                    isError.fileName = 'File size should not Exceeds 50MB .';
                    fileName = ''
                    selectedFile = '';
                    this.setState({ isError, fileName, selectedFile });
                }
            }
            else {
                isError.fileName = 'File name should not contain space.';
                fileName = ''
                selectedFile = '';
                this.setState({ isError, fileName, selectedFile });
            }
        }
    }


    validForm = () => {

        var valid;
        const { manipulation, sectionName, description, code, fileName } = this.state;
        if (this.sectionNameValidator(sectionName) == '' &&
            this.descriptionValidator(description) == '' &&
            this.codeValidator(code) == '' &&
            (manipulation == 'Add Section' ? this.fileValidator(fileName) == '' : true)) {
            valid = true;
        }
        else {
            valid = false;
        }
        return valid;
    }

    sectionNameValidator = (Param) => {
        var returnMsg = '';
        var pattern = /^([a-zA-Z0-9 _-]+)$/;

        if (Param.length == 0) {
            returnMsg = 'Section name is required';
        } else if (!pattern.test(Param)) {
            returnMsg = 'Unsupported text format.';
        } else if (Param.length < 3) {
            returnMsg = 'Topic name must be atleast 3 characters required.';
        } else {
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

    codeValidator = (Param) => {
        var pattern = /^([a-zA-Z0-9_-]+)$/;

        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Section code is required';
        } else if (!pattern.test(Param)) {
            returnMsg = 'Unsupported text format.';
        } else if (Param.length < 3) {
            returnMsg = 'Section name must be atleast 3 characters required.';
        }
        else {
            returnMsg = '';
        }
        return returnMsg;
    }

    fileValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'File is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    handleValueChange = (e) => {
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "sectionName":
                isError.sectionName = this.sectionNameValidator(value)
                break;
            case "description":
                isError.description = this.descriptionValidator(value)
                break;
            case "code":
                isError.code = this.codeValidator(value)
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [name]: value
        });
        console.log(this.state.isActive);
    }

    resetForm = () => {
        this.setState({
            sectionModel: false,
            deleteModal: false,
            dModalLoader: false,
            modalLoader: false,
            Loader: false,
            deleteSectionName: '',
            lessonId: '',
            sectionName: '',
            isActive: true,
            code: '',
            description: '',
            fileName: '',
            selectedFile: '',
            isError: {
                fileName: '',
                sectionName: '',
                code: '',
                description: '',
            },
            manipulation: 'Add Section',
            errorMessage: '',
        })
    }

    editSection = (value) => {
        this.setState({ manipulation: 'Update Section', modalLoader: true });
        this.showSectionModel(true);
        const token = sessionStorage.token;
        const { listStatus } = this.state;
        var payload = { lessonId: value.lessonId, isActive: listStatus };
        const url = BaseUrl.demoElmsHornbillfxUrl + "hbfx-cnt-elms/lesson/params";
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
                        editLessonObject: response.data.data,
                        isActive: response.data.data.isActive,
                        sectionName: response.data.data.name,
                        description: response.data.data.description,
                        code: response.data.data.code,
                    });
                }
            }).catch(error => {
                this.setState({ modalLoader: true });
            })

    }

    setSectionPayload(orgId) {
        const { sectionName, code, isActive, description, courseId, selectedFile, manipulation, editLessonObject } = this.state;
        var reqObj;
        if (manipulation == 'Update Section') {
            reqObj = editLessonObject;
            reqObj.organisationId = orgId;
            reqObj.name = sectionName;
            reqObj.code = code;
            reqObj.isActive = isActive;
            reqObj.description = description;
            reqObj.createdOn = new Date();
            reqObj.updatedOn = new Date();
        } else {
            reqObj = {
                name: sectionName,
                code: code,
                organisationId: orgId,
                contentType: 'CNPT',
                quizType: '',
                quizQuestionType: '',
                isActive: isActive,
                description: description,
                course: {
                    courseId: courseId
                },
                fileType: selectedFile.type,
                createdBy: 1,
                createdOn: new Date(),
                updatedBy: 1,
                updatedOn: new Date()
            };
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

    changeTopic = (course) => {

        let courseId = course.target.value;
        const { topicList } = this.state;
        let index = topicList.findIndex(c => c.courseId == courseId);
        this.setState({
            courseId: courseId,
            selectedTopic: topicList[index]
        }, () => {
            this.getSectionList();
        });
    }
    onChangeStatus = (e) => {
        let listStatus = e.target.checked;
        this.setState({ listStatus }, e => {
            this.getSectionList();
        });
    }
    render() {
        const { sectionList, sectionModel, deleteModal, Loader, errorMessage, listStatus,
            selectedTopic, dModalLoader, isActive, fileName, manipulation,
            showMessage, message, topicList, courseId, isError, deleteSectionName,
            modalLoader, sectionName, code, description } = this.state;
        const columns = [
            {
                dataField: 'lessonName',
                text: 'Section Name',
                sort: true,

            },
            {
                dataField: 'lessonCode',
                text: 'Code',
                sort: true,
            },
            {
                dataField: 'orgName',
                text: 'Organisation',
                sort: true,
            },
            {
                dataField: 'isActive',
                text: 'Status',
                sort: true,
                formatter: (row, cell) => (
                    <div className="course-name text-left">
                        { cell.isActive ? 'Active' : 'In Active'}
                    </div>
                )
            },
            {
                dataField: '',
                text: 'Action',
                formatter: (row, cell) => (
                    <div className="action-btn" style={{ cursor: 'auto' }}>
                        <i className="icon-edit" style={{ cursor: 'pointer' }} onClick={e => this.editSection(cell)}></i>
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
                        <p className="mb-0">
                            <span className="rightArrow cursor-pointer" onClick={e => this.goSectionPage(1)}>{selectedTopic.orgName}<img src={rightArrow} alt="Right Arrow" /></span>
                            <span className="rightArrow cursor-pointer" onClick={e => this.goSectionPage(2)}>{selectedTopic.categoryName}<img src={rightArrow} alt="Right Arrow" /></span>
                            {/* {selectedTopic.courseName} */}
                        </p>
                        <div className="course-management-select">
                            <Form.Group>
                                <Form.Control as="select" value={courseId} onChange={this.changeTopic}>
                                    {topicList.map((topic, index) =>
                                        <option key={index} value={topic.courseId}>{topic.courseName}</option>)}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>
                    <div className="col ml-auto table-header">
                        <div> <Form.Check type="switch" id="custom-switch1" checked={listStatus} onChange={this.onChangeStatus} label={listStatus ? "Active" : 'In Active'} /></div>
                        <button className="btn ml-3" onClick={this.addSection}>Add Section</button>
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
                        <BootstrapTable keyField='id' data={sectionList} columns={columns} bordered={false} />
                    </div>
                </div>

                {/* Modal  */}
                <Modal id="addSectionModal" className="addShiftModel" show={sectionModel} onHide={e => this.showSectionModel(false)} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="pl-1" >{manipulation}</Modal.Title>
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
                                            <Form.Control disabled type="text" name="orgName" value={selectedTopic.orgName} placeholder="Organizatoin Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Course Name</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control disabled type="text" name="categoryName" value={selectedTopic.categoryName} placeholder="Course Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Topic Name </Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control disabled type="text" name="courseName" value={selectedTopic.courseName} disabled placeholder="Topic Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Section Name <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" name="sectionName" onChange={this.handleValueChange} value={sectionName} />
                                            {isError.sectionName.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.sectionName} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                        <Form.Label>Section Code <span className="mandatory">*</span></Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <Form.Group>
                                            <Form.Control type="text" onChange={this.handleValueChange} name="code" value={code} />
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
                                            <Form.Control type="text" onChange={this.handleValueChange} name="description" value={description} />
                                            {isError.description.length > 0 && (
                                                <Form.Text className="error-msg"> {isError.description} </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm align-self-start">
                                        <Form.Label>Upload Zip File</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                        <div className="media-upload mt-2" onClick={this.fileTrigger}>
                                            <input type="file" style={{ display: 'none' }}
                                                id="fileName" name="fileName" accept="video/mp4,video/x-m4v,video/*,.zip,.mp4, .webm, .ogg, .ogv, .mov, .m4v"
                                                onChange={this.handleFileChange} />
                                            {fileName ? fileName :
                                                <p className="mb-0"><img src={uploadIcon} alt="Browse Image" /> Upload Zip/Video File </p>}
                                        </div>
                                        <p className="guide-text">Only zip and video files are allowed. Maximum upload file size 50MB</p>
                                        {isError.fileName.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.fileName} </Form.Text>
                                        )}
                                    </Col>
                                    <Col xs={3} sm="3" xl="4" className="addPlantForm mt-4">
                                        <Form.Label>Status</Form.Label>
                                    </Col>
                                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm mt-4">
                                        {/* <Form.Group className="toggle-switch">
                                            <input type="checkbox" id="switch" /><label for="switch">Toggle</label>
                                            <span className="ml-2">Active</span>
                                        </Form.Group> */}
                                        <Form.Check type="switch" id="custom-switch"
                                            onChange={e => this.setState({ isActive: !isActive })}
                                            label={isActive == false ? 'In Active' : 'Active'}
                                            checked={isActive} />
                                    </Col>
                                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                                        <button className="btn white-color-bg" onClick={e => this.showSectionModel(false)}>Cancel</button>
                                        <button className="btn black-color-bg" onClick={this.submitForm}>Save</button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>


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
                                <p className="mt-2 mb-4">Are you sure want to Delete this <b> {deleteSectionName}  </b> Section ?</p>
                                <button className="btn white-color-bg" onClick={e => this.showDeleteModal(false)}>Cancel</button>
                                <button className="btn black-color-bg" onClick={this.deleteSection}>Save</button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>

            </div>

        )
    }
}

export default SectionManipulation

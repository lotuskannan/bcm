import React, { Component } from 'react'
import { Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import axios from 'axios';
import BaseUrl from '../../Service/BaseUrl';
import TimeKeeper from 'react-timekeeper';
import timeimg from '../../assets/images/timeimg.png';
import mediaImg from '../../assets/images/powder-coat-plant.jpg';
import './timestyle.css';

var clientPlantAreaDetailId = '';
var ClonetimeFrom = '';
var ClonetimeTo = '';

class ViewAssignTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowTaskData: props.selectedRowTaskData,
            viewTaskModalShow: props.viewTaskModalShow,
            taskAssignedTo: '',
            taskDateString: '',
            clientPlantAreaDetailId: '',
            taskMasterId: '',
            taskStatus: '',
            timeFrom: '',
            timeTo: '',
            plantTaskId: '',
            createdBy: '',
            updatedBy: '',
            isError: {
                taskDateString: '',
                taskStatus: '',
                timeFrom: '',
                timeTo: '',
                taskAssignedTo: '',
                taskMasterId: '',
                clientPlanAreaDetailId: '',
            },
            Loader: true,
            errorMessage: '',
            areaList: [],
            statusColor: 'selectPlaceholder',
            areaColor: 'selectPlaceholder',
            taskColor: 'selectPlaceholder',
            Manipulation: "Assign Task",
            taskList: [],
            employeeList: [],
            taskAssigneeName: '',
            ClonetaskDateString: '',
            cloneStartTime: '',
            cloneEndTime: '',
            ClonetimeFrom: '',
            ClonetimeTo: '',
            time: '10:03',
            startTime: '',
            endTime: '',
            endTimershow: false,
            startTimershow: false,
            taskRemarks: '',
            imageList: [],
            imageLoader: false,

        }

        console.log(this.props);
        this.getAreasAndTaskList(this.props.selectedRowTaskData.rowObject.clientPlantMasterId);
    }
    newConvertDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    componentDidMount() {
        this.setState({ Loader: true });
        if (this.props.selectedRowTaskData.rowObject) {
            var date = this.props.selectedRowTaskData.taskDateString;
            clientPlantAreaDetailId = this.props.selectedRowTaskData.clientPlantAreaDetailId;
            this.getAreaImageList(this.props.selectedRowTaskData.plantTaskId);
            this.setState({
                taskAssignedTo: this.props.selectedRowTaskData.taskAssignedTo,
                taskDateString: date ? date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0] : null,
                clientPlantAreaDetailId: this.props.selectedRowTaskData.clientPlantAreaDetailId,
                taskMasterId: this.props.selectedRowTaskData.taskMasterId,
                taskStatus: this.props.selectedRowTaskData.taskStatus,
                timeFrom: this.props.selectedRowTaskData.timeFrom,
                timeTo: this.props.selectedRowTaskData.timeTo,
                plantTaskId: this.props.selectedRowTaskData.plantTaskId,
                createdBy: this.props.selectedRowTaskData.createdBy,
                updatedBy: JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
                taskAssigneeName: this.props.selectedRowTaskData.assigneeName,
                startTime: this.props.selectedRowTaskData.timeFrom,
                endTime: this.props.selectedRowTaskData.timeTo,
                ClonetimeFrom: this.props.selectedRowTaskData.timeFrom,
                ClonetimeTo: this.props.selectedRowTaskData.timeTo
            });
            document.getElementById('Remark').value = (this.props.selectedRowTaskData.rowObject.taskRemarks == null || this.props.selectedRowTaskData.rowObject.taskRemarks == '') ? '' : this.props.selectedRowTaskData.rowObject.taskRemarks;
            setTimeout(() => {
                this.setState({ Loader: false });
            }, 2000);
        }
    }

    // get Task image list 
    getAreaImageList = (plantId) => {

        const url = UrlConstants.getAreaImageListUrl + plantId;
        this.setState({ imageLoader: true });
        GenericApiService.getAll(url)
            .then(response => {
                if (response.status.success === 'SUCCESS') {
                    var imageArr = response.data.filter(elem => {
                        if (elem.image) {
                            return elem;
                        }
                    });
                    var tempArr;
                    if (imageArr.length == 1) {
                        tempArr = imageArr.concat([{ 'image': '' }]);
                    } else if (imageArr.length >= 2) {
                        tempArr = imageArr
                    } else {
                        tempArr = [{ 'image': '' }, { 'image': '' }];
                    }

                    this.setState({
                        imageList: tempArr,
                        imageLoader: false
                    });
                } else {

                    var tempArr = [{ 'image': '' }, { 'image': '' }];


                    this.setState({
                        imageList: tempArr,
                        imageLoader: false
                    });
                }

            }).catch(error => {
                var tempArr = [{ 'image': '' }, { 'image': '' }]
                this.setState({
                    imageList: tempArr,
                    imageLoader: false
                });
            })
    }

    startTimeEvent = (Param) => {
        this.setState({ startTime: Param.target.value });
    }
    endTimeEvent = (Param) => {
        this.setState({ endTime: Param.target.value });
    }
    startTimeKeper = (param) => {
        var paramVal = param;
        var h = (paramVal.split(':')[0].length == 1) ? '0' + paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h + ':' + paramVal.split(':')[1];
        this.setState({ startTime: t });

        var datetemp = this.state.taskDateString.split('-')[2] + '-' +
            this.state.taskDateString.split('-')[1] + '-' +
            this.state.taskDateString.split('-')[0];
        if (datetemp) {
            var dateObj = new Date(datetemp);
            var time = dateObj.setHours(t.split(' ')[1] == 'am' ? t.split(' ')[0].split(':')[0] : parseInt(t.split(' ')[0].split(':')[0]) + 12, t.split(' ')[0].split(':')[1]);
            var taskDate = new Date(time);
            var currentDate = new Date();

            if (currentDate < taskDate) {
                console.log(currentDate < taskDate);
                var obj = { target: { name: 'taskStatus', value: 'Yet to Start', } }
                console.log(obj);
                this.taskStatusChangeEvent(obj)
            } else {
                console.log(currentDate < taskDate);
                var obj = { target: { name: 'taskStatus', value: 'Overdue', } }
                console.log(obj);
                this.taskStatusChangeEvent(obj)
            }
        }
    }
    openStartTimer = () => {
        this.setState({ startTimershow: true });
    }
    closeStartTimer = () => {
        this.setState({ startTimershow: false });
    }
    endTimeKeper = (param) => {
        var paramVal = param;
        var h = (paramVal.split(':')[0].length == 1) ? '0' + paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h + ':' + paramVal.split(':')[1];
        this.setState({ endTime: t });
    }
    openEndTimer = () => {
        this.setState({ endTimershow: true });
    }
    closeEndTimer = () => {
        this.setState({ endTimershow: false });
    }
    convertTime12to24 = (time12h) => {
        var martinVal = time12h.split(' ')[1] == 'am' || time12h.split(' ')[1] == 'AM' ? 'AM' : 'PM';
        var Clonetime12h = time12h.split(' ')[0] + ' ' + martinVal;
        var [fullMatch, time, modifier] = Clonetime12h.match(/(\d?\d:\d\d)\s*(\w{2})/i);
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return hours + ':' + minutes;
    }
    setModalHide = () => {
        this.props.onHide(false);
    }
    getAreasAndTaskList(plantId) {
        this.setState({ Loader: true });
        const url = UrlConstants.getAreasAndTaskUrl + '/' + plantId;
        GenericApiService.getAll(url).then(response => {
            this.setState({
                taskList: response.data.tasks,
                areaList: response.data.areas,
                Loader: false
            });
        })
    }
    formatAM_PM = (time) => {
        // var date = new Date();
        var hours = parseInt(time.split(':')[0]);
        var minutes = parseInt(time.split(':')[1]);
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    getEmployeeList = (searchText) => {
        this.setState({ taskAssigneeName: '' });
        var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        if (plantId != 0) {
            var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
            const url = UrlConstants.getEmployeeBySearchUrl + searchText + param;
            this.setState({ isLoading: true , errorMessage :''});
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
                this.setState({
                    employeeList: [],
                    isLoading: false
                });
            });

        } else {
            var errorMessage = 'Please select branch name in header';
            this.setState({ errorMessage });
        }
    }
    employeeCode = (e) => {
        if (e.length === 0) {
            return false;
        } else {
            const user = e[0];
            this.setState({
                taskAssignedTo: user.bcmUserId,
                taskAssigneeName: user.firstName + ' ' + user.lastName
            })
            this.formValChange({ target: { name: "taskAssignedTo", value: user.bcmUserId } });
        }
    }

    PlantArea = (e) => {
        for (var i = 0; i < this.state.areaList.length; i++) {
            if (i == e.target.selectedIndex) {
                this.setState({ clientPlantAreaDetailId: this.state.areaList[i].clientPlanAreaDetailId });
            }
        }
    }
    getPlant = (e) => {
        for (var i = 0; i < this.state.taskList.length; i++) {
            if (i == e.target.selectedIndex) {
                this.setState({ taskMasterId: this.state.taskList[i].taskMasterId });
            }
        }
    }
    taskStatusChangeEvent = (e) => {
        this.setState({ taskStatus: e.target.value });
    }
    render() {
        const responsive = {
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 2,
                slidesToSlide: 1 // optional, default to 1.
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2,
                slidesToSlide: 2 // optional, default to 1.
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
                slidesToSlide: 1 // optional, default to 1.
            }
        };
        const { imageList , errorMessage} = this.state;
        return (
            <Modal id="assignTask"
                show={this.state.viewTaskModalShow}
                onHide={this.setModalHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.Loader ? <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                    </div> : null}
                    <Row>
                        <Col xl="12">
                            <Row className="align-items-center">
                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col md="9" xl="8 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control type="text" disabled value={this.state.selectedRowTaskData.rowObject.plant || ''}
                                            name="clientPlantMasterId" />
                                    </Form.Group>
                                </Col>
                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Area Name</Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="selectGroup" style={{ pointerEvents: 'none' }}>
                                        <Form.Control as="select" style={{ pointerEvents: 'none' }} className={this.state.areaColor} value={this.state.clientPlantAreaDetailId}
                                            name="clientPlanAreaDetailId" style={{ color: '#5A5A5A !important' }} onChange={this.PlantArea.bind(this)}>
                                            {this.state.areaList.map((area, index) => <option key={index} value={area.clientPlanAreaDetailId}>
                                                {area.areaName}
                                            </option>)}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Task Name</Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="selectGroup" style={{ pointerEvents: 'none' }}>
                                        <Form.Control as="select" className={this.state.taskColor} value={this.state.taskMasterId}
                                            onChange={this.getPlant.bind(this)} style={{ color: '#5A5A5A !important', pointerEvents: 'none' }} name="taskMasterId" >
                                            {this.state.taskList.map((task, index) => <option key={index} value={task.taskMasterId}>
                                                {task.task}
                                            </option>)}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Assigned To </Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group controlId="empId" style={{ pointerEvents: 'none' }}>
                                        <AsyncTypeahead
                                            style={{ pointerEvents: 'none' }}
                                            id="basic-typeahead-example" labelKey="fullName"
                                            options={this.state.employeeList}
                                            onChange={this.employeeCode}
                                            onSearch={this.getEmployeeList}
                                            placeholder={this.state.taskAssigneeName} />
                                    </Form.Group>
                                </Col>

                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Date</Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="datePicker" style={{ pointerEvents: 'none' }}>
                                        <DatePicker
                                            style={{ pointerEvents: 'none' }}
                                            defaultValue={this.state.taskDateString}
                                            value={this.state.taskDateString}
                                            placeholderText={this.state.ClonetaskDateString} minDate={new Date()} dateFormat="dd-MM-yyyy" />
                                        <i className="calIcon"></i>
                                    </Form.Group>
                                </Col>
                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Time</Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Row>
                                        <Col md="6" xl="6">
                                            <Form.Group>
                                                <input type="text" readonly className="form-control"
                                                    value={this.state.startTime}
                                                    style={{ pointerEvents: 'none' }} />
                                                <img src={timeimg} alt="timeimg" style={{ width: 20 }} />
                                            </Form.Group>
                                        </Col>
                                        <Col md="6" xl="6">
                                            <Form.Group>
                                                <input type="text" readonly className="form-control"
                                                    value={this.state.endTime}
                                                    style={{ pointerEvents: 'none' }} />
                                                <img src={timeimg} alt="timeimg" style={{ width: 20 }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="3" xl="4" className="addPlantForm">
                                    <Form.Label>Status</Form.Label>
                                </Col>
                                <Col md="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="option" style={{ pointerEvents: 'none' }}>
                                        <Form.Control className={this.state.statusColor} value={this.state.taskStatus}
                                            style={{ color: '#5A5A5A !important', pointerEvents: 'none' }} name="taskStatus"
                                            as="select" placeholder="Select Status">
                                            <option value='Yet to Start'>Yet to Start</option>
                                            <option value='Overdue'>Overdue</option>
                                            <option value='In Progress'>In Progress</option>
                                            <option value='Done' >Done</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Remark</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="option">
                                        <textarea className="form-control textarea-control" style={{ pointerEvents: 'none' }} id="Remark" name="Remark"
                                            placeholder="Remark"></textarea>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl="12 mt-4">
                            {this.state.imageLoader ?
                                <div className="loader">
                                    <Spinner animation="grow" variant="dark" />
                                </div> : <Carousel responsive={responsive} >
                                    {imageList.map((elem, index) =>
                                        elem.image ? <div key={index}>
                                            <figure className="carousel-img" style={{ backgroundImage: `url(${`data:image/png;base64,${elem.image}`})` }}>
                                            </figure>
                                        </div> : null
                                    )}
                                </Carousel>}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ViewAssignTask;
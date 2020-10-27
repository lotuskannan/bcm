import React, { Component } from 'react'
import { Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import axios from 'axios';
import Moment from 'react-moment';
import BaseUrl from '../../Service/BaseUrl';
import TimeKeeper from 'react-timekeeper';
import timeimg from '../../assets/images/timeimg.png';
import './timestyle.css';

class AssignTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
            areaList: [],
            plantList: [],
            isLoading: false,
            employeeList: [],
            plantTaskId: '',
            taskAssignedTo: '',
            taskDateString: '',
            taskMasterId: '',
            taskStatus: 'Yet to Start',
            timeFrom: '',
            timeTo: '',
            clientPlanAreaDetailId: '',
            taskAssigneeName: '',
            isError: {
                taskDateString: '',
                taskStatus: '',
                timeFrom: '',
                timeTo: '',
                taskAssignedTo: '',
                taskMasterId: '',
                clientPlanAreaDetailId: '',
            },
            Loader: false,
            errorMessage: '',
            statusColor: 'selectPlaceholder',
            areaColor: 'selectPlaceholder',
            taskColor: 'selectPlaceholder',
            Manipulation: "Assign Task",
            modalShow: false,
            startTime: '',
            endTime: '',
            submitClick: 0,
            initTime: this.DisplayCurrentTime(),
            startTimershow: false,
            endTimershow: false,
            taskRemarks: '',
            timeissue: '',
            pasttimeflag: ''
        }
    }

    componentDidMount() {
    }
    startTimeKeper = (param) => {
        var paramVal = param;

        var h = (paramVal.split(':')[0].length == 1) ? '0' + paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h + ':' + paramVal.split(':')[1];
        this.setState({ startTime: t });

        if (this.state.taskDateString) {
            var tdate = new Date(this.state.taskDateString);
            var time = tdate.setHours(t.split(' ')[1] == 'am' ? t.split(' ')[0].split(':')[0] : parseInt(t.split(' ')[0].split(':')[0]) + 12, t.split(' ')[0].split(':')[1]);
            var taskDate = new Date(time);
            var currentDate = new Date();

            if (currentDate < taskDate) {
                console.log(currentDate < taskDate);
                var obj = { target: { name: 'taskStatus', value: 'Yet to Start', } }
                console.log(obj);
                this.formValChange(obj)
            } else {
                console.log(currentDate < taskDate);
                var obj = { target: { name: 'taskStatus', value: 'Overdue', } }
                console.log(obj);
                this.formValChange(obj)
            }
        }

    }
    openStartTimer = () => {
        var tm = this.DisplayCurrentTime();
        this.setState({ initTime: tm });
        this.setState({ startTimershow: true });
    }
    closeStartTimer = () => {
        this.setState({ pasttimeflag: '' });
        if (this.state.startTime == '') {
            this.setState({ startTime: this.state.initTime });
        }
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
        if (this.state.endTime == '') {
            this.setState({ endTime: this.state.initTime });
        }
        this.setState({ endTimershow: false });
    }
    DisplayCurrentTime = () => {
        var date = new Date();
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "pm" : "am";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = hours + ":" + minutes + " " + am_pm;
        return time;
    }
    getPlantCountList = () => {
        GenericApiService.getAll(UrlConstants.getDashbordPlantCountUrl)
            .then(response => {
                this.setState({ plantList: response.data });
            })
            .catch(error => {

            })
    }

    getAreasAndTaskList(plantId) {
        this.setState({
            Loader: true
        });
        const url = UrlConstants.getAreasAndTaskUrl + '/' + plantId;
        GenericApiService.getAll(url)
            .then(response => {

                this.setState({
                    taskList: response.data.tasks,
                    areaList: response.data.areas,
                    Loader: false
                });

            }).catch(error => {

            })
    }

    showTaskModal = (e) => {

        this.setState({
            modalShow: e
        })
        if (e == false) {
            this.resetForm();
        } else {
            this.getAreasAndTaskList(this.props.plantMasterId);
        }
    }

    addTask = (e) => {
        this.setState({ Manipulation: 'Assign Task' });
        this.showTaskModal(e);
    }

    deleteTask = () => {
        const url = UrlConstants.deleteTaskUrl + this.state.taskMasterId;
        GenericApiService.deleteById(url)
            .then(response => {
                const taskName = this.state.taskList.filter(elem => {
                    if (elem.taskMasterId == this.state.taskMasterId) {
                        return elem.task;
                    }
                });
                if (response.status.success == 'SUCCESS') {
                    const message = `${taskName[0].task} task deleted successfully`;
                    this.showTaskModal(false);
                    this.props.getList(message);
                }
            })
            .catch(error => {

            })

    }


    getEmployeeList = (searchText) => {
        var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
        // if (plantId != 0) {
        var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '';
        const url = UrlConstants.getEmployeeBySearchUrl + searchText + param;
        this.setState({ isLoading: true, errorMessage: '' });
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
            this.setState({ isLoading: false, employeeList: [] });
        });
        // } else {
        //     var errorMessage = 'Kindly select branch name in header';
        //     this.setState({ errorMessage });
        // }
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
            // this.getUserDetails(selectUserId);
        }
    }
    getUserDetails = (userId) => {
        const url = '/user/getbyId/' + userId;
        GenericApiService.getAll(url).then(Response => {
            this.setState({
                taskAssignedTo: Response.data.bcmUserId,
                taskAssigneeName: Response.data.firstName
            })
            this.formValChange({ target: { name: "taskAssignedTo", value: Response.data.bcmUserId } });
        }).catch(error => {

        })
    }

    newConvertDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    submitAssignTask = (event) => {
        this.setState({ submitClick: 1 });
        event.preventDefault();
        if (this.validForm()) {
            var date = new Date(this.state.taskDateString);
            const object = {
                clientPlanAreaDetailId: this.state.clientPlanAreaDetailId,
                plantTaskId: null,
                taskAssignedTo: this.state.taskAssignedTo,
                taskDate: this.newConvertDate(date),
                taskMasterId: this.state.taskMasterId,
                taskStatus: this.state.taskStatus,
                timeFrom: this.state.startTime,
                timeTo: this.state.endTime,
                taskRemarks: (document.getElementById('Remark').value == '' || document.getElementById('Remark').value == null) ? null : document.getElementById('Remark').value
            }
            this.setState({ Loader: true, errorMessage: '' });
            var addTaskUrl = BaseUrl.BaseUrl + 'bcm-protocol/cleanlinessprotocol/plant/assigntask';
            var formData = new FormData();
            formData.append("files", '[]');
            formData.append("submittedPlantTask", JSON.stringify(object));
            axios({
                method: 'post', url: addTaskUrl, data: formData, headers: {
                    'token': sessionStorage.loginUserToken
                }
            }).then(response => {
                if (response.data.status.success == 'SUCCESS') {
                    const taskName = this.state.taskList.filter(elem => {
                        if (elem.taskMasterId == this.state.taskMasterId) {
                            return elem.task;
                        }
                    });
                    const message = `${taskName[0].task} task has been assigned to ${this.state.taskAssigneeName} successfully`;
                    this.showTaskModal(false);
                    this.props.getList(message);
                } else if (response.data.status.success == 'FAILED') {
                    this.setState({
                        errorMessage: response.data.status.massage,
                        Loader: false
                    });
                }
            });
        }
        else {
            let isError = { ...this.state.isError };
            // console.log(isError);
            isError.taskDateString = this.taskStatusValidator(this.state.taskDateString);
            // isError.taskStatus = this.taskStatusValidator(this.state.taskStatus);
            // isError.timeTo = this.toTimeValidator(this.state.timeTo);
            // isError.timeFrom = this.fromTimeValidator(this.state.timeFrom);
            isError.taskAssignedTo = this.taskAssignedToValidator(this.state.taskAssignedTo);
            isError.taskMasterId = this.taskMasterIdValidator(this.state.taskMasterId);
            isError.clientPlanAreaDetailId = this.taskAreaValidator(this.state.clientPlanAreaDetailId);
            this.setState({ isError: isError });
        }
    }
    dateTimeCondition = () => {
        let status = 0;
        if (this.taskDateValidator(this.state.taskDateString) == '' && this.state.startTime != '' && this.state.endTime != '') {
            let date = new Date(this.state.taskDateString);
            let newDate = this.newConvertDate(date);
            let convertDate = newDate.split('-')[1] + '/' + newDate.split('-')[2] + '/' + newDate.split('-')[0];
            let startDateTime = convertDate + ' ' + this.state.startTime;
            let endDateTime = convertDate + ' ' + this.state.endTime;
            let newStartDateTime = new Date(startDateTime);
            let newEndDateTime = new Date(endDateTime);
            if (newStartDateTime < newEndDateTime) {
                status = 1;
            } else {
                status = 2;
            }
        } else {
            status = 0;
        }
        return status;
    }
    time24Convertor = (time) => {
        var PM = time.match('pm') ? true : false
        time = time.split(':')
        var min = time[1]
        if (PM) {
            var hour = 12 + parseInt(time[0], 10)
            var sec = time[2].replace('pm', '')
        } else {
            var hour = time[0]
            var sec = time[2].replace('am', '')
        }
        return hour + ':' + min + ':' + sec
    }
    startDateTimeCondition = (startTime) => {
        var status = 0;
        var currentDate = new Date();
        var currentDateValue = this.newConvertDate(currentDate);
        let convertDate = currentDateValue.split('-')[1] + '/' + currentDateValue.split('-')[2] + '/' + currentDateValue.split('-')[0];

        let stime = this.DisplayCurrentTime();
        // stime = stime.split(' ')[0]+':00'+stime.split(' ')[1];
        // let startDateTime = convertDate+' '+this.time24Convertor(stime);
        let startDateTime = convertDate + ' ' + stime;
        let newStartDateTime = new Date(startDateTime);

        let eTime = startTime;
        // eTime = eTime.split(' ')[0]+':00'+eTime.split(' ')[1];       
        // let endDateTime = convertDate+' '+this.time24Convertor(eTime);
        let endDateTime = convertDate + ' ' + eTime;
        let newEndDateTime = new Date(endDateTime);

        if (newStartDateTime <= newEndDateTime) {
            status = 1;
        } else {
            status = 2;
        }
        console.log('status =>' + status);
        return status;
    }
    startTimeCheckWithCurrentTime = () => {
        let retRes;
        var seletedDate = new Date(this.state.taskDateString);
        var seletedDateValue = this.newConvertDate(seletedDate);
        var currentDate = new Date();
        var currentDateValue = this.newConvertDate(currentDate);
        if (seletedDateValue == currentDateValue) {
            if (this.state.startTime) {
                let res = this.startDateTimeCondition(this.state.startTime);
                retRes = (res == '2') ? false : true;
            }
        } else {
            retRes = true;
        }
        return retRes;
    }
    validForm = () => {
        // this.fromTimeValidator(this.state.timeFrom) == '' &&
        // this.toTimeValidator(this.state.timeTo) == '' &&
        // this.taskStatusValidator(this.state.taskStatus) == '' &&
        let status;
        if (this.taskDateValidator(this.state.taskDateString) == '' &&
            this.taskAreaValidator(this.state.clientPlanAreaDetailId) == '' &&
            this.taskMasterIdValidator(this.state.taskMasterId) == '' &&
            this.taskAssignedToValidator(this.state.taskAssignedTo) == '' &&
            this.state.startTime != '' && this.state.endTime != '') {
            if (this.startTimeCheckWithCurrentTime() == true) {
                status = this.dateTimeCondition() == 1 ? true : false;
            } else {
                status = this.startTimeCheckWithCurrentTime();
            }
        } else {
            status = false;
        }
        return status;
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

    deFormatDate = (time) => {
        const obj = `2020-06-02 ${time.toLocaleUpperCase()}`;
        var hours = new Date(obj).getHours();
        var min = new Date(obj).getMinutes();
        const tempMin = min.toLocaleString()
        const value = hours + ':' + (tempMin.charAt(0) == '0' ? '00' : tempMin);
        return value;
    }
    convertFrom24To12Format(time) {
        var result = '';
        if (time == '') {
        } else {
            var hour = time.split(':')[0];  /* Returns the hour (from 0-23) */
            var minutes = time.split(':')[1];  /* Returns the minutes (from 0-59) */
            result = hour;
            var ext = '';
            if (hour > 12) {
                ext = 'PM';
                hour = (hour - 12);
                if (hour < 10) {
                    result = "0" + hour;
                } else if (hour == 12) {
                    hour = "00";
                    ext = 'AM';
                }
            }
            else if (hour < 12) {
                result = ((hour < 10) ? "0" + hour : hour);
                ext = 'AM';
            } else if (hour == 12) {
                ext = 'PM';
            }
            if (result.length == 3) {
                result = result.substr(1);
            }
            if (minutes.length == 3) {
                minutes = minutes.substr(1);
            }
            result = result + ":" + minutes + ' ' + ext;
            return result;
        }
    }

    taskDateValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task Date is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    toTimeValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'End time is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    fromTimeValidator = (Param) => {

        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Start time is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }
    startTimeEvent = (Param) => {
        this.setState({ startTime: Param.target.value });
    }
    endTimeEvent = (Param) => {
        this.setState({ endTime: Param.target.value });
    }
    taskStatusValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task date is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }
    taskAreaValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task area name is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    taskMasterIdValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task name is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    taskAssignedToValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task assignee name is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    formValChange = e => {
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "taskDateString":
                isError.taskDateString = this.taskDateValidator(value)
                break;
            case "taskStatus":
                isError.taskStatus = this.taskStatusValidator(value)
                break;
            case "taskAssignedTo":
                isError.taskAssignedTo = this.taskAssignedToValidator(value)
                break;
            case "taskMasterId":
                isError.taskMasterId = this.taskMasterIdValidator(value)
                break;
            case "clientPlanAreaDetailId":
                isError.clientPlanAreaDetailId = this.taskAreaValidator(value)
                break;
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value
        });

        if (name == 'taskStatus') {
            const color = value == 'In Progress' ? 'inprogress-color' :
                value == 'Overdue' || 'Yet to Start' ? 'overDue-color' : value == 'Done' ? 'done-color' : '';
            this.setState({ statusColor: color });
        } else if (name == 'taskMasterId') {
            const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
            this.setState({ taskColor: color });

        } else if (name == 'clientPlanAreaDetailId') {
            const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
            this.setState({ areaColor: color });

        }

        // if (name == 'taskDateString' && this.state.startTime) {
        //     this.startTimeKeper(this.state.startTime);
        // }
    };
    resetForm() {
        this.setState({
            employeeList: [],
            plantTaskId: '',
            taskAssignedTo: '',
            taskDateString: '',
            taskMasterId: '',
            taskStatus: 'Yet to Start',
            timeFrom: '',
            timeTo: '',
            clientPlanAreaDetailId: '',
            statusColor: 'selectPlaceholder',
            areaColor: 'selectPlaceholder',
            taskColor: 'selectPlaceholder',
            isError: {
                taskDateString: '',
                taskStatus: '',
                timeFrom: '',
                timeTo: '',
                taskAssignedTo: '',
                taskMasterId: '',
                clientPlanAreaDetailId: '',
            },
            Loader: false,
            startTime: '',
            endTime: '',
            submitClick: 0,
            initTime: this.DisplayCurrentTime(),
            startTimershow: false,
            errorMessage: ''
        });
    }
    render() {
        const { isLoading, isError, Loader,
            statusColor, errorMessage, areaList,
            taskList, taskDateString, modalShow, taskMasterId,
            employeeList, taskAssigneeName, clientPlanAreaDetailId,
            Manipulation, taskStatus, areaColor, taskColor, timeFrom, timeTo } = this.state;

        return (
            <Modal id="assignTask"
                show={modalShow}
                onHide={() => { this.showTaskModal(false) }}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {Manipulation}
                    </Modal.Title>
                    {Manipulation == 'Edit Task' ?
                        <span onClick={this.deleteTask} className="delete-btn cursor-pointer">
                            <i className="icon-delete"></i>
                        </span> : null}
                </Modal.Header>
                <Modal.Body>
                    {Loader ? <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                    </div> : null}
                    <Row>
                        <Col xl="12">
                            <Row className="align-items-center">
                                {errorMessage ? <Col md="12">
                                    <p className="error-msg">{errorMessage}</p> </Col>
                                    : ''}
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control type="text" disabled value={this.props.plantName || ''} name="clientPlantMasterId" />
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Area Name</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="selectGroup">
                                        <Form.Control as="select" className={areaColor} value={clientPlanAreaDetailId}
                                            name="clientPlanAreaDetailId" onChange={this.formValChange.bind(this)} >
                                            <option value={''} >Select Area</option>
                                            {areaList.map((area, index) => <option key={index} value={area.clientPlanAreaDetailId}>
                                                {area.areaName}
                                            </option>)}

                                        </Form.Control>
                                        {isError.clientPlanAreaDetailId.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.clientPlanAreaDetailId} </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Task Name</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">

                                    <Form.Group className="selectGroup">
                                        <Form.Control as="select" className={taskColor} value={taskMasterId}
                                            onChange={this.formValChange.bind(this)} name="taskMasterId" >
                                            <option value={''} >Select Task</option>
                                            {taskList.map((task, index) => <option key={index} value={task.taskMasterId}>
                                                {task.task}
                                            </option>)}

                                        </Form.Control>
                                        {isError.taskMasterId.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.taskMasterId} </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Assigned To </Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group controlId="empId">
                                        <AsyncTypeahead
                                            id="basic-typeahead-example" labelKey="fullName"
                                            isLoading={isLoading}
                                            onChange={this.employeeCode}
                                            options={employeeList}
                                            onSearch={this.getEmployeeList} placeholder="Select employee"
                                        />
                                        {isError.taskAssignedTo.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.taskAssignedTo} </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Date</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="datePicker">
                                        <DatePicker value={taskDateString} selected={taskDateString} placeholderText="Select Date"
                                            minDate={new Date()} dateFormat="dd-MM-yyyy"
                                            onChange={e => this.formValChange({ target: { name: 'taskDateString', value: e ? e : '' } })} />
                                        <i className="calIcon"></i>
                                        {isError.taskDateString.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.taskDateString} </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Time</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Row>
                                        <Col xs={12} sm="6" xl="6">
                                            <Form.Group>
                                                <input type="text" readOnly className="form-control"
                                                    value={this.state.startTime}
                                                    placeholder="--:--:--" onClick={this.openStartTimer} />
                                                <img src={timeimg} alt="timeimg" style={{ width: 20 }}
                                                    onClick={this.openStartTimer} />
                                                {
                                                    (this.state.startTime == '' && this.state.submitClick == '1') ? (
                                                        <Form.Text className="error-msg">Start time is required</Form.Text>
                                                    ) : (
                                                            this.startTimeCheckWithCurrentTime() == false && this.state.submitClick == '1' ?
                                                                (
                                                                    <Form.Text className="error-msg">Start time must be greater than current time</Form.Text>
                                                                ) : null
                                                        )
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm="6" xl="6">
                                            <Form.Group>
                                                <input type="text" readOnly className="form-control"
                                                    value={this.state.endTime}
                                                    placeholder="--:--:--" onClick={this.openEndTimer} />
                                                <img src={timeimg} alt="timeimg" style={{ width: 20 }}
                                                    onClick={this.openEndTimer} />
                                                {
                                                    (this.state.endTime == '' && this.state.submitClick == '1') ? (
                                                        <Form.Text className="error-msg">End time is required</Form.Text>
                                                    ) : (
                                                            this.dateTimeCondition() == 2 && this.state.submitClick == '1' ? (
                                                                <Form.Text className="error-msg">End time must be greater than start time</Form.Text>
                                                            ) : null
                                                        )
                                                }

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Status</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="option">
                                        <Form.Control className={statusColor} value={taskStatus} name="taskStatus" as="select"
                                            onChange={this.formValChange.bind(this)} placeholder="Select Status" disabled>
                                            {
                                                // <option className="selectPlaceholder" value={''} >Select Status</option>
                                            }
                                            <option value='Yet to Start'>Yet to Start</option>
                                            {
                                                // <option value='Overdue'>Overdue</option>
                                                // <option value='In Progress'>In Progress</option>
                                                // <option value='Done' >Done</option>
                                            }

                                        </Form.Control>
                                        {isError.taskStatus.length > 0 && (
                                            <Form.Text className="error-msg"> {isError.taskStatus} </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Remark</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8  pl-0" className="addPlantForm">
                                    <Form.Group className="option">
                                        <textarea className="form-control textarea-control" id="Remark" name="Remark"
                                            placeholder="Remark"></textarea>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl="12 mt-4">
                            {
                                this.state.startTimershow == true ? (
                                    <div className="custom-timekeeper">
                                        <TimeKeeper
                                            time={this.state.initTime}
                                            onChange={(newTime) => this.startTimeKeper(newTime.formatted12)} />
                                        <div className="closeBtn">
                                            <button onClick={this.closeStartTimer}>Done</button>
                                        </div>
                                    </div>
                                ) : null
                            }
                            {
                                this.state.endTimershow == true ? (
                                    <div className="custom-timekeeper">
                                        <TimeKeeper
                                            time={this.state.initTime}
                                            onChange={(newTime) => this.endTimeKeper(newTime.formatted12)} />
                                        <div className="closeBtn">
                                            <button onClick={this.closeEndTimer}>Done</button>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </Col>

                        <Col xl="12 text-center mt-4" className="modal-btn">
                            <Button variant="secondary"
                                className={this.validForm() == true ? "verify-btn" : ''}
                                onClick={this.submitAssignTask} size="sm">Save</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}

export default AssignTaskModal
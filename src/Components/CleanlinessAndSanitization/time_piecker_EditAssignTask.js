import React, { Component } from 'react'
import { Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
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
import './timestyle.css';

var clientPlantAreaDetailId = '';
var ClonetimeFrom = '';
var ClonetimeTo = '';

class EditAssignTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowTaskData:props.selectedRowTaskData,
            editTaskModalShow:props.editTaskModalShow,
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
            areaList:[],
            statusColor: 'selectPlaceholder',
            areaColor: 'selectPlaceholder',
            taskColor: 'selectPlaceholder',
            Manipulation: "Assign Task",
            taskList:[],
            employeeList:[],
            taskAssigneeName:'',            
            ClonetaskDateString: '',
            cloneStartTime:'',
            cloneEndTime:'',
            ClonetimeFrom:'',
            ClonetimeTo:'',
            time: '10:03',
            startTime:'',
            endTime:'',
            endTimershow:false,
            startTimershow:false
        }        
        this.getAreasAndTaskList(this.props.selectedRowTaskData.rowObject.clientPlantMasterId);           
    }
    newConvertDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    componentDidMount() {
        this.setState({Loader:true})   
        if (this.props.selectedRowTaskData.rowObject) {            
            var date = this.props.selectedRowTaskData.taskDateString;
            clientPlantAreaDetailId = this.props.selectedRowTaskData.clientPlantAreaDetailId;                          
            this.setState({
                taskAssignedTo: this.props.selectedRowTaskData.taskAssignedTo,
                taskDateString: date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0],
                clientPlantAreaDetailId: this.props.selectedRowTaskData.clientPlantAreaDetailId,
                taskMasterId: this.props.selectedRowTaskData.taskMasterId,
                taskStatus: this.props.selectedRowTaskData.taskStatus,
                timeFrom: this.props.selectedRowTaskData.timeFrom,
                timeTo: this.props.selectedRowTaskData.timeTo,
                plantTaskId: this.props.selectedRowTaskData.plantTaskId,
                createdBy: this.props.selectedRowTaskData.createdBy,
                updatedBy: JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
                taskAssigneeName:this.props.selectedRowTaskData.assigneeName,
                startTime:this.props.selectedRowTaskData.timeFrom,
                endTime:this.props.selectedRowTaskData.timeTo,
                ClonetimeFrom:this.props.selectedRowTaskData.timeFrom,
                ClonetimeTo:this.props.selectedRowTaskData.timeTo
            });
            // var ClonetimeFrom = this.convertTime12to24(this.props.selectedRowTaskData.timeFrom);
            // var ClonetimeTo = this.convertTime12to24(this.props.selectedRowTaskData.timeTo);
            // this.setState({ClonetimeFrom:ClonetimeFrom,startTime:ClonetimeFrom});
            // this.setState({ClonetimeTo:ClonetimeTo,endTime:ClonetimeTo});
            setTimeout(() => {               
                this.setState({Loader:false});   
            }, 2000);    
        }      
    }
    startTimeEvent=(Param)=>{        
        this.setState({startTime:Param.target.value});
    }
    endTimeEvent=(Param)=>{        
        this.setState({endTime:Param.target.value});
    }
    startTimeKeper=(param)=>{
        var paramVal = param;        
        var h = (paramVal.split(':')[0].length == 1) ? '0'+paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h+':'+paramVal.split(':')[1];
        this.setState({startTime:t});
    }
    openStartTimer=()=>{
        this.setState({startTimershow:true});
    }
    closeStartTimer=()=>{
        this.setState({startTimershow:false});
    }
    endTimeKeper=(param)=>{
        var paramVal = param;        
        var h = (paramVal.split(':')[0].length == 1) ? '0'+paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h+':'+paramVal.split(':')[1];
        this.setState({endTime:t});
    }
    openEndTimer=()=>{
        this.setState({endTimershow:true});
    }
    closeEndTimer=()=>{
        this.setState({endTimershow:false});
    }
    convertTime12to24=(time12h)=> {
        var martinVal =  time12h.split(' ')[1] == 'am' ||  time12h.split(' ')[1] == 'AM' ? 'AM' : 'PM';
        var Clonetime12h = time12h.split(' ')[0]+' '+martinVal;
        var [fullMatch, time, modifier] = Clonetime12h.match(/(\d?\d:\d\d)\s*(\w{2})/i);
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
          hours = '00';
        }
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }
        return hours+':'+minutes;
    }
    setModalHide = () => {
        this.props.onHide(false);
    }
    getAreasAndTaskList(plantId) {
        this.setState({Loader: true});
        const url = UrlConstants.getAreasAndTaskUrl+'/'+plantId;
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
    taskDateValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Task Date is required';
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
                isError.taskDateString = this.taskDateValidator(value);                
                const Param = new Date(value); 
                const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
                var date = new Date(DateValue);
                this.setState({taskDateString : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
                this.setState({ClonetaskDateString:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()});               
                break;
            case "timeTo":
                isError.timeTo = this.toTimeValidator(value)
                break;
            case "timeFrom":
                isError.timeFrom = this.fromTimeValidator(value);                               
                break
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value
        });

        if (name == 'taskStatus') {
            const color = value == 'In Progress' ? 'inprogress-color' :
                value == 'Overdue' ? 'overDue-color' : value == 'Done' ? 'done-color' : '';
            this.setState({ statusColor: color });
        } else if (name == 'taskMasterId') {
            const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
            this.setState({ taskColor: color });

        } else if (name == 'clientPlanAreaDetailId') {
            const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
            this.setState({ areaColor: color });

        }
    };
    toTimeValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'End time is required';
        } else {
            this.setState({cloneStartTime:this.formatAM_PM(Param)});
            returnMsg = '';
        }
        return returnMsg;
    }
    fromTimeValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Start time is required';
        } else {
            this.setState({cloneEndTime:this.formatAM_PM(Param)});
            returnMsg = '';
        }
        return returnMsg;
    }
    getEmployeeList = (searchText) => {
        this.setState({taskAssigneeName:''});
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
            }else{
                this.setState({
                    employeeList: [],
                    isLoading: false
                });
            }
        }).catch(error => {
        });
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
    
    submitAssignTask = (event) => {       
        event.preventDefault();
        var date = new Date(this.state.taskDateString);
        var stim = (this.state.ClonetimeFrom == this.state.startTime ) ? this.props.selectedRowTaskData.timeFrom : this.state.startTime;
        var etim = (this.state.ClonetimeTo == this.state.endTime ) ? this.props.selectedRowTaskData.timeTo : this.state.endTime;
        const object = {
            clientPlanAreaDetailId: this.state.clientPlantAreaDetailId,
            plantTaskId: this.state.plantTaskId,
            taskAssignedTo: this.state.taskAssignedTo,
            taskDate: (date == 'Invalid Date') ? this.props.selectedRowTaskData.taskDateString : this.newConvertDate(date),
            taskMasterId: this.state.taskMasterId,
            taskStatus: this.state.taskStatus,
            timeFrom:stim,
            timeTo: etim
        };
        this.setState({ Loader: true, errorMessage: '' });
        var addTaskUrl = BaseUrl.BaseUrl+'bcm-protocol/cleanlinessprotocol/plant/assigntask';
        var formData = new FormData();
        formData.append("files", '[]');
        formData.append("submittedPlantTask",JSON.stringify(object));
        axios({method: 'post',url: addTaskUrl,data: formData,headers: {
            'token':sessionStorage.loginUserToken
          }}).then(response=> {
            if (response.data.status.success == 'SUCCESS') {     
                const taskName = this.state.taskList.filter(elem => {
                    if (elem.taskMasterId == this.state.taskMasterId) {
                        return elem.task;
                    }
                });
                const message = `${taskName[0].task} task update was successfull`;
                this.props.getList(message);
                this.setModalHide();
            }   else if (response.data.status.success == 'FAILED') {
                this.setState({
                    errorMessage: response.data.status.massage,
                    Loader: false
                });
            }
        });
    }
    PlantArea=(e)=>{
        for(var i=0;i<this.state.areaList.length;i++){
            if(i == e.target.selectedIndex){
                this.setState({clientPlantAreaDetailId:this.state.areaList[i].clientPlanAreaDetailId});
            }
        }       
    }
    getPlant=(e)=>{
        for(var i=0;i<this.state.taskList.length;i++){
            if(i == e.target.selectedIndex){
                this.setState({taskMasterId:this.state.taskList[i].taskMasterId});
            }
        }
    }
    taskStatusChangeEvent=(e)=>{
        this.setState({taskStatus:e.target.value});
    }
    render() {
        return (
            <Modal id="assignTask"
                show={this.state.editTaskModalShow}
                onHide={this.setModalHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Task
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
                                name="clientPlantMasterId"  />
                            </Form.Group>
                        </Col>
                        <Col md="3" xl="4" className="addPlantForm">
                            <Form.Label>Area Name</Form.Label>
                        </Col>
                        <Col md="9" xl="8  pl-0" className="addPlantForm">
                            <Form.Group className="selectGroup">
                                <Form.Control as="select" className={this.state.areaColor} value={this.state.clientPlantAreaDetailId}
                                    name="clientPlanAreaDetailId" style={{color: '#5A5A5A !important'}} onChange={this.PlantArea.bind(this)}>
                                    {this.state.areaList.map((area, index) => <option key={index} value={area.clientPlanAreaDetailId}>
                                        {area.areaName}
                                    </option>)}

                                </Form.Control>
                                {this.state.isError.clientPlanAreaDetailId.length > 0 && (
                                    <Form.Text className="error-msg"> {this.state.isError.clientPlanAreaDetailId} </Form.Text>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md="3" xl="4" className="addPlantForm">
                            <Form.Label>Task Name</Form.Label>
                        </Col>
                        <Col md="9" xl="8  pl-0" className="addPlantForm">
                            <Form.Group className="selectGroup">
                                <Form.Control as="select" className={this.state.taskColor} value={this.state.taskMasterId} 
                                onChange={this.getPlant.bind(this)} style={{color: '#5A5A5A !important'}} name="taskMasterId" >
                                    {this.state.taskList.map((task, index) => <option key={index} value={task.taskMasterId}>
                                        {task.task}
                                    </option>)}
                                </Form.Control>
                                {this.state.isError.taskMasterId.length > 0 && (
                                    <Form.Text className="error-msg"> {this.state.isError.taskMasterId} </Form.Text>
                                )}
                            </Form.Group>
                        </Col>
                        
                        <Col md="3" xl="4" className="addPlantForm">
                            <Form.Label>Assigned To </Form.Label>
                        </Col>
                        <Col md="9" xl="8  pl-0" className="addPlantForm">
                            <Form.Group controlId="empId">
                                <AsyncTypeahead
                                    id="basic-typeahead-example" labelKey="fullName"
                                    options={this.state.employeeList}
                                    onChange={this.employeeCode}
                                    onSearch={this.getEmployeeList} 
                                    placeholder={this.state.taskAssigneeName}/>
                                {this.state.taskAssigneeName == '' ? (
                                    <Form.Text className="error-msg"> 
                                        Task assignee name is required
                                    </Form.Text>
                                ):null}
                            </Form.Group>
                        </Col>
                        
                        <Col md="3" xl="4" className="addPlantForm">
                            <Form.Label>Date</Form.Label>
                        </Col>
                        <Col md="9" xl="8  pl-0" className="addPlantForm">                                                     
                            <Form.Group className="datePicker">
                                <DatePicker 
                                defaultValue={this.state.taskDateString}
                                value={this.state.taskDateString} 
                                placeholderText={this.state.ClonetaskDateString}  minDate={new Date()} dateFormat="dd-MM-yyyy"
                                onChange={e => this.formValChange({ target: { name: 'taskDateString', value: e ? e : '' } })}/>
                                <i className="calIcon"></i>
                                {this.state.isError.taskDateString.length > 0 && (
                                    <Form.Text className="error-msg"> {this.state.isError.taskDateString} </Form.Text>
                                )}
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
                                    placeholder="--:--:--" onClick={this.openStartTimer}/>
                                    <img src={timeimg} alt="timeimg" style={{width:20}}  
                                    onClick={this.openStartTimer}/>
                                    </Form.Group>
                                </Col>
                                <Col md="6" xl="6">
                                    <Form.Group>
                                        <input type="text" readonly className="form-control"
                                        value={this.state.endTime}
                                        placeholder="--:--:--" onClick={this.openEndTimer}/>
                                        <img src={timeimg} alt="timeimg" style={{width:20}}  
                                        onClick={this.openEndTimer}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="3" xl="4" className="addPlantForm">
                            <Form.Label>Status</Form.Label>
                        </Col>
                        <Col md="9" xl="8  pl-0" className="addPlantForm">
                            <Form.Group className="option">
                                <Form.Control className={this.state.statusColor} value={this.state.taskStatus}
                                style={{color: '#5A5A5A !important'}} name="taskStatus"
                                as="select" onChange={this.taskStatusChangeEvent.bind(this)} placeholder="Select Status">
                                    <option value='In Progress'>In Progress</option>
                                    <option value='Overdue'>Overdue</option>
                                    <option value='Done' >Done</option>
                                </Form.Control>                               
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col xl="12 mt-4">
                    <div className="mediaUpload text-center">
                        <i className="icon icon-upload"></i>
                    </div>
                    <div>
                    {
                        this.state.startTimershow == true ? (
                            <div className="custom-timekeeper">
                                <TimeKeeper style={{marginTop: -250,marginLeft: 105}} 
                                time={this.state.startTime} 
                                onChange={(newTime) => this.startTimeKeper(newTime.formatted12)}/>
                                  <div className="closeBtn">
                                       <button onClick={this.closeStartTimer}>Done</button>
                                </div>
                            </div>
                        ):null
                    } 
                    {
                        this.state.endTimershow == true ? (
                            <div className="custom-timekeeper">
                                <TimeKeeper style={{marginTop: -250,marginLeft: 105}} 
                                time={this.state.endTime} 
                                onChange={(newTime) => this.endTimeKeper(newTime.formatted12)}/>
                                  <div className="closeBtn">
                                       <button onClick={this.closeEndTimer}>Done</button>
                                       </div>
                            </div>
                        ):null
                    } 
                    </div>
                </Col>
                <Col xl="12 text-center mt-4" className="modal-btn">
                {
                    this.state.taskAssigneeName == '' ? (
                        <Button variant="secondary" size="sm">Save</Button>  
                    ):(
                        <Button variant="secondary" className="verify-btn"
                        onClick={this.submitAssignTask} size="sm">Save</Button>  
                    )
                }                                      
                </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}

export default EditAssignTask;
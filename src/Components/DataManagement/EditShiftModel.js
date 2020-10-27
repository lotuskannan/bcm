import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Alert,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import TimeKeeper from 'react-timekeeper';
import timeimg from '../../assets/images/timeimg.png';
import './timestyle.css';
import * as DataManagementService from './DataManagementService';

function convertTime12to24(time12h){
    var martinVal =  time12h.split(' ')[1] == 'am' ? 'AM' : 'PM';
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

class EditShiftModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editShiftModelShow: props.editShiftModelShow,
            seletedEditShiftData:props.EditData,
            clientShiftMasterId:props.clientShiftMasterId,
            loader:false,inTime:props.EditData.inTime,
            errorInTime:props.EditData.inTime ? 0 : 1,
            inTimeClone: this.convertTime12to24(props.EditData.inTime),
            outTime:props.EditData.outTime,
            errorOutTimee:props.EditData.outTime ? 0:1,
            outTimeClone: this.convertTime12to24(props.EditData.outTime),plantsCardList:[],
            clientPlanAreaDetailId:props.EditData.clientPlantMaster.clientPlantMasterId,
            pageLoader:true,shiftName:props.EditData.clientShiftName,
            errorShiftName:props.EditData.clientShiftName.length == 0 ? true:false,
            MonColor:props.EditData.isWorkingOnMon == false ? '#ffffff':'#f4f4f4',
            TueColor:props.EditData.isWorkingOnTue == false ? '#ffffff':'#f4f4f4',
            WedColor:props.EditData.isWorkingOnWed == false ? '#ffffff':'#f4f4f4',
            ThuColor:props.EditData.isWorkingOnThurs == false ? '#ffffff':'#f4f4f4',
            FriColor:props.EditData.isWorkingOnFri == false ? '#ffffff':'#f4f4f4',
            SatColor:props.EditData.isWorkingOnSat == false ? '#ffffff':'#f4f4f4',
            SunColor:props.EditData.isWorkingOnSun == false ? '#ffffff':'#f4f4f4',errroColor:false,
            //startDateString:props.EditData.startDate.split('T')[0].split('-')[1]+'-'+props.EditData.startDate.split('T')[0].split('-')[2]+'-'+props.EditData.startDate.split('T')[0].split('-')[0],
           // ClonestartDateString:'',
            //endDateString:props.EditData.endDate.split('T')[0].split('-')[1]+'-'+props.EditData.endDate.split('T')[0].split('-')[2]+'-'+props.EditData.endDate.split('T')[0].split('-')[0],
            //CloneendDateString:'',
            startTime:props.EditData.inTime,
            endTime:props.EditData.outTime,
            initTime:this.DisplayCurrentTime(),
            startTimershow:false,endTimershow:false,
            newStartDate:new Date(props.EditData.startDate),
            newEndDate:new Date(props.EditData.endDate),
            newStartDateClone:'',
            newEndDateClone:'',
            shiftError: false, shiftErrorMsg: "", timeError: false
        }        
    }
    componentDidMount() {        
        localStorage.ShiftMsg = '';
        DataManagementService.getPlantList().then(Response => {
            this.setState({plantsCardList:Response.data.plantsCardList,pageLoader:false});            
        });
    }
    convertTime12to24=(time12h)=> {
        var martinVal =  time12h.split(' ')[1] == 'am' ? 'AM' : 'PM';
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
    openStartTimer = () => {
        var tm = this.DisplayCurrentTime();
        this.setState({ initTime: tm });
        this.setState({ startTimershow: true });
    }
    closeStartTimer = () => {
        if (this.state.startTime == '') {
            this.setState({ startTime: this.state.initTime });
        }
        this.setState({ startTimershow: false });
    }
    startTimeKeper = (param) => {
        var paramVal = param;
        var h = (paramVal.split(':')[0].length == 1) ? '0' + paramVal.split(':')[0] : paramVal.split(':')[0];
        var t = h + ':' + paramVal.split(':')[1];
        this.setState({ startTime: t });
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
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = hours + ":" + minutes + " " + am_pm;
        return time;
    };    
    setModalHide = () => {
        this.props.editShiftModelHide(false);
    }
    selectPlant=(Object)=>{
        this.setState({clientPlanAreaDetailId:Object.target.value})
    }
    inTimeEvent=(Object)=>{
        if(Object){
            this.setState({inTime:Object,errorInTime:0});                    
        }else{
            this.setState({errorInTime:1});
        }
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
    outTimeEvent=(Object)=>{
        if(Object){
            this.setState({outTime:Object});
            this.setState({errorOutTimee:0});           
        }else{
            this.setState({errorOutTimee:1});
        }
    }
    shiftNameEvent=(Object)=>{
        this.setState({shiftName:Object.target.value});
        this.setState({errorShiftName:Object.target.value.length == 0 ? true:false });
    }
    dayEvent=(e)=>{     
        if(e.target.value == 'Mon'){
            let color = (this.state.MonColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({MonColor: color});
        }
        if(e.target.value == 'Tue'){
            let color = (this.state.TueColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({TueColor: color});
        }
        if(e.target.value == 'Wed'){
            let color = (this.state.WedColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({WedColor: color});
        }
        if(e.target.value == 'Thu'){
            let color = (this.state.ThuColor == '#ffffff') ? '#f4f4f4':'#ffffff';           
            this.setState({ThuColor: color});
        }
        if(e.target.value == 'Fri'){
            let color = (this.state.FriColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({FriColor: color});
        }
        if(e.target.value == 'Sat'){
            let color = (this.state.SatColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({SatColor: color});
        }
        if(e.target.value == 'Sun'){
            let color = (this.state.SunColor == '#ffffff') ? '#f4f4f4':'#ffffff';
            this.setState({SunColor: color});
        }
         
        if(this.state.MonColor == '#ffffff' && this.state.TueColor == '#ffffff' && this.state.WedColor == '#ffffff' 
            && this.state.ThuColor == '#ffffff' && this.state.FriColor == '#ffffff' && this.state.SatColor == '#ffffff' &&
            this.state.SunColor == '#ffffff'){
                this.setState({errroColor:false});
        }else{
            this.setState({errroColor:true});
        }
    }
    saveShift=()=>{
        localStorage.ShiftMsg="";
        this.setState({ shiftErrorMsg: "", shiftError: false ,pageLoader: true})
        var onDate = new Date().toISOString();
        let PlantObj = [];
        for(var i=0;i<this.state.plantsCardList.length;i++){
            if(this.state.plantsCardList[i].clientPlantMasterId == this.state.clientPlanAreaDetailId){
                PlantObj = this.state.plantsCardList[i];
                break;
            }
        }
        // var s = document.getElementById('startDate').value;
        // var stDate = s.split('-')[2]+'-'+s.split('-')[1]+'-'+s.split('-')[0];
        // var e = document.getElementById('endDate').value;
        // var entDate = e.split('-')[2]+'-'+e.split('-')[1]+'-'+e.split('-')[0];

        let RequestObject = {
            "clientPlantMaster": PlantObj,
            "clientShiftMasterId": this.props.EditData.clientShiftMasterId,
            "clientShiftName": this.state.shiftName,
            "cntOrgId": sessionStorage.orgId,
            "createdBy": JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
            "createdOn": onDate,
            "endDate": null,
            "inTime": this.state.startTime.toString().toUpperCase(),
            "outTime": this.state.endTime.toString().toUpperCase(),
            "startDate": null,
            "updatedBy": JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
            "updatedOn": onDate,
            "isActive": 1,
            "isWorkingOnMon": this.state.MonColor == '#ffffff' ? false:true,
            "isWorkingOnTue": this.state.TueColor == '#ffffff' ? false:true,
            "isWorkingOnThurs":this.state.ThuColor == '#ffffff' ? false:true,
            "isWorkingOnWed": this.state.WedColor == '#ffffff' ? false:true,    
            "isWorkingOnFri": this.state.FriColor == '#ffffff' ? false:true,            
            "isWorkingOnSat": this.state.SatColor == '#ffffff' ? false:true,
            "isWorkingOnSun": this.state.SunColor == '#ffffff' ? false:true           
        };
        DataManagementService.saveClientShift(RequestObject).then(Response => {
            if (Response.data != null) {
                localStorage.ShiftMsg = Response.status.message;
                this.setModalHide();
            }
            else {
                this.setState({ shiftErrorMsg: Response.status.message, shiftError: true });
                setTimeout(() => {
                    this.setState({  shiftError: false})
                }, 3000);
            }

            this.setState({ pageLoader: false }); 
        }, error => {
            this.setState({ shiftErrorMsg:Response.status.message, shiftError: true })
            setTimeout(() => {
                this.setState({ shiftErrorMsg: "", shiftError: false })
            }, 3000);
            this.setState({ pageLoader: false });
        }).catch(error => {
            if (error.message == "Request failed with status code 401") {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ pageLoader: false });
                }, 3000);
            }
        });
    }
    startDateEvent=date=>{
        // const Param = new Date(object); 
        // const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
        // var date = new Date(DateValue);
        // this.setState({startDateString : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
        // this.setState({ClonestartDateString:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()}); 
        // this.setState({startDateString: date,ClonestartDateString: date,newStartDate:date});
        this.setState({newStartDateClone:date});
    }
    endDateEvent=date=>{
        // const Param = new Date(object); 
        // const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
        // var date = new Date(DateValue);
        // this.setState({endDateString : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
        // this.setState({CloneendDateString:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()});
        this.setState({newEndDateClone:date});        
    }
    render() {        
        return (
            <Modal id="rosterManagementModal-assign" show={this.state.editShiftModelShow} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered className="addShiftModel">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Edit Shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                {
                    this.state.pageLoader ? (
                       <div className="loader">
                          <Spinner animation="grow" variant="dark">
                          </Spinner>
                       </div>
                    ) : null
                 }
                  <Alert show={this.state.shiftError} variant="danger">
                    <div className="alert-container">
                        <p><i className="icons"></i> {this.state.shiftErrorMsg}</p>
                    </div>
                </Alert>
                    <Col xl="12">
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Branch</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control as="select" value={this.state.clientPlanAreaDetailId} 
                                    name="clientPlantMasterId" onChange={this.selectPlant.bind()}>
                                    {this.state.plantsCardList.map((Object, index) => <option key={index} value={Object.clientPlantMasterId}>
                                        {Object.plant}
                                    </option>)}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Shift Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="ShiftName" 
                                    placeholder="Shift Name" 
                                    value={this.state.shiftName}
                                    onChange={this.shiftNameEvent.bind(this)}
                                    />
                                    {this.state.shiftName == '' && this.state.errorShiftName == true ? (                                        
                                        <Form.Text className="error-msg"> Please enter the shift name </Form.Text>
                                    ):null
                                }  
                                </Form.Group>
                            </Col>
                            {/* <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Start Date</Form.Label>
                            </Col>
                            {
                                // newStartDateClone
                            }
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker">                               
                                    <DatePicker defaultValue={this.state.newStartDate} id="startDate" 
                                    selected={(this.state.newStartDateClone == '') ? this.state.newStartDate : this.state.newStartDateClone}
                                    value={(this.state.newStartDateClone == '') ? this.state.newStartDate : this.state.newStartDateClone}
                                    placeholderText="Start Date"
                                    minDate={new Date()} dateFormat="dd-MM-yyyy" onChange={this.startDateEvent.bind(this)}/>
                                    <i className="calIcon"></i>   
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>End Date</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker">
                                    <DatePicker defaultValue={this.state.newEndDate} id="endDate" 
                                    selected={(this.state.newEndDateClone == '') ? this.state.newEndDate : this.state.newEndDateClone}
                                    value={(this.state.newEndDateClone == '') ? this.state.newEndDate : this.state.newEndDateClone}
                                    placeholderText="Start Date"
                                    minDate={new Date()} dateFormat="dd-MM-yyyy" onChange={this.endDateEvent.bind(this)}/>
                                    <i className="calIcon"></i>                                       
                                </Form.Group>
                            </Col> */}
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>In-Time</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <input type="text" readonly className="form-control"
                                        value={this.state.startTime}
                                        placeholder="--:--:--" onClick={this.openStartTimer} />
                                    <img src={timeimg} alt="timeimg" style={{ width: 20 }}
                                        onClick={this.openStartTimer} />
                                    {
                                        (this.state.startTime == '' && this.state.submitflag == '1') ? (
                                            <Form.Text className="error-msg">In-Time is required</Form.Text>
                                        ) : null
                                    }
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Out-Time</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <input type="text" readonly className="form-control"
                                        value={this.state.endTime}
                                        placeholder="--:--:--" onClick={this.openEndTimer} />
                                    <img src={timeimg} alt="timeimg" style={{ width: 20 }}
                                        onClick={this.openEndTimer} />
                                    {
                                        (this.state.endTime == '' && this.state.submitflag == '1') ? (
                                            <Form.Text className="error-msg">Out-Time is required</Form.Text>
                                        ) : null
                                    }
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Shift Days</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group className="weekdays">            
                                    <input type="button" id="Mon" name="Mon" value="Mon" style={{backgroundColor:this.state.MonColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Tue" name="Tue" value="Tue" style={{backgroundColor:this.state.TueColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Wed" name="Wed" value="Wed" style={{backgroundColor:this.state.WedColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Thu" name="Thu" value="Thu" style={{backgroundColor:this.state.ThuColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Fri" name="Fri" value="Fri" style={{backgroundColor:this.state.FriColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Sat" name="Sat" value="Sat" style={{backgroundColor:this.state.SatColor}} onClick={this.dayEvent.bind(this)}/>
                                    <input type="button" id="Sun" name="Sun" value="Sun" style={{backgroundColor:this.state.SunColor}} onClick={this.dayEvent.bind(this)}/>                                   
                                </Form.Group>
                                {this.state.MonColor == '#ffffff' && this.state.TueColor == '#ffffff' &&
                                        this.state.WedColor == '#ffffff' && this.state.ThuColor == '#ffffff' &&
                                        this.state.FriColor == '#ffffff' && this.state.SatColor == '#ffffff' &&
                                        this.state.SunColor == '#ffffff' && this.state.submitflag == 1 ? (
                                            <Form.Text className="error-msg"> Please select Shift Days </Form.Text>
                                        ) : null
                                    }
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
                        </Row>
                    </Col>
                   
                    <Col xl="12 text-center mt-4" className="modal-btn dataManagement-btn justify-content-center">
                            <button className="btn" onClick={this.setModalHide}>Cancel</button>
                            {
                                this.state.shiftName != '' && this.state.clientPlanAreaDetailId != '0' && this.state.startTime != ''
                                    && this.state.endTime != '' ? 
                                    (
                                        this.state.MonColor == '#ffffff' && this.state.TueColor == '#ffffff' && this.state.WedColor == '#ffffff' &&
                                            this.state.ThuColor == '#ffffff' && this.state.FriColor == '#ffffff' &&
                                            this.state.SatColor == '#ffffff' && this.state.SunColor == '#ffffff' ?
                                            (
                                                <button className="btn" style={{ backgroundColor: '#ffffff' }}
                                                    onClick={this.assignShiftValidation}>Save</button>
                                            ) : (
                                                <button className="btn" onClick={this.saveShift}>Save</button>
                                            )
                                    ) : (
                                        <button className="btn" style={{ backgroundColor: '#ffffff' }}
                                            onClick={this.assignShiftValidation}>Save</button>
                                    )
                            }

                        </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default EditShiftModel;
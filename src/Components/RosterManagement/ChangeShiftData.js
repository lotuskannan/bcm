import React, { Component, Fragment } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as RosterManagementService from './RosterManagementService';
import './swapcolor.css';

class ChangeShiftData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ChangeShiftModelShow: props.ChangeShiftModelShow,
            loader: true,
            getAllEmp:[],
            getAllEmpName:[],
            AllClientShiftMaster:[],
            AllPlantMasterData:[],
            PlantLocation:'',selectBranchData:'',
            selectShiftName:'',ShiftName:0,selectAssignShiftData:0,
            selectBranchObject:[],selectShiftData:[],selectShiftDataFlag:0,
            startDateString:0,
            ClonestartDateString:0,
            endDateString:0,
            CloneendDateString:0,
            addEmployeFiledCount:[{
                userName: ''                
            }],
            addEmployeFiledCounts:[{
                userName: ''                
            }],
            selectEmpCount:0,
            selectNewAssignShiftName:0,
            selectNewAssignShiftText:'',
            getAllShiftLine:[],
            filterUsers:[],
            cloneFilterUsers:[],
            newemp:[],
            startDate:'',
            cloneStartDate:'',
            endDate:'',
            cloneEndDate:'',
            submitChangeshiftEvent:0,
            selectEmpFlag:0,
            assignTime:''    
        }        
    }
    async componentDidMount() {
        localStorage.ChangeShiftRes = 0;
        this.setState({loader: true});       
        const res1 = await this.getAllPlantMaster();
        // const res2 = await this.getAllClientShiftMaster();
        const res3 = await this.allEmp();
        const res4 = await this.init();
        if(res1 == true && res3 == true && res4 == true){
            this.setState({loader: false});       
        } 
    }
    getAllPlantMaster=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllPlantMaster().then(Response => {
            this.setState({AllPlantMasterData:Response.data,loader: false});
            return true;
        });       
    }   
    getAllClientShiftMaster=(clientPlantMasterId)=>{
        // this.setState({loader: true}); 
        // RosterManagementService.getAllClientShiftMaster().then(Response => {
        //     this.setState({AllClientShiftMaster:Response.data,loader: false});
        //     return true;
        // });
        
        RosterManagementService.getShiftBasesOnPlant(clientPlantMasterId).then(Response => {
            var tempObj = [];
            if(Response.data){
                for(var i=0;i<Response.data.length;i++){
                    tempObj.push({
                        clientShiftMasterId:Response.data[i].clientShiftMasterId,
                        clientShiftName:Response.data[i].clientShiftName,
                        inTime:Response.data[i].inTime,
                        outTime:Response.data[i].outTime,
                        startDate:Response.data[i].startDate,
                        endDate:Response.data[i].endDate,
                        clientPlantMasterId:Response.data[i].clientPlantMaster.clientPlantMasterId
                    });
                }
            }
            // this.setState({AllClientShiftMaster:tempObj,AllClientShiftflag:tempObj.length,ShiftName:0});
            this.setState({AllClientShiftMaster:tempObj});
        });            
    }
    init=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllShiftLine().then(Response => {
           if(Response.data){
              let Data = [];
              for(var i=0;i<Response.data.length;i++){                 
                Data.push({
                    bcmUserId:Response.data[i].bcmUser.bcmUserId,
                    clientShiftLineId:Response.data[i].clientShiftLineId,
                    clientShiftMasterId:Response.data[i].clientShiftMaster.clientShiftMasterId,
                    clientPlantMasterId:Response.data[i].clientShiftMaster.clientPlantMaster.clientPlantMasterId,
                    plant:Response.data[i].clientShiftMaster.clientPlantMaster.plant,
                    location:Response.data[i].clientShiftMaster.clientPlantMaster.location,
                    clientShiftName:Response.data[i].clientShiftName,
                    inTime:Response.data[i].clientShiftMaster.inTime,
                    outTime:Response.data[i].clientShiftMaster.outTime,
                    isWorkingOnMon:Response.data[i].clientShiftMaster.isWorkingOnMon,
                    isWorkingOnTue:Response.data[i].clientShiftMaster.isWorkingOnTue,
                    isWorkingOnWed:Response.data[i].clientShiftMaster.isWorkingOnWed,
                    isWorkingOnThurs:Response.data[i].clientShiftMaster.isWorkingOnThurs,
                    isWorkingOnFri:Response.data[i].clientShiftMaster.isWorkingOnFri,
                    isWorkingOnSat:Response.data[i].clientShiftMaster.isWorkingOnSat,
                    isWorkingOnSun:Response.data[i].clientShiftMaster.isWorkingOnSun,
                    startDate:Response.data[i].clientShiftMaster.startDate,
                    endDate:Response.data[i].clientShiftMaster.endDate,
                    userName:Response.data[i].userName,
                    department:Response.data[i].bcmUser.department,
                    designation:Response.data[i].bcmUser.designation,
                    inTimeOutTime:Response.data[i].clientShiftMaster.inTime+" - "+Response.data[i].clientShiftMaster.outTime                  
                 });
              }             
              this.setState({getAllShiftLine:Data,loader: false});              
           }         
        });
    }
    allEmp=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllEmp().then(Response => {
            var temp = [];
            var TempgetAllEmpName = [];            
            Response.data.forEach(function(data, index) {
                temp.push({
                    department:data.department,
                    designation:data.designation,
                    firstName:data.firstName,
                    lastName:data.lastName,
                    userCode:data.userCode,
                    bcmUserId:data.bcmUserId,
                    fullname:data.firstName+" "+data.lastName,
                    clientShiftMasterId:(data.clientShiftMaster == null) ? '' : data.clientShiftMaster.clientShiftMasterId               
                });
                TempgetAllEmpName.push({
                    fullname:data.firstName+" "+data.lastName,
                    bcmUserId:data.bcmUserId
                })
                
            });
            this.setState({getAllEmp:temp,getAllEmpName:TempgetAllEmpName,loader: false});
            return true;
        });        
    }
    selectPlantLocation=(object)=>{
        let tempPlantLocation = 0;
        let selectBranchObject = [];
        this.setState({selectShiftData:[],selectShiftDataFlag:0,selectBranchData:'',PlantLocation:''});
        this.setState({startDateString:'',endDateString:'',selectShiftName:'',ShiftName:0,selectAssignShiftData:'',selectNewAssignShiftName:0});
        this.setState({addEmployeFiledCount:''});
        this.setState({addEmployeFiledCounts:[{userName:''}]});

        for(var i=0;i<this.state.AllPlantMasterData.length;i++){
            if(this.state.AllPlantMasterData[i].clientPlantMasterId == object.target.value){
                tempPlantLocation = this.state.AllPlantMasterData[i].clientPlantMasterId;
                this.setState({selectBranchData:this.state.AllPlantMasterData[i].clientPlantMasterId});
                selectBranchObject = this.state.AllPlantMasterData[i];
                break;                
            }
        }
        // for(var M=0;M<this.state.AllClientShiftMaster.length;M++){
        //     if(this.state.AllClientShiftMaster[M].clientPlantMasterId == tempPlantLocation){
        //         this.getAllClientShiftMaster(this.state.AllClientShiftMaster[M].clientPlantMasterId);               
        //     }
        // }
        this.getAllClientShiftMaster(tempPlantLocation);
        this.setState({PlantLocation:tempPlantLocation,selectBranchObject:selectBranchObject});        
    }
    splitDate=(DateValue)=>{        
        return DateValue.split('T')[0].split('-')[1]+'-'+DateValue.split('T')[0].split('-')[2]+'-'+DateValue.split('T')[0].split('-')[0];
    }
    addEmployeFiled=(object,index,array)=>{
        this.setState(prevState => ({ addEmployeFiledCounts: [...prevState.addEmployeFiledCounts, { userName: '' }] }));
    }
    removeEmployeFiled=(object,index,array)=>{        
        let addEmployeFiledCounts = [...this.state.addEmployeFiledCounts];
        let temp = [];
        for(var i=0;i<addEmployeFiledCounts.length;i++){
            if(addEmployeFiledCounts[i].userName == object.userName){                
            }else{
                temp.push({
                    userName:addEmployeFiledCounts[i].userName
                });
            }
        }
        this.setState({addEmployeFiledCounts:temp});       
    }
    getEmpUserID=()=>{
        var IDs = [];
        for(var i=0;i<document.getElementsByClassName('rbt-input').length;i++){
            if(document.getElementsByClassName('rbt-input')[i].value !=''){
                let fullname = document.getElementsByClassName('rbt-input')[i].value;
                let uid = this.searchName(fullname);
                IDs.push({
                    id:uid.split(',')[0],
                    name:uid.split(',')[1]
                });                
            }else if(document.getElementsByClassName('rbt-input')[i].placeholder != 'Add Employee'){
                let fullname = document.getElementsByClassName('rbt-input')[i].placeholder;
                let uid = this.searchName(fullname);
                IDs.push({
                    id:uid.split(',')[0],
                    name:uid.split(',')[1]
                });
            }
        }
        return IDs;         
    }
    searchName=(fullname)=>{
        for(var i=0;i<this.state.getAllEmp.length;i++){
            if(this.state.getAllEmp[i].fullname == fullname){
                return this.state.getAllEmp[i].bcmUserId+","+this.state.getAllEmp[i].fullname;
            }
        }
    }
    selectEmp=(e)=>{
        var count = 0;
        for(var i=0;i<document.getElementsByClassName('rbt-input').length;i++){
            if(document.getElementsByClassName('rbt-input')[i].placeholder == 'Add Employee'){                
            }else{
                count++;
            }
        }
        this.setState({selectEmpCount:count});        
    }
    setModalHide = () => {
        this.props.HideChangeShiftModelShow(false);
    }
    selectAssignShift=(object)=>{
        this.setState({selectShiftName:object.target.selectedOptions[0].text});
        this.setState({ShiftName:object.target.value,selectAssignShiftData:object.target.value});
        this.setState({addEmployeFiledCount:''});
        this.setState({addEmployeFiledCounts:[{userName:''}]});
        var tempFilterUsers=[];
        var tempUname = [];
        for(var i=0;i<this.state.getAllShiftLine.length;i++){
            if(this.state.getAllShiftLine[i].clientPlantMasterId == this.state.PlantLocation &&
                this.state.getAllShiftLine[i].clientShiftName == object.target.selectedOptions[0].text){
                tempFilterUsers.push({
                    "bcmUserId": this.state.getAllShiftLine[i].bcmUserId,
                    "clientShiftLineId": this.state.getAllShiftLine[i].clientShiftLineId,
                    "clientShiftMasterId": this.state.getAllShiftLine[i].clientShiftMasterId,
                    "clientPlantMasterId": this.state.getAllShiftLine[i].clientPlantMasterId,
                    "plant": this.state.getAllShiftLine[i].plant,
                    "location": this.state.getAllShiftLine[i].location,
                    "clientShiftName": this.state.getAllShiftLine[i].clientShiftName,
                    "inTime": this.state.getAllShiftLine[i].inTime,
                    "outTime": this.state.getAllShiftLine[i].outTime,
                    "isWorkingOnMon": this.state.getAllShiftLine[i].isWorkingOnMon,
                    "isWorkingOnTue": this.state.getAllShiftLine[i].isWorkingOnTue,
                    "isWorkingOnWed": this.state.getAllShiftLine[i].isWorkingOnWed,
                    "isWorkingOnThurs": this.state.getAllShiftLine[i].isWorkingOnThurs,
                    "isWorkingOnFri": this.state.getAllShiftLine[i].isWorkingOnFri,
                    "isWorkingOnSat": this.state.getAllShiftLine[i].isWorkingOnSat,
                    "isWorkingOnSun": this.state.getAllShiftLine[i].isWorkingOnSun,
                    "startDate": this.state.getAllShiftLine[i].startDate,
                    "endDate": this.state.getAllShiftLine[i].endDate,
                    "userName": this.state.getAllShiftLine[i].userName,
                    "department": this.state.getAllShiftLine[i].department,
                    "designation": this.state.getAllShiftLine[i].designation,
                    "inTimeOutTime": this.state.getAllShiftLine[i].inTimeOutTime
                });
                tempUname.push({
                    userName:this.state.getAllShiftLine[i].userName
                });
                
                for(var m=0;m<this.state.AllClientShiftMaster.length;m++){
                    if(this.state.AllClientShiftMaster[m].clientShiftMasterId == object.target.value){
                        let sDate = new Date(this.state.AllClientShiftMaster[m].startDate);
                        let eDate = new Date(this.state.AllClientShiftMaster[m].endDate);
                        this.setState({startDateString:sDate,endDateString:eDate});    
                    }
                }                                                         
            }            
        }
        if(tempUname.length == 0){
            this.setState({filterUsers:[]});
            this.setState({addEmployeFiledCounts:[{userName:''}]});
        }else{
            this.setState({filterUsers:tempFilterUsers});
            this.setState({addEmployeFiledCounts:tempUname});
        }        
        this.selectEmpFlag();
    }
    selectNewAssignShift=(object)=>{
        this.setState({selectNewAssignShiftName:object.target.value});
        this.setState({selectNewAssignShiftText:object.target.selectedOptions[0].text});
        let assignTime = '';
        for(var i=0;i<this.state.AllClientShiftMaster.length;i++){
            if(object.target.value == this.state.AllClientShiftMaster[i].clientShiftMasterId){
                assignTime = this.state.AllClientShiftMaster[i].inTime;
            }
        }
        this.setState({assignTime:assignTime});        
    }
    handleChange=(name,object)=>{
        if(name == 'startDate'){
           
            const Param = new Date(object); 
            const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
            var date = new Date(DateValue);
            this.setState({startDate : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
            this.setState({cloneStartDate:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()});
        }
        if(name == 'endDate'){
            
            const Param = new Date(object); 
            const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
            var date = new Date(DateValue);
            this.setState({endDate : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
            this.setState({cloneEndDate:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()}); 
        }
    }
    startDateEvent=(object)=>{
        const Param = new Date(object); 
        const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
        var date = new Date(DateValue);
        this.setState({startDateString : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
        this.setState({ClonestartDateString:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()}); 
    }
    endDateEvent=(object)=>{
        const Param = new Date(object); 
        const DateValue = Param.getFullYear()+'-'+Param.getMonth()+'-'+Param.getDate();
        var date = new Date(DateValue);
        this.setState({endDateString : date.toLocaleString().split(',')[0].replace(/[/]/g, '-')});
        this.setState({CloneendDateString:Param.getDate()+'-'+Param.getMonth()+'-'+Param.getFullYear()}); 
    }
    changeshift=()=>{
        this.setState({submitChangeshiftEvent:1});
        if(this.state.startDateString !='' && this.state.endDateString !='' && 
        this.state.ShiftName !='0' && this.state.selectAssignShiftData !='0' &&
        this.state.selectNewAssignShiftName !='0' ){
            let count = this.selectEmpFlag();
            if(count !='0'){
                var eId = this.getEmpUserID();
                const promises = eId.map(item => {
                    let ReqObject = [];
                    ReqObject ={
                        "bcmUser": {
                            "bcmUserId": parseInt(item.id)
                        },
                        "clientShiftMaster": {
                            "clientShiftMasterId":  parseInt(this.state.selectNewAssignShiftName)
                        },
                        "clientShiftName":this.state.selectNewAssignShiftText,
                        "cntOrgId": sessionStorage.orgId,
                        "createdBy": 1,
                        "isActive": 1,
                        "updatedBy": 1,
                        "userName": item.name
                    };
                    let flag = this.findAlredyAssignShif(item.id);
                    if(flag == '' || flag == null){
                       return this.axiosFunction(ReqObject);
                    }else{
                        var newReqObj = Object.assign(ReqObject, {'clientShiftLineId':flag});
                        return this.axiosFunction(newReqObj);
                    }
                });

                Promise.all(promises).then(results => {
                    localStorage.ChangeShiftRes = 1;
                    this.setModalHide();   
                });
            }
            else{
            }
        }else{            
        }
    }
    
    findAlredyAssignShif=(userid)=>{
        for(var i=0;i<this.state.getAllShiftLine.length;i++){
            if(this.state.getAllShiftLine[i].bcmUserId == userid){
                return parseInt(this.state.getAllShiftLine[i].clientShiftLineId);
            }
        }
        return '';
    }
    async axiosFunction(ReqObject) {
        const res = await RosterManagementService.saveAssignShift(ReqObject).then(Response => {
            var msg = "Hi "+ReqObject.userName+ ", your shift has been changed from "+this.state.selectShiftName+" to "+ ReqObject.clientShiftName+' which starts by '+this.state.assignTime;
            var uid = ReqObject.bcmUser.bcmUserId;
            RosterManagementService.setPushNotification(msg,uid).then(NotifyResponse => {
                return true;
            }).catch(error => {
                return true;
            });
            return true;
        });
        return res;
    }
    selectEmpFlag=()=>{
        var count = 0;
        for(var i=0;i<document.getElementsByClassName('rbt-input').length;i++){
            if(document.getElementsByClassName('rbt-input')[i].value !=''){
                count++;
            }else if(document.getElementsByClassName('rbt-input')[i].placeholder != 'Add Employee'){
                count++;
            }            
        }
        this.setState({selectEmpFlag:count});
        return count;
    }
    render() {
        return (
            <Modal id="changeShiftDataModal" show={this.state.ChangeShiftModelShow} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                    Change Shift
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.Loader ? <div className="loader">
                    <Spinner animation="grow" variant="dark" />
                </div> : null}
                <Row>
                    <Col xl="12">
                        <Row className="align-items-center">                          
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                        <Form.Label>Branch</Form.Label>
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                        <Form.Group>
                            <Form.Control as="select" value={this.state.PlantLocation} name="clientPlanAreaDetailId" 
                            style={{color: '#5A5A5A !important'}} onChange={this.selectPlantLocation.bind(this)}>
                            <option value={0} selected>Branch</option>
                                {this.state.AllPlantMasterData.map((PlantObject, index) => <option key={index}
                                value={PlantObject.clientPlantMasterId}>{PlantObject.location}
                                </option>)}
                            </Form.Control>
                            {
                                ((this.state.PlantLocation == '0' || this.state.PlantLocation == '') && this.state.submitChangeshiftEvent == '1') ? (
                                    <Form.Text className="error-msg"> Branch name is required </Form.Text>
                                ):null
                            }                               
                        </Form.Group>                                
                    </Col>
                    {
                        this.state.PlantLocation != 0 || this.state.PlantLocation != '' ? (                           
                        <Fragment id="firstFragment" name="firstFragment">                        
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Shift</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.ShiftName} name="clientPlanAreaDetailId" 
                                        style={{color: '#5A5A5A !important'}} onChange={this.selectAssignShift}>
                                        <option value={0} selected>From</option>
                                        {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                            value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                            </option>)}
                                        </Form.Control>  
                                        {
                                            (this.state.ShiftName == '0' &&  this.state.submitChangeshiftEvent == '1') ? (
                                                <Form.Text className="error-msg"> From shift is required </Form.Text>
                                            ):null
                                        }                                     
                                    </Form.Group>    
                                </Col>   
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" name="clientPlanAreaDetailId"
                                        value={this.state.selectNewAssignShiftName} 
                                        style={{color: '#5A5A5A !important'}}  onChange={this.selectNewAssignShift.bind(this)}>
                                        <option value={0} selected>To</option>
                                            {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                            value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                            </option>)}
                                        </Form.Control>
                                        {
                                            (this.state.selectNewAssignShiftName == '0' &&  this.state.submitChangeshiftEvent == '1')? (
                                                <Form.Text className="error-msg"> To shift is required </Form.Text>
                                            ):null
                                        }                                        
                                    </Form.Group>    
                                </Col>                                
                            </Row>
                        </Col>
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Date</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">                             
                            <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker" style={{ pointerEvents: 'none' }} >                             
                                    <DatePicker defaultValue={this.state.startDateString} 
                                    selected={this.state.startDateString} value={this.state.startDateString}
                                    placeholderText="From" dateFormat="dd-MM-yyyy" minDate={new Date()}
                                    onChange={this.startDateEvent.bind(this)} style={{ pointerEvents: 'none' }} /> <i className="calIcon"></i>
                                    {
                                        this.state.startDateString == '' && this.state.submitChangeshiftEvent == '1' ? (
                                            <Form.Text className="error-msg">Start date is required </Form.Text>
                                        ):null
                                    }  
                                    </Form.Group>
                            </Col>
                            <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker" style={{ pointerEvents: 'none' }} >
                                    <DatePicker defaultValue={this.state.endDateString} value={this.state.endDateString} 
                                    selected={this.state.endDateString} placeholderText="To" dateFormat="dd-MM-yyyy"
                                    onChange={this.endDateEvent.bind(this)} style={{ pointerEvents: 'none' }} /> <i className="calIcon"></i>
                                    {
                                        this.state.endDateString == '' && this.state.submitChangeshiftEvent == '1' ? (
                                            <Form.Text className="error-msg">End date is required </Form.Text>
                                        ):null
                                    } 
                                </Form.Group>
                            </Col>
                            </Row>
                        </Col>
                        
                            <Col xs={3} sm="3" xl="4" className="addPlantForm assignShift-media">
                                <Form.Label>Employee Selected</Form.Label>
                                <div class="mediaUpload text-center"><i class="icon icon-upload"></i></div>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                {
                                    this.state.addEmployeFiledCounts.map((el, i) => (
                                        <Form.Group className="d-flex align-items-center add-field">
                                            <p className="mb-0" style={{marginRight: 3}}>{i+1}.</p>
                                            <AsyncTypeahead id="multipleEmployeName" name="multipleEmployeName"
                                            className={el.userName == '' ? 'multipleEmployeName' : 'multipleEmployeName empName'}
                                            onChange={this.selectEmp} labelKey="fullname"
                                            options={this.state.getAllEmpName} value={el.userName}
                                            placeholder={el.userName == '' ? 'Add Employee' : el.userName}/>
                                            <div className="action">
                                                {
                                                    (this.state.addEmployeFiledCounts.length == (i+1)) ? (
                                                        <i className="icon addIcon" onClick={this.addEmployeFiled.bind(this,el,i)}></i>
                                                    ):null
                                                }                   
                                                <i className="icon deleteIcon mr-1" onClick={this.removeEmployeFiled.bind(this, el,i)}></i>
                                            </div>
                                        </Form.Group>
                                    ))
                                }
                                {
                                    (this.state.selectEmpFlag == '0' &&  this.state.submitChangeshiftEvent == '1') ? (
                                        <Form.Text className="error-msg"> Please assign any one employee  </Form.Text>
                                    ):null
                                }
                            </Col>                                               
                        </Fragment>
                        ):(
                        <Fragment id="secFragment" name="secFragment">                           
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Shift</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">
                            <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control as="select"
                                    style={{opacity: '0.4',pointerEvents: 'none'}}>
                                        <option value={0} selected>From</option>                                            
                                    </Form.Control>
                                    {
                                        (this.state.submitChangeshiftEvent == '1') ? (
                                            <Form.Text className="error-msg"> From shift is required </Form.Text>
                                        ):null
                                    }                                         
                                </Form.Group>    
                            </Col>
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select"
                                        style={{opacity: '0.4',pointerEvents: 'none'}}>
                                            <option value={0} selected>To</option>                                            
                                        </Form.Control>
                                        {
                                            (this.state.submitChangeshiftEvent == '1') ? (
                                                <Form.Text className="error-msg"> To shift is required </Form.Text>
                                            ):null
                                        }                                      
                                    </Form.Group>    
                                </Col>                                
                            </Row>
                        </Col>
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Date</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group className="datePicker">
                                        <Form.Control type="text" placeholder="From"
                                        style={{opacity: '0.9',pointerEvents: 'none'}}/>
                                        <i className="calIcon"></i>
                                        {
                                            (this.state.submitChangeshiftEvent == '1') ? (
                                                <Form.Text className="error-msg"> From date is required </Form.Text>
                                            ):null
                                        }                                
                                    </Form.Group>
                                </Col>
                            <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker">
                                    <Form.Control type="text" placeholder="To" 
                                    style={{opacity: '0.9',pointerEvents: 'none'}}/>
                                    <i className="calIcon"></i>
                                    {
                                        (this.state.submitChangeshiftEvent == '1') ? (
                                            <Form.Text className="error-msg"> To date is required </Form.Text>
                                        ):null
                                    }
                                </Form.Group>
                            </Col>
                            </Row>
                        </Col>
                            <Col xs={12} className="addPlantForm">
                                <Form.Label>Employee Selected</Form.Label>
                            </Col>
                            
                            <Col xs={12} className="addPlantForm">    
                            <Row className="ml-0">
                                <Col xs={12} sm="3" xl="4" className="addPlantForm assignShift-media order-2 order-md-1">
                                <div class="mediaUpload text-center"><i class="icon icon-upload"></i></div>
                                </Col>
                                <Col xs={12} sm="9" xl="8 pl-0" className="addPlantForm order-1 order-md-2">  
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">1.</p>
                                <Form.Control type="text" style={{opacity: '0.9',pointerEvents: 'none'}} placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">2.</p>
                                <Form.Control type="text" style={{opacity: '0.9',pointerEvents: 'none'}}placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">3.</p>
                                <Form.Control type="text" style={{opacity: '0.9',pointerEvents: 'none'}} placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">4.</p>
                                <Form.Control type="text" style={{opacity: '0.9',pointerEvents: 'none'}} placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon addIcon"></i>
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>  
                                </Col>
                            </Row>                        
                                
                            </Col>                                           
                            </Fragment>
                        )
                    }                            
                    </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                           <button className="btn" onClick={this.setModalHide}>Cancel</button>
                           <button className="btn" onClick={this.changeshift}>Swap</button>
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}
export default ChangeShiftData;
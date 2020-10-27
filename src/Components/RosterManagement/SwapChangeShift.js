import React, { Component, Fragment } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as RosterManagementService from './RosterManagementService';
import './swapcolor.css';

class SwapChangeShift extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loader:true,
            AllPlantMasterData:[],
            AllClientShiftMaster:[],
            getAllShiftLine:[],
            getAllEmp:[],
            getAllEmpName:[],
            getAllEmpClone:[],
            getAllEmpNameClone:[],
            showSwapChangeShiftModel:props.showSwapChangeShiftModel,
            rowData:props.rowData,
            addEmployeFiledCounts:[{
                fullname: ''                
            }],
            PlantLocation:props.rowData[0].branchID,
            fromShift:props.rowData[0].shiftID,
            toShift:0,
            toShiftText:'',      
            swapClick:0,
            fromShiftname:'',
            assignTime:'',
            clientPlantMasterId:props.clientPlantMasterId
        }          
    }
    async componentDidMount() {
        localStorage.swapEmpShiftRes = 0;
        this.setState({loader: true});
        const res1 = await this.getAllPlantMaster();
        // const res2 = await this.getAllClientShiftMaster();
        const res2 = await this.getShiftBasesOnPlant();
        const res3 = await this.init();
        const res4 = await this.allEmp();                 
    }
    getShiftBasesOnPlant=()=>{
        let clientPlantMasterId = this.props.clientPlantMasterId;
        RosterManagementService.getShiftBasesOnPlant(clientPlantMasterId).then(Response => {
            var tempObj = [];
            if(Response.data){
                for(var i=0;i<Response.data.length;i++){
                    tempObj.push({
                        clientShiftMasterId:Response.data[i].clientShiftMasterId,
                        clientShiftName:Response.data[i].clientShiftName,
                        inTime:Response.data[i].inTime,
                        outTime:Response.data[i].outTime,
                    });
                }
            }
            // this.setState({AllClientShiftMaster:tempObj,AllClientShiftflag:tempObj.length,ShiftName:0});
            this.setState({AllClientShiftMaster:tempObj,ShiftName:this.props.rowData.clientShiftMasterId,pageLoader:false});
        });
    }
    assignEmp=()=>{
        this.setState({loader: true})
        var count = 0;
        let tempUname = [];
        for(var i=0;i<this.state.getAllShiftLine.length;i++){
            if(this.state.getAllShiftLine[i].clientPlantMasterId == this.props.rowData[0].branchID &&
                this.state.getAllShiftLine[i].clientShiftMasterId == this.props.rowData[0].shiftID){                    
                for(var M=0;M<this.props.rowData.length;M++){
                    if(this.state.getAllShiftLine[i].bcmUserId == this.props.rowData[M].bcmUserId){
                        tempUname.push({
                            fullname:this.state.getAllShiftLine[i].userName
                        });
                    }                   
                }
            }            
        }
        this.setState({addEmployeFiledCounts:tempUname});        
        this.setState({loader: false});   
    }
    branchEvent=(object)=>{
        this.setState({PlantLocation:object.target.value,fromShift:0,toShift:0});
        this.setState({addEmployeFiledCounts:[{fullname: ''}]});         
    }  
    fromShiftEvent=(object)=>{
        this.setState({loader: true});          
        this.setState({fromShift:object.target.value,fromShiftname:object.target.selectedOptions[0].text});
        this.setState({addEmployeFiledCounts:[{fullname: ''}]});
        let tempUname = [];
        for(var i=0;i<this.state.getAllShiftLine.length;i++){
            if(this.state.getAllShiftLine[i].clientPlantMasterId == this.state.PlantLocation &&
                this.state.getAllShiftLine[i].clientShiftMasterId == object.target.value){                    
                tempUname.push({
                    fullname:this.state.getAllShiftLine[i].userName
                });
            }            
        }
        if(tempUname.length == 0){
            this.setState({addEmployeFiledCounts:[{fullname: ''}],loader: false,toShift:0});
        }else{
            this.setState({addEmployeFiledCounts:tempUname,loader: false,toShift:0});
        }         
    }
    toShiftEvent=(object)=>{
        this.setState({toShift:object.target.value,toShiftText:object.target.selectedOptions[0].text});
        let assignTime = '';
        for(var i=0;i<this.state.AllClientShiftMaster.length;i++){
            if(object.target.value == this.state.AllClientShiftMaster[i].clientShiftMasterId){
                assignTime = this.state.AllClientShiftMaster[i].inTime;
            }
        }
        this.setState({assignTime:assignTime});       
    }
    getAllPlantMaster=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllPlantMaster().then(Response => {
            this.setState({AllPlantMasterData:Response.data,loader: false});
            return true;
        });       
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
        return count;
    }
    swapEmpShift= async () =>{    
        this.setState({swapClick:1});
        if(this.state.PlantLocation == '0' && this.state.fromShift == '0' && this.state.toShift == '0'){                                    
        }else{
            let count = this.selectEmpFlag();
            if(count !='0'){   
                // this.loopfun();               
                // this.setModalHide();                 
                var eId = this.getEmpUserID();
                const promises = eId.map(item => {
                    let ReqObject = [];
                    ReqObject ={
                        "bcmUser": {
                            "bcmUserId": parseInt(item.id)
                        },
                        "clientShiftMaster": {
                            "clientShiftMasterId": parseInt(this.state.toShift)
                        },
                        "clientShiftName":this.state.toShiftText,
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
                    localStorage.swapEmpShiftRes = 1;
                    this.setModalHide();   
                })
            }
        }
    }
    loopfun=()=>{
        var eId = this.getEmpUserID();
        for(var i=0;i<eId.length;i++){                   
            let ReqObject = [];
            ReqObject ={
                "bcmUser": {
                    "bcmUserId": parseInt(eId[i].id)
                },
                "clientShiftMaster": {
                    "clientShiftMasterId": parseInt(this.state.toShift)
                },
                "clientShiftName":this.state.toShiftText,
                "cntOrgId": sessionStorage.orgId,
                "createdBy": 1,
                "isActive": 1,
                "updatedBy": 1,
                "userName": eId[i].name
            };
            let flag = this.findAlredyAssignShif(eId[i].id);
            if(flag == ''){
                this.axiosFunction(ReqObject);
            }else{
                var newReqObj = Object.assign(ReqObject, {'clientShiftLineId':flag});
                this.axiosFunction(newReqObj);
            }                   
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
            var msg = "Hi "+ReqObject.userName+", your shift has been changed from "+document.getElementById('fromshift').selectedOptions[0].text+" to "+ReqObject.clientShiftName+' which starts by '+this.state.assignTime;
            var uid = ReqObject.bcmUser.bcmUserId;
            RosterManagementService.setPushNotification(msg,uid).then(NotifyResponse => {
                return true;
            }).catch(error => {
                return true;
            });
        });
        return res;
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
    getAllClientShiftMaster=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllClientShiftMaster().then(Response => {
            this.setState({AllClientShiftMaster:Response.data,loader: false});
            return true;            
        });        
    }
    init=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllShiftLine().then(Response => {
        this.setState({loader: true});
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
              this.setState({getAllShiftLine:Data});
              this.assignEmp();                         
           }         
        });
    }
    allEmp=()=>{
        this.setState({loader: true}); 
        RosterManagementService.getAllEmp().then(Response => {
            var getAllEmp = [];
            var getAllEmpName = [];
            var getAllEmpClone = [];
            var getAllEmpNameClone = [];
            var tempUname = [];
            const allEqual = arr => arr.every( v => v === arr[0] );            
            for(var i=0;i<Response.data.length;i++){
                getAllEmp.push({
                    department:Response.data[i].department,
                    designation:Response.data[i].designation,
                    firstName:Response.data[i].firstName,
                    lastName:Response.data[i].lastName,
                    userCode:Response.data[i].userCode,
                    bcmUserId:Response.data[i].bcmUserId,
                    fullname:Response.data[i].firstName+" "+Response.data[i].lastName,
                    userName:Response.data[i].firstName+" "+Response.data[i].lastName,
                    clientShiftMasterId:(Response.data[i].clientShiftMaster == null) ? '' : Response.data[i].clientShiftMaster.clientShiftMasterId,
                    clientPlantMasterId:(Response.data[i].clientShiftMaster == null) ? '' : Response.data[i].clientShiftMaster.clientPlantMaster.clientPlantMasterId                                                         
                });               
            }
            this.setState({getAllEmp:getAllEmp,loader: false});
            return true;
        });        
    }
    getMyBranchId=(id)=>{
        for(var i=0;i<this.state.getAllShiftLine.length;i++){
            if(this.state.getAllShiftLine[i].bcmUserId == id){
                return this.state.getAllShiftLine[i].clientPlantMasterId;
            }
        }
    }
    addEmployeFiled=(object,index,array)=>{
        this.setState(prevState => ({ addEmployeFiledCounts: [...prevState.addEmployeFiledCounts, { fullname: '' }] }));
    }
    seletedEmpsss=id=>{
        for(var i=0;i<this.state.rowData.length;i++){
            if(this.state.rowData[i].bcmUserId == id){
                return true;        
            }
        }
        return false;
    } 
    removeEmployeFiled=(object,index,array)=>{        
        let addEmployeFiledCounts = [...this.state.addEmployeFiledCounts];
        let temp = [];
        for(var i=0;i<addEmployeFiledCounts.length;i++){
            if(addEmployeFiledCounts[i].fullname == object.fullname){                
            }else{
                temp.push({
                    fullname:addEmployeFiledCounts[i].fullname
                });
            }
        }
        this.setState({addEmployeFiledCounts:temp});       
    }
    setModalHide=()=>{
        this.props.hideSwapChangeShiftModel();
    }     
    render() {
        return (
            <Modal id="changeShiftDataModal" show={this.state.showSwapChangeShiftModel} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                    Change Shift
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.loader ? <div className="loader">
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
                            <Form.Control as="select" value={this.state.PlantLocation} 
                            name="clientPlanAreaDetailId" 
                            style={{color: '#5A5A5A !important',pointerEvents: 'none'}}                            
                            onChange={this.branchEvent.bind(this)}>
                            <option value={0} selected>Branch</option>
                                {this.state.AllPlantMasterData.map((PlantObject, index) => <option key={index}
                                value={PlantObject.clientPlantMasterId}>{PlantObject.location}
                                </option>)}
                            </Form.Control>                                                         
                        </Form.Group>                                
                    </Col>

                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                        <Form.Label>From</Form.Label>
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">                    
                        <Form.Group>
                            <Form.Control as="select" id="fromshift" name="clientPlanAreaDetailId"
                            style={{color: '#5A5A5A !important',pointerEvents: 'none'}}
                            value={this.state.fromShift} onChange={this.fromShiftEvent.bind(this)}>
                            <option value={0} selected>Assign Shift</option>
                                {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                    value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                    </option>)}
                            </Form.Control>                                                                           
                        </Form.Group>
                    </Col>

                    <Col xs={3} sm="3" xl="4" className="addPlantForm">
                        <Form.Label>To</Form.Label>
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">                    
                        <Form.Group>
                            <Form.Control as="select" name="clientPlanAreaDetailId" 
                            style={{color: '#5A5A5A !important',}} value={this.state.toShift}
                            onChange={this.toShiftEvent.bind(this)}>
                            <option value={0} selected>Assign Shift</option>
                                {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                    value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                    </option>)}
                            </Form.Control>  
                            {
                                (this.state.swapClick == '1' &&  this.state.toShift == '0') ? (
                                    <Form.Text className="error-msg"> Please select assign Shift </Form.Text>
                                ):null
                            }                                                                         
                        </Form.Group>
                    </Col>

                    <Col xs={3} sm="3" xl="4" className="addPlantForm assignShift-media">
                        <Form.Label>Employee Selected</Form.Label>                       
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                        {
                            this.state.addEmployeFiledCounts.map((el, i) => (
                                <Form.Group className="d-flex align-items-center add-field">
                                    <p className="mb-0" style={{marginRight: 3}}>{i+1}.</p>
                                    <AsyncTypeahead style={{pointerEvents: 'none'}} id="multipleEmployeName" name="multipleEmployeName"
                                    className="multipleEmployeName empName" labelKey="fullname"
                                    options={this.state.getAllEmp} value={el.fullname}
                                    placeholder={
                                        el.fullname == '' ? 'Add Employee' : el.fullname
                                    }/> 
                                    <div className="action">
                                        {
                                            // (this.state.addEmployeFiledCounts.length == (i+1)) ? (
                                            //     <i className="icon addIcon" onClick={this.addEmployeFiled.bind(this,el,i)}></i>
                                            // ):null
                                        }                   
                                        <i className="icon deleteIcon mr-1" onClick={this.removeEmployeFiled.bind(this, el,i)}></i>
                                    </div>                                   
                                </Form.Group>
                            ))
                        }
                    </Col> 
                    

                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                        <button className="btn" style={{marginLeft: 130}} onClick={this.setModalHide}>Cancel</button>
                        {
                            this.state.addEmployeFiledCounts.length == '0' ? null :(
                                <button className="btn" onClick={this.swapEmpShift}>Swap</button>
                            )  
                        }
                     </Col>
                    </Row>
                </Col>

                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default SwapChangeShift;
import React, { Component, Fragment } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as RosterManagementService from './RosterManagementService';

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
            selectShiftName:'',ShiftName:'',selectAssignShiftData:'',
            selectBranchObject:[],selectShiftData:[],selectShiftDataFlag:0,
            startDateString:'',
            ClonestartDateString:'',
            endDateString:'',
            CloneendDateString:'',
            addEmployeFiledCount:[{
                empName: ''                
            }],
            addEmployeFiledCounts:[{empName: ''},{empName: ''},{empName: ''},{empName: ''},{empName: ''},{empName: ''}],
            selectEmpCount:0,       
        }        
    }
    async componentDidMount() {
        this.setState({loader: true});       
        const res1 = await this.getAllPlantMaster();
        const res2 = await this.getAllClientShiftMaster();
        const re3s = await this.allEmp();
        if(res1 == true && res2 == true && re3s == true){
            this.setState({loader: false});       
        } 
    }
    getAllPlantMaster=()=>{
        RosterManagementService.getAllPlantMaster().then(Response => {
            this.setState({AllPlantMasterData:Response.data});
            return true;
        });       
    }   
    getAllClientShiftMaster=()=>{
        RosterManagementService.getAllClientShiftMaster().then(Response => {
            this.setState({AllClientShiftMaster:Response.data});
            return true;
        });        
    }
    allEmp=()=>{
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
                    fullname:data.firstName+" "+data.lastName
                })
                
            });
            this.setState({getAllEmp:temp,getAllEmpName:TempgetAllEmpName});
            return true;
        });        
    }
    selectPlantLocation=(object)=>{
        let tempPlantLocation = 0;
        let selectBranchObject = [];
        let selectShiftData = [];
        this.setState({selectShiftData:[],selectShiftDataFlag:0,selectBranchData:'',PlantLocation:''});
        this.setState({startDateString:'',endDateString:'',selectShiftName:'',ShiftName:'',selectAssignShiftData:''});

        for(var i=0;i<this.state.AllPlantMasterData.length;i++){
            if(this.state.AllPlantMasterData[i].clientPlantMasterId == object.target.value){
                tempPlantLocation = this.state.AllPlantMasterData[i].clientPlantMasterId;
                this.setState({selectBranchData:this.state.AllPlantMasterData[i].clientPlantMasterId});
                selectBranchObject = this.state.AllPlantMasterData[i];
                break;                
            }
        }
        this.setState({PlantLocation:tempPlantLocation,selectBranchObject:selectBranchObject});
        for(var i=0;i<this.state.AllClientShiftMaster.length;i++){
            if(this.state.AllClientShiftMaster[i].clientPlantMaster.clientPlantMasterId == tempPlantLocation){
                this.setState({selectShiftData:this.state.AllClientShiftMaster[i],selectShiftDataFlag:1});
            }
        }
        if(this.state.selectShiftDataFlag == 1){
            var sDate = this.state.selectShiftData.startDate;
            var sDateValue = sDate.split('T')[0].split('-')[1]+'-'+sDate.split('T')[0].split('-')[2]+'-'+sDate.split('T')[0].split('-')[0];
            var eDate = this.state.selectShiftData.endDate;
            var eDateValue = eDate.split('T')[0].split('-')[1]+'-'+eDate.split('T')[0].split('-')[2]+'-'+eDate.split('T')[0].split('-')[0];
            this.setState({
                startDateString:sDateValue,
                endDateString:eDateValue,
                selectShiftName:this.state.selectShiftData.clientShiftName,
                ShiftName:this.state.selectShiftData.clientShiftMasterId,
                selectAssignShiftData:this.state.selectShiftData.clientShiftMasterId
            });
            alert(sDateValue);
            alert(eDateValue);
            // this.state.selectShiftData.clientShiftMasterId
            // addEmployeFiledCount
            // data.clientShiftMaster.clientShiftMasterId

            this.setState({ addEmployeFiledCount:[{empName: ''}]});            
            for(var i=0;i<this.state.getAllEmp.length;i++){
                if(this.state.getAllEmp[i].clientShiftMasterId == this.state.selectShiftData.clientShiftMasterId){
                    console.log(this.state.getAllEmp[i].clientShiftMasterId +"===="+ this.state.selectShiftData.clientShiftMasterId);
                    this.state.addEmployeFiledCount.push({empName: this.state.getAllEmp[i].clientShiftMasterId});
                }
            }

            // for(var M=0;M<this.state.addEmployeFiledCount.length;M++){
            //     if(this.state.addEmployeFiledCount[M].empName == ''){                    
            //     }else{
            //         this.state.addEmployeFiledCount.push({empName: this.state.addEmployeFiledCount[M].empName});
            //     }
            // }                    
        }        
    }
    empFiled(){
        return this.state.addEmployeFiledCount.map((el, i) => (                   
            <Form.Group className="d-flex align-items-center add-field">
                <p className="mb-0">{i+1} </p>
                <AsyncTypeahead id="multipleEmployeName" name="multipleEmployeName" onChange={this.selectEmp} labelKey="fullname" 
                options={this.state.getAllEmpName} value={el.empName} placeholder="Select employee"/>
                <div className="action">
                    {
                        (this.state.addEmployeFiledCount.length == (i+1)) ? (
                            <i className="icon addIcon" onClick={this.addEmployeFiled.bind(this,el,i)}></i>
                        ):null
                    }                   
                    <i className="icon deleteIcon mr-1" onClick={this.removeEmployeFiled.bind(this, el,i)}></i>
                </div>
            </Form.Group>
            )
        )
    }
    addEmployeFiled=(object,index,array)=>{
        this.setState(prevState => ({ addEmployeFiledCount: [...prevState.addEmployeFiledCount, { empName: '' }] }));
    }
    getEmpUserID=()=>{
        var IDs = [];
        for(var i=0;i<document.getElementsByClassName('rbt-input').length;i++){
            if(document.getElementsByClassName('rbt-input')[i].value == ''){                
            }else{
                var fullname = document.getElementsByClassName('rbt-input')[i].value;
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
    removeEmployeFiled=(object,index,array)=>{
        let addEmployeFiledCount = [...this.state.addEmployeFiledCount];
        if (addEmployeFiledCount.length > 1) {
            addEmployeFiledCount.splice(index, 1);
           this.setState({ addEmployeFiledCount });
        }
    }
    selectEmp=(e)=>{
        var count = 0;
        for(var i=0;i<document.getElementsByClassName('rbt-input').length;i++){
            if(document.getElementsByClassName('rbt-input')[i].value == ''){                
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
                        <Form.Label>Branch { this.state.selectShiftDataFlag }</Form.Label>
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
                                this.state.PlantLocation == '0' ? (
                                    <Form.Text className="error-msg"> Branch name is required </Form.Text>
                                ):null
                            }                               
                        </Form.Group>                                
                    </Col>
                    {
                        this.state.selectShiftDataFlag == '1' ? (                           
                        <Fragment id="firstFragment" name="firstFragment">                        
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                        <Form.Label>Date fa</Form.Label>
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                        <Row className="ml-0 mr-0">
                        <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                            <Form.Group className="datePicker">
                                <DatePicker defaultValue={this.state.startDateString} value={this.state.startDateString} placeholderText="Start Date"
                                        minDate={new Date()} dateFormat="dd-MM-yyyy" onChange={this.handleChange.bind(this,'startDate')}/>
                                    <i className="calIcon"></i>
                                </Form.Group>
                        </Col>
                        <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                            <Form.Group className="datePicker">
                                <DatePicker defaultValue={this.state.endDateString} value={this.state.endDateString} placeholderText="End Date"
                                    minDate={new Date()} dateFormat="dd-MM-yyyy" onChange={this.handleChange.bind(this,'endDate')}/>
                                <i className="calIcon"></i>
                            </Form.Group>
                        </Col>
                        </Row>
                    </Col>
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Shift</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Text>
                                    {
                                        this.state.selectShiftName == '' ? (
                                            <p style={{fontWeight: 'bold',fontSize: 15,marginTop: 10}}>Alread Shift</p>
                                        ):(
                                            <p style={{fontWeight: 'bold',fontSize: 15,marginTop: 10}}>{this.state.selectShiftName}</p>
                                        )
                                    }
                                    </Form.Text>
                                </Col>
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.ShiftName} name="clientPlanAreaDetailId" 
                                        style={{color: '#5A5A5A !important'}} onChange={this.selectAssignShift.bind(this)}>
                                        <option value={0} selected>Assign Shift</option>
                                            {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                            value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                            </option>)}
                                        </Form.Control>
                                        {
                                            this.state.selectAssignShiftData == '0' ? (
                                                <Form.Text className="error-msg"> Assign shift is required </Form.Text>
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
                                this.state.addEmployeFiledCount.length
                            }                            
                                {
                                    this.state.addEmployeFiledCount.map((el, i) => (
                                        <Form.Group className="d-flex align-items-center add-field">
                                            <p className="mb-0">{i+1} </p>
                                            <AsyncTypeahead id="multipleEmployeName" name="multipleEmployeName" onChange={this.selectEmp} labelKey="fullname" 
                                            options={this.state.getAllEmpName} placeholder="Select employee"/>
                                            <div className="action">
                                                {
                                                    (this.state.addEmployeFiledCount.length == (i+1)) ? (
                                                        <i className="icon addIcon" onClick={this.addEmployeFiled.bind(this,el,i)}></i>
                                                    ):null
                                                }                   
                                                <i className="icon deleteIcon mr-1" onClick={this.removeEmployeFiled.bind(this, el,i)}></i>
                                            </div>
                                        </Form.Group>
                                    ))
                                }

                            </Col>                                               
                        </Fragment>
                        ):(
                        <Fragment id="secFragment" name="secFragment">                           
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                        <Form.Label>Date se</Form.Label>
                    </Col>
                    <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                        <Row className="ml-0 mr-0">
                            <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                <Form.Group className="datePicker">
                                    <Form.Control type="text" placeholder="Start Date"
                                    style={{opacity: '0.9',pointerEvents: 'none'}}/>
                                    <i className="calIcon"></i>                                
                                </Form.Group>
                            </Col>
                        <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                            <Form.Group className="datePicker">
                                <Form.Control type="text" placeholder="End Date" 
                                style={{opacity: '0.9',pointerEvents: 'none'}}/>
                                <i className="calIcon"></i>
                            </Form.Group>
                        </Col>
                        </Row>
                    </Col>
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                            <Form.Label>Shift</Form.Label>
                        </Col>
                        <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Row className="ml-0 mr-0">
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Text><p style={{fontWeight: 'bold',fontSize: 15,marginTop: 10}}>--- </p></Form.Text>
                                </Col>
                                <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select"
                                        style={{opacity: '0.4',pointerEvents: 'none'}}>
                                            <option value={0} selected>Assign Shift</option>                                            
                                        </Form.Control>                                      
                                    </Form.Group>    
                                </Col>                                
                            </Row>
                        </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm assignShift-media">
                                <Form.Label>Employee Selected</Form.Label>
                                <div class="mediaUpload text-center"><i class="icon icon-upload"></i></div>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">                            
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
                            </Fragment>
                        )
                    }

                            
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                           <button className="btn" style={{marginLeft: 130}}>Cancel</button>
                           <button className="btn">Assign</button>
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default ChangeShiftData;
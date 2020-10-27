import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import * as RosterManagementService from './RosterManagementService';

class EditShiftData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EditRosterDataModelShow: props.EditRosterDataModelShow,
            loader: false,
            rowData:props.rowData,
            AllClientShiftMaster:[],
            selectAssignShiftData:1,
            empName:props.rowData.userName,
            departName:props.rowData.department,
            designation:props.rowData.designation,
            ShiftName:'',
            ShifttextValue:props.rowData.clientShiftName,
            ShiftNameold:props.rowData.clientShiftName,
            pageLoader:true,
            assignTime:'',
            clientPlantMasterId:props.rowData.clientPlantMasterId
        }
    } 
    setModalHide = () => {
        this.props.HideEditRosterDataModelShow(false);
    }
    componentDidMount() {
        this.setState({pageLoader:true});
        // this.setState({AllClientShiftMaster:Response.data,ShiftName:this.props.rowData.clientShiftMasterId,pageLoader:false});
        this.getShiftBasesOnPlant(this.props.rowData.clientPlantMasterId);
    }
    getShiftBasesOnPlant=(clientPlantMasterId)=>{
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
    selectAssignShift=(object)=>{        
        this.setState({ShiftName:object.target.value,selectAssignShiftData:object.target.value,ShifttextValue:object.target.selectedOptions[0].innerHTML});
        let assignTime = '';
        for(var i=0;i<this.state.AllClientShiftMaster.length;i++){
            if(object.target.value == this.state.AllClientShiftMaster[i].clientShiftMasterId){
                assignTime = this.state.AllClientShiftMaster[i].inTime;
            }
        }
        this.setState({assignTime:assignTime});
    }    
    empNameEvent=(object)=>{
        this.setState({empName:object.target.value});
    }
    designationEvent=(object)=>{
        this.setState({designation:object.target.value});
    }
    departmentEvent=(object)=>{
        this.setState({departName:object.target.value});
    }
    updateShift=()=>{
        let ReqObject = {
            "clientShiftLineId": this.state.rowData.clientShiftLineId,   
            "bcmUser": {
                "bcmUserId": this.state.rowData.bcmUserId
            },
            "clientShiftMaster": {
                "clientShiftMasterId": parseInt(this.state.ShiftName)
            },
            "clientShiftName":this.state.ShifttextValue,
            "cntOrgId": sessionStorage.orgId,
            "createdBy": 1,
            "isActive": 1,
            "updatedBy": 1,
            "userName": this.state.empName
        };
        RosterManagementService.saveAssignShift(ReqObject).then(Response => { 
            var msg = "Hi "+ReqObject.userName+", your shift has been changed from "+this.state.ShiftNameold+" to "+this.state.ShifttextValue+' which starts by '+this.state.assignTime;
            var uid = ReqObject.bcmUser.bcmUserId;
            RosterManagementService.setPushNotification(msg,uid).then(NotifyResponse => {
                localStorage.EditFlog = 'Edit';
                this.setModalHide();  
            }).catch(error => {
                localStorage.EditFlog = 'Edit';
                this.setModalHide();  
            });                      
        });
    }
    render() {
        return (
            <Modal id="rosterManagementModal" show={this.state.EditRosterDataModelShow} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                    Edit Shift Details
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    this.state.pageLoader ? (
                       <div className="loader">
                          <Spinner animation="grow" variant="dark">
                          </Spinner>
                       </div>
                    ) : null
                }
                <Row>
                    <Col xl="12">
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" style={{ pointerEvents: 'none' }} 
                                    value={this.state.empName} onChange={this.empNameEvent.bind(this)}/>
                                    {
                                        this.state.empName == '' ? (
                                            <Form.Text className="error-msg"> Employee name is required </Form.Text>
                                        ):null
                                    }                                    
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Designation</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" style={{ pointerEvents: 'none' }}
                                    value={this.state.designation} onChange={this.designationEvent.bind(this)}/>
                                    {
                                        this.state.designation == '' ? (
                                            <Form.Text className="error-msg"> Designation is required </Form.Text>
                                        ):null
                                    } 
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Department</Form.Label>
                            </Col>                            
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" style={{ pointerEvents: 'none' }}
                                    value={this.state.departName} onChange={this.departmentEvent.bind(this)}/>
                                    {
                                        this.state.departName == '' ? (
                                            <Form.Text className="error-msg"> DepartName is required </Form.Text>
                                        ):null
                                    }
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Shift Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control as="select" value={this.state.ShiftName} name="clientPlanAreaDetailId" 
                                    style={{color: '#5A5A5A !important'}} onChange={this.selectAssignShift.bind(this)}>                                    
                                        {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                        value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                        </option>)}
                                    </Form.Control>                                    
                                </Form.Group>
                            </Col>                           
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn" styke={{marginLeft: 55}}>
                        <button className="btn" onClick={this.setModalHide}>Cancel</button>                       
                        {
                            (this.state.empName ==  '' || this.state.designation == '' || this.state.departName == '') ?
                            (
                                <button className="btn">Save</button>
                            ):(
                                <button className="btn" style={{backgroundColor:'#f4f4f4'}} onClick={this.updateShift}>Save</button>
                            )
                        }                        
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default EditShiftData;
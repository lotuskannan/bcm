import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class ChangeShiftData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ChangeShiftModelShow: props.ChangeShiftModelShow,
            loader: false            
        }
    }
    setModalHide = () => {
        this.props.HideChangeShiftModelShow(false);
    }
    componentDidMount() {

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
                <Row>
                    <Col xl="12">
                        <Row className="align-items-center">
                          
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Branch</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>

                                    <Form.Control as="select" name="clientPlanAreaDetailId"> 
                                    <option value={''} >Option 0</option>
                                    <option value={''} >Option 1</option>  
                                    <option value={''} >Option 2</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Date</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                               <Row className="ml-0 mr-0">
                               <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                               <Form.Group className="datePicker">
                                    <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
                                </Form.Group>
                               </Col>
                               <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                               <Form.Group className="datePicker">
                                    <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
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
                               <Form.Group className="datePicker">
                                    <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
                                </Form.Group>
                               </Col>
                               <Col xs={6} sm="6" xl="6 pl-0" className="addPlantForm">
                               <Form.Group className="datePicker">
                                    <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
                                </Form.Group>
                               </Col>
                               </Row>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Selected</Form.Label>
                                
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Row>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm assignShift-media">
                                     <div class="mediaUpload text-center"><i class="icon icon-upload"></i></div>
                                </Col>
                                <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                </Col>
                                </Row>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">1.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">2.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">3.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">4.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee" />
                                <div className="action">
                                <i className="icon addIcon"></i>
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                            </Col>
                            
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                           <button className="btn">Cancel</button>
                           <button className="btn">Assign</button>
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default ChangeShiftData;
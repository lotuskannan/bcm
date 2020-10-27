import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';

class AddLeavePolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddLeavePolicyModelShow: props.AddLeavePolicyModelShow       
        }
    }
    componentDidMount() {
    }
    setModalHide=()=>{
        this.props.AddLeavePolicyModelHide();
    }
    render() {        
        return (
            <Modal id="dataEmpAdd" className="addShiftModel" show={this.state.AddLeavePolicyModelShow} 
            onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add LeavePolicy</Modal.Title>
                </Modal.Header>
                <Modal.Body>                          
                <Row>
                    <Col xl="12"> 
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Leave Type</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Form.Group>
                                <Form.Control as="select">
                                <option>SL</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                </Form.Control>
                            </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Status</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Form.Group>
                                <Form.Control as="select">
                                <option>Confirmed</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                </Form.Control>
                            </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Accrual Type</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Form.Group>
                                <Form.Control as="select">
                                <option>Monthly</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                </Form.Control>
                            </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>No. of Days After</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                            <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="1" value="1" />
                            </Form.Group>
                            </Col>

                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn">
                           <button className="btn">Cancel</button>
                           <button className="btn" disabled>Add</button>
                     </Col>
                    </Row>
               
                </Modal.Body>
           
            </Modal>
            
        )
    }
}

export default AddLeavePolicy;
import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';

class AddLeaveType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddLeaveTypeModelShow: props.AddLeaveTypeModelShow       
        }
    }
    componentDidMount() {

    }
    setModalHide=()=>{
        this.props.AddLeaveTypeModelHide();
    }
    render() {        
        return (
            <Modal id="dataEmpAdd" className="addShiftModel" show={this.state.AddLeaveTypeModelShow} 
            onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add LeaveType</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mt-0">
                                   
                    <Row>
                    <Col xl="12">
                        
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Leave Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee Code" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Description</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Name" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>No of Days Per Month</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Department" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Applicable After</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control as="select">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                </Form.Control>
                                </Form.Group>
                            </Col>
                           
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn">
                           <button className="btn">Cancel</button>
                           <button className="btn" disabled>Submit</button>
                     </Col>
                    </Row>
               
                </Modal.Body>
           
            </Modal>
            
        )
    }
}

export default AddLeaveType;
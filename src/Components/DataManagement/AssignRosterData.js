import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';

class AssignRosterData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AssignShiftModelShow: props.AssignShiftModelShow,
            loader: false            
        }
    }
    setModalHide = () => {
        this.props.HideAssignShiftModelShow(false);
    }
    componentDidMount() {

    }
    render() {
        return (

            <Modal id="rosterManagementModal-assign" show={this.state.AssignShiftModelShow} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                    Add Employee
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col xl="12">
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Code</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Employee Code" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Name" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Department</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Department" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Designation</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Add Designation" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Contact</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Contact Number" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn dataManagement-btn">
                           <button className="btn upload-csv" disabled>Upload CSV</button>
                           <button className="btn">Cancel</button>
                           <button className="btn" disabled>Add</button>
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default AssignRosterData;
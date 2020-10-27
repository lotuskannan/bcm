import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';

class EditRosterData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EditRosterDataModelShow: props.EditRosterDataModelShow,
            loader: false            
        }
    } 
    setModalHide = () => {
        this.props.HideEditRosterDataModelShow(false);
    }
    componentDidMount() {

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
                <Row>
                    <Col xl="12">
                        <Row className="align-items-center">
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Employee Name</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" value="Kishore Rajan" />
                                    
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Designation</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" value="Line Supervisor" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Department</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" value="Production" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Shift Name</Form.Label>
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
                                <Form.Label>Project Name</Form.Label>
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
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                           <button className="btn">Cancel</button>
                           <button className="btn">Save</button>
                     </Col>
                </Row>
                </Modal.Body>
            </Modal>
            
        )
    }
}

export default EditRosterData;
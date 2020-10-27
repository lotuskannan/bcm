import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import * as DataManagementService from '../DataManagementService';
import symptoms from '../../../assets/images/fever.png';


class AddSymptom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddSymptomModelShow: props.AddSymptomModelShow       
        }
    }
    componentDidMount() {

    }
    setModalHide=()=>{
        this.props.AddSymptomModelHide();
    }
    render() {        
        return (
            <Modal centered id="addSymptoms-view" className="addSymptom" show={this.state.AddSymptomModelShow} 
            onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col xl="12">
                        <Row className="align-items-end justify-content-between">
                            <Col xs={9} sm="9" xl="8 px-0" className="addPlantForm">
                            <Form.Label>Employee Name</Form.Label>
                                <Form.Group>
                                    <Form.Control type="text" name="clientPlantMasterId" placeholder="Kishore Rajan" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="12" xl="3 px-0" className="addPlantForm pr-0 d-flex justify-content-end">
                            <Form.Group className="upload-Symptoms" style={{backgroundImage: `url(${symptoms})`}}>
                                   <span className="symptoms-close">X</span>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                           <button className="btn">Cancel</button>
                           <button className="btn" disabled>Save</button>
                     </Col>
                </Row>
                </Modal.Body>
           
            </Modal>
            
        )
    }
}

export default AddSymptom;
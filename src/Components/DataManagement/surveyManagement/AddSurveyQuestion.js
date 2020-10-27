import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import * as DataManagementService from '../DataManagementService';

class AddSurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddSurveyQuestionModelShow: props.AddSurveyQuestionModelShow       
        }
    }
    componentDidMount() {

    }
    setModalHide=()=>{
        this.props.AddSurveyQuestionModelHide();
    }
    render() {        
        return (
            <Modal id="addSurveyQuestion" className="addSymptom" show={this.state.AddSurveyQuestionModelShow} 
            onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Add Survey Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row className="align-items-center">
                    <Col xl="12">
                        <Row className="">
                        <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Parent Question</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>

                                    <Form.Control as="select" name="clientPlanAreaDetailId"> 
                                    <option value={''} >Select Parent Question</option>
                                    <option value={''} >Option 1</option>  
                                    <option value={''} >Option 2</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Respone </Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>

                                    <Form.Control as="select" name="clientPlanAreaDetailId"> 
                                    <option value={''} >Select Parent Question</option>
                                    <option value={''} >Option 1</option>  
                                    <option value={''} >Option 2</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm="12" xl="12" className="addPlantForm">
                                <Form.Label>Question</Form.Label>
                            </Col>
                            <Col xs={12} sm="12" xl="12 px-0" className="addPlantForm">
                                <Form.Group className="surveyQuestion">
                                     <Form.Control as="textarea" rows="5" />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                <Form.Label>Types</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                <Form.Group>

                                    <Form.Control as="select" name="clientPlanAreaDetailId"> 
                                    <option value={''} >MCQ</option>
                                    <option value={''} >Option 1</option>  
                                    <option value={''} >Option 2</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            
                            <Col xs={3} sm="3" xl="4" className="addPlantForm align-items-start d-none">
                               
                                <Form.Label>Options</Form.Label>
                            </Col>
                            <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm d-none">
                            
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">1.</p>
                                <Form.Control type="text" name="clientPlantMasterId" className="pr-0" placeholder="Option 1" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">2.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Option 2" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">3.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Option 3" />
                                <div className="action">
                                <i className="icon deleteIcon mr-1"></i>
                                </div>
                                </Form.Group>
                                
                                <Form.Group className="d-flex align-items-center add-field">
                                <p className="mb-0">4.</p>
                                <Form.Control type="text" name="clientPlantMasterId" placeholder="Option 4" />
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

export default AddSurveyQuestion;
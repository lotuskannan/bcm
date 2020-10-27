import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button,Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';

class AccessTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AccessTimeModelShow: props.AccessTimeModelShow       
        }
    }
    componentDidMount() {
    }
    setModalHide=()=>{
        this.props.AccessTimeModelHide();
    }
    render() {        
        return (
            <Modal id="access-time-modal" className="addShiftModel" show={this.state.AccessTimeModelShow} 
            onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">Access Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>               
                    <div className="access-time">
                        <h6>Santosh Pranav</h6>
                        <Table className="access-time-table">
                        <thead>
                            <tr>
                            <th>Time</th>
                            <th>Accessed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>09:50:32</td>
                            <td>Reception Entry</td>
                            </tr>
                            <tr>
                            <td>10:49:12</td>
                            <td>Restroom Door</td>
                            </tr>
                            <tr>
                            <td>09:50:32</td>
                            <td>Reception Entry</td>
                            </tr>
                            <tr>
                            <td>10:49:12</td>
                            <td>Restroom Door</td>
                            </tr>
                            <tr>
                            <td>09:50:32</td>
                            <td>Reception Entry</td>
                            </tr>
                            <tr>
                            <td>10:49:12</td>
                            <td>Restroom Door</td>
                            </tr>
                        </tbody>
                        </Table>
                    </div>
                </Modal.Body>
           
            </Modal>
            
        )
    }
}

export default AccessTime;
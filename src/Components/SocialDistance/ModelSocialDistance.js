import React, { Component } from 'react';
import { Row, Col, Table, Modal, Spinner, Button } from 'react-bootstrap';

import videoFile from '../../assets/images/video-file@2x.png';
import doneImg from '../../assets/images/deatils-done@2x.png';
import mediaImg from '../../assets/images/powder-coat-plant.jpg';
import callIcon from '../../assets/images/phone.svg';
import videoIcon from '../../assets/images/video-call.svg';
import mailIcon from '../../assets/images/mail.svg';
import surveyIcon from '../../assets/images/survey.svg';
import fever from '../../assets/images/fever.png';
import userImg from '../../assets/images/Mask-Group-user.png';
import searchIcon from '../../assets/images/search.svg';

class ModelSocialDistance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: props.modalShow,
            loader: false,
            ImageUrl:props.ImageUrl          
        }
    }
    setModalHide = () => {
        this.props.onHide(false);
    }
    componentDidMount() {

    }
    render() {
        return (
            <Modal id="caseHistory" show={this.state.modalShow} onHide={this.setModalHide} size="lg"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                        Image View
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{textAlign:'center'}}>
                        <img src={this.state.ImageUrl} alt="" style={{width: 800,height:600}}></img>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ModelSocialDistance;
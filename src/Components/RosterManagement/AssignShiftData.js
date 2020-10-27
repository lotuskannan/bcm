import React, { Component } from 'react';
import { Row, Col, Table, Modal, Form, Button, Spinner } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as RosterManagementService from './RosterManagementService';
import fileExcel from '../../assets/images/fileExcel.png';

class AssignShiftData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AssignShiftModelShow: props.AssignShiftModelShow,
            loader: true,
            addEmployeFiledCount: [{
                empName: ''
            }],
            selectBranchData: '',
            selectAssignShiftData: '',
            AllPlantMasterData: [],
            PlantLocation: 0,
            AllClientShiftMaster: [],
            ShiftName: 0,
            selectEmpCount: 0,
            selectShiftName: '',
            getAllEmp: [],
            getAllEmpName: [],
            getAllShiftLine: [],
            submitflag: 0,
            rbtinput: 0,
            selectedFile: null,
            fileUploadInAssignShiftReslt: null,
            selectPlantObject: [],
            assignTime: '',
            AllClientShiftflag: '',
            Loader: false

        }
    }
    async componentDidMount() {
        this.setState({ loader: true });
        const res1 = await this.getAllPlantMaster();
        // const res2 = await this.getAllClientShiftMaster();
        const res3 = await this.allEmp();
        const res4 = await this.init();
        if (res1 == true && res3 == true) {
            this.setState({ loader: false });
        }
    }
    getAllPlantMaster = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllPlantMaster().then(Response => {
            this.setState({ AllPlantMasterData: Response.data, loader: false });
            return true;
        });
    }
    getAllClientShiftMaster = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllClientShiftMaster().then(Response => {
            this.setState({ AllClientShiftMaster: Response.data, loader: false });
            return true;
        });
    }
    init = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllShiftLine().then(Response => {
            if (Response.data) {
                let Data = [];
                for (var i = 0; i < Response.data.length; i++) {
                    Data.push({
                        bcmUserId: Response.data[i].bcmUser.bcmUserId,
                        clientShiftLineId: Response.data[i].clientShiftLineId,
                        clientShiftMasterId: Response.data[i].clientShiftMaster.clientShiftMasterId,
                        clientPlantMasterId: Response.data[i].clientShiftMaster.clientPlantMaster.clientPlantMasterId
                    });
                }
                this.setState({ getAllShiftLine: Data, loader: false });
            }
        });
    }
    allEmp = () => {
        this.setState({ loader: true });
        RosterManagementService.getAllEmp().then(Response => {
            var temp = [];
            var TempgetAllEmpName = [];
            Response.data.forEach(function (data, index) {
                temp.push({
                    department: data.department,
                    designation: data.designation,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userCode: data.userCode,
                    bcmUserId: data.bcmUserId,
                    fullname: data.firstName + " " + data.lastName,
                });
                TempgetAllEmpName.push({
                    fullname: data.firstName + " " + data.lastName
                })
            });
            this.setState({ getAllEmp: temp, getAllEmpName: TempgetAllEmpName, loader: false });
            return true;
        });
    }
    setModalHide = () => {
        this.setState({ selectBranchData: '', selectAssignShiftData: '' });
        this.props.HideAssignShiftModelShow(false);
    }
    downloadCSV = () => {
        var data = [
            ['U1001', 'Henry', 'J', 'Morning'],
            ['U1002', 'Andru', 'D', 'Afternoon'],
            ['U1003', 'Peter', 'S', 'Evening'],
            ['U1004', 'Sam', 'K', 'Night'],
            ['U1004', 'Kishore', 'C', 'Evening']
        ];
        var csv = 'UserCode,FirstName,LastName,ShiftName\n';
        data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'sample.csv';
        hiddenElement.click();
    }
    SubmitAssignShif = () => {
        localStorage.addShift = '';
        if (this.state.selectBranchData == '') {
            this.setState({ selectBranchData: 0 });
        }
        if (this.state.selectAssignShiftData == '') {
            this.setState({ selectAssignShiftData: 0 });
        }
        if (this.state.PlantLocation == '' && this.state.ShiftName == '') {
        } else {
            if (this.state.selectEmpCount == 0) {
            } else {
                var eId = this.getEmpUserID();
                const promises = eId.map(item => {
                    let ReqObject = [];
                    ReqObject = {
                        "bcmUser": {
                            "bcmUserId": parseInt(item.id)
                        },
                        "clientShiftMaster": {
                            "clientShiftMasterId": parseInt(this.state.ShiftName),
                            "clientPlantMaster": this.state.selectPlantObject
                        },
                        "clientShiftName": this.state.selectShiftName,
                        "cntOrgId": sessionStorage.orgId,
                        "createdBy": 1,
                        "isActive": 1,
                        "updatedBy": 1,
                        "userName": item.name
                    };
                    let flag = this.findAlredyAssignShif(item.id);
                    if (flag == '' || flag == null || flag == 'null') {
                        return this.axiosFunction(ReqObject);
                    } else {
                        var newReqObj = Object.assign(ReqObject, { 'clientShiftLineId': flag });
                        return this.axiosFunction(newReqObj);
                    }
                });
                Promise.all(promises).then(results => {
                    localStorage.addShift = 'edit';
                    this.setState({ selectBranchData: '', selectAssignShiftData: '' });
                    this.setModalHide();
                });
            }
        }
    }
    async axiosFunction(ReqObject) {
        this.setState({ Loader: true });
        const res = await RosterManagementService.saveAssignShift(ReqObject).then(Response => {
            if (Response.status.success == 'Success') {
                var msg = "Hi " + ReqObject.userName + ", you have been assigned to the " + ReqObject.clientShiftName + " shift which starts by " + this.state.assignTime;
                var uid = ReqObject.bcmUser.bcmUserId;
                RosterManagementService.setPushNotification(msg, uid).then(NotifyResponse => {
                    return true;
                }).catch(error => {
                    return true;
                });
                return true;
            }
            this.setState({ Loader: false });
        });
        return res;
    }
    addEmployeFiled = (object, index, array) => {
        this.setState(prevState => ({ addEmployeFiledCount: [...prevState.addEmployeFiledCount, { empName: '' }] }));
    }
    findAlredyAssignShif = (userid) => {
        for (var i = 0; i < this.state.getAllShiftLine.length; i++) {
            if (this.state.getAllShiftLine[i].bcmUserId == userid) {
                return parseInt(this.state.getAllShiftLine[i].clientShiftLineId);
            }
        }
        return '';
    }
    getEmpUserID = () => {
        var IDs = [];
        for (var i = 0; i < document.getElementsByClassName('rbt-input').length; i++) {
            if (document.getElementsByClassName('rbt-input')[i].value == '') {
            } else {
                var fullname = document.getElementsByClassName('rbt-input')[i].value;
                let uid = this.searchName(fullname);
                IDs.push({
                    id: uid.split(',')[0],
                    name: uid.split(',')[1]
                });
            }
        }
        return IDs;
    }
    searchName = (fullname) => {
        for (var i = 0; i < this.state.getAllEmp.length; i++) {
            if (this.state.getAllEmp[i].fullname == fullname) {
                return this.state.getAllEmp[i].bcmUserId + "," + this.state.getAllEmp[i].fullname;
            }
        }
    }
    removeEmployeFiled = (object, index, array) => {
        let addEmployeFiledCount = [...this.state.addEmployeFiledCount];
        if (addEmployeFiledCount.length > 1) {
            addEmployeFiledCount.splice(index, 1);
            this.setState({ addEmployeFiledCount });
        }
    }
    selectEmp = (e) => {
        var count = 0;
        for (var i = 0; i < document.getElementsByClassName('rbt-input').length; i++) {
            if (document.getElementsByClassName('rbt-input')[i].value == '') {
            } else {
                count++;
            }
        }
        this.setState({ selectEmpCount: count, rbtinput: count });
    }
    onCero = (e) => {
        // e.preventDefault();
        if (e.key === "Delete" || e.key === "Backspace") {
            var count = 0;
            for (var i = 0; i < document.getElementsByClassName('rbt-input').length; i++) {
                if (document.getElementsByClassName('rbt-input')[i].value == '') {
                } else {
                    count++;
                }
            }
            this.setState({ selectEmpCount: count, rbtinput: count });
        }
    };
    empFiled() {
        return this.state.addEmployeFiledCount.map((el, i) =>
            <Form.Group className="d-flex align-items-center add-field">
                <p className="mb-0" style={{ marginRight: 3 }}>{i + 1}.</p>
                <AsyncTypeahead id="multipleEmployeName" name="multipleEmployeName"
                    onChange={this.selectEmp} labelKey="fullname" onKeyDown={((e) => this.onCero(e))}
                    options={this.state.getAllEmpName} placeholder="Select employee" />
                <div className="action">
                    {
                        (this.state.addEmployeFiledCount.length == (i + 1)) ? (
                            <i className="icon addIcon" onClick={this.addEmployeFiled.bind(this, el, i)}></i>
                        ) : null
                    }
                    <i className="icon deleteIcon mr-1" onClick={this.removeEmployeFiled.bind(this, el, i)}></i>
                </div>
            </Form.Group>
        )
    }
    selectAssignShift = (object) => {
        this.setState({ selectShiftName: object.target.selectedOptions[0].text });
        this.setState({ ShiftName: object.target.value, selectAssignShiftData: object.target.value });
        let assignTime = '';
        for (var i = 0; i < this.state.AllClientShiftMaster.length; i++) {
            if (object.target.value == this.state.AllClientShiftMaster[i].clientShiftMasterId) {
                assignTime = this.state.AllClientShiftMaster[i].inTime;
            }
        }
        this.setState({ assignTime: assignTime });
    }
    selectPlantLocation = (object) => {
        let tempPlantLocation = 0;
        for (var i = 0; i < this.state.AllPlantMasterData.length; i++) {
            if (this.state.AllPlantMasterData[i].clientPlantMasterId == object.target.value) {
                tempPlantLocation = this.state.AllPlantMasterData[i].clientPlantMasterId;
                this.setState({ selectBranchData: this.state.AllPlantMasterData[i].clientPlantMasterId, selectPlantObject: this.state.AllPlantMasterData[i] });
                break;
            }
        }
        this.setState({ PlantLocation: tempPlantLocation, AllClientShiftflag: '', ShiftName: 0 }, () => {
            this.getShiftBasesOnPlant(tempPlantLocation);
        });
    }
    getShiftBasesOnPlant = (clientPlantMasterId) => {
        RosterManagementService.getShiftBasesOnPlant(clientPlantMasterId).then(Response => {
            var tempObj = [];
            if (Response.data) {
                for (var i = 0; i < Response.data.length; i++) {
                    tempObj.push({
                        clientShiftMasterId: Response.data[i].clientShiftMasterId,
                        clientShiftName: Response.data[i].clientShiftName,
                        inTime: Response.data[i].inTime,
                        outTime: Response.data[i].outTime,
                    });
                }
            }
            this.setState({ AllClientShiftMaster: tempObj, AllClientShiftflag: tempObj.length, ShiftName: 0 });
        });
    }
    assignValidation = () => {
        this.setState({ fileUploadInAssignShiftReslt: null });
        if (this.state.selectedFile == null) {
            this.setState({ submitflag: 1 });
            var tmp = 0;
            for (var i = 0; i < document.getElementsByClassName('rbt-input').length; i++) {
                if (document.getElementsByClassName('rbt-input')[i].value == '') {
                } else {
                    tmp++;
                }
            }
            this.setState({ submitflag: 1, rbtinput: tmp });
        } else {
            this.fileUploadInAssignShift();
        }
    }
    fileUploadInAssignShift = () => {
        const data = new FormData()
        data.append('csvFile', this.state.selectedFile);
        RosterManagementService.fileUploadInAssignShift(data).then(Response => {
            if (Response.status.success == 'Failed') {
                this.setState({ fileUploadInAssignShiftReslt: Response.status.message });
            } else {
                localStorage.addShift = 'edit';
                this.setState({ selectBranchData: '', selectAssignShiftData: '' });
                this.setModalHide();
            }
        });
    }
    uploadFileEnable = () => {
        document.getElementById('empDileUpload').click();
    }
    checkFile = object => {
        this.setState({
            selectedFile: object.target.files[0]
        });
    }
    render() {
        const { Loader } = this.state;

        return (
            <Modal id="rosterManagementModal-assign" show={this.state.AssignShiftModelShow} onHide={this.setModalHide} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                        Assign Shift
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Loader ? <div className="loader">
                        <Spinner animation="grow" variant="dark" />
                    </div> : null}
                    <Row>
                        <Col xl="12">
                            <Row className="align-items-center">
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.PlantLocation} name="clientPlanAreaDetailId"
                                            style={{ color: '#5A5A5A !important' }} onChange={this.selectPlantLocation.bind(this)}>
                                            <option value={0} selected>Branch (Location)</option>
                                            {this.state.AllPlantMasterData.map((PlantObject, index) => <option key={index}
                                                value={PlantObject.clientPlantMasterId}>{`${PlantObject.plant} (${PlantObject.location})`}
                                            </option>)}
                                        </Form.Control>
                                        {
                                            this.state.PlantLocation == '0' && this.state.submitflag == 1 ? (
                                                <Form.Text className="error-msg"> Branch name is required </Form.Text>
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3} sm="3" xl="4" className="addPlantForm">
                                    <Form.Label>Assign Shift</Form.Label>
                                </Col>
                                <Col xs={9} sm="9" xl="8 pl-0" className="addPlantForm">
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.ShiftName} name="clientPlanAreaDetailId"
                                            style={{ color: '#5A5A5A !important' }} onChange={this.selectAssignShift.bind(this)}>
                                            <option value={0} selected>Assign Shift</option>
                                            {this.state.AllClientShiftMaster.map((Object, index) => <option key={index}
                                                value={Object.clientShiftMasterId}>{Object.clientShiftName}
                                            </option>)}
                                        </Form.Control>
                                        {
                                            this.state.ShiftName == '0' && this.state.submitflag == '1' ? (
                                                this.state.AllClientShiftflag == '0' ? (
                                                    <Form.Text className="error-msg"> Shift is not available </Form.Text>
                                                ) : (
                                                        <Form.Text className="error-msg"> Assign shift is required </Form.Text>
                                                    )
                                            ) : null
                                        }
                                    </Form.Group>
                                </Col>

                                <Col xs={12} className="addPlantForm">
                                    <Row className="ml-0">

                                        <Col xs={12} sm="3" xl="4" className="addPlantForm assignShift-media order-2 order-md-1">
                                            <Form.Label>Employee Selected</Form.Label>
                                            <div class="mediaUpload text-center" onClick={this.uploadFileEnable}>
                                                {
                                                    this.state.selectedFile == null ? (
                                                        <i class="icon icon-upload"></i>
                                                    ) : (
                                                            <img src={fileExcel} alt="File Excel" style={{ width: 50, height: 50 }} />
                                                        )
                                                }
                                            </div>
                                            <div className="sample-download" onClick={this.downloadCSV}>Sample Download</div>
                                            <div>
                                                <input type="file" id="empDileUpload" name="empDileUpload"
                                                    style={{ display: 'none' }} accept=".xlsx, .xls, .csv" onChange={this.checkFile} />
                                            </div>
                                        </Col>
                                        <Col xs={12} sm="9" xl="8 pl-0" className="addPlantForm order-1 order-md-2">
                                            {this.empFiled()}
                                            {
                                                this.state.rbtinput == '0' && this.state.submitflag == '1' ? (
                                                    <Form.Text className="error-msg"> Please assign Employee  </Form.Text>
                                                ) : null
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Col>
                        <Col xl="12 text-center mt-4" className="modal-btn rosterManagement-btn">
                            {
                                this.state.fileUploadInAssignShiftReslt == null ? null : (
                                    <Form.Text className="error-msg"
                                        style={{ textAlign: 'center', marginBottom: 10 }}>{this.state.fileUploadInAssignShiftReslt}</Form.Text>
                                )
                            }
                            <button className="btn" onClick={this.setModalHide} >Cancel</button>
                            {
                                this.state.selectBranchData != '0' && this.state.selectAssignShiftData != '0' && this.state.selectEmpCount != '0' ?
                                    (
                                        <button className="btn" style={{ backgroundColor: '#e2dcdc' }}
                                            onClick={this.SubmitAssignShif}>Assign</button>
                                    ) : (
                                        <button className="btn" onClick={this.assignValidation}>Assign</button>
                                    )
                            }
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}

export default AssignShiftData;
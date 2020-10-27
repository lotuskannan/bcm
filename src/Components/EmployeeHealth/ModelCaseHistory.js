import React, { Component } from 'react';
import { Row, Col, Table, Modal, Spinner, Button,Alert } from 'react-bootstrap';
import videoFile from '../../assets/images/video-file@2x.png';
import doneImg from '../../assets/images/deatils-done@2x.png';
import mediaImg from '../../assets/images/powder-coat-plant.jpg';
import callIcon from '../../assets/images/phone.svg';
import videoIcon from '../../assets/images/video-call.svg';
import mailIcon from '../../assets/images/mail.svg';
import surveyIcon from '../../assets/images/survey.svg';
import fever from '../../assets/images/fever.png';
import dryCough from '../../assets/images/dry-cough.png';
import sneezing from '../../assets/images/sneezing.png';
import shortBreath from '../../assets/images/short-breath.png';
import smell from '../../assets/images/smell.png';

import userImg from '../../assets/images/Mask-Group-user.png';
import searchIcon from '../../assets/images/search.svg';
import * as EmployeeHealthService from './EmployeeHealthService';
import { GenericApiService } from '../../Service/GenericApiService';
import { UrlConstants } from '../../Service/UrlConstants';

class ModelCaseHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: props.modalShow,
            empData: props.empData,
            userRecordDetails: [],
            totalDaysLeft: '',
            returnDateToWork: '',
            loader: false,
            surveyData: '',
            employeeCode: '',
            graphData: [],
            flagfamilyTestedPositive: '',
            dbQuestions: [],
            UIQuestions: [],
            surveyQuestions: [],
            graphDataId: '',
            celicusValue: "",
            sessionExpired:false
        }
    }
    setModalHide = () => {
        this.props.onHide(false);
    }
    async componentDidMount() {
        if (this.state.empData.lastUpdatedStatus == 'Work From Home') {
            await this.getDynamicSurveyQuestion(this.state.empData.bcmUserId);
        }
        await this.popupData();
        await this.getEmployeeCodeById(this.state.empData.bcmUserId);
    }
    popupData = () => {
        EmployeeHealthService.empHistoryRecord(this.state.empData.bcmUserId).then(response => {
            if (response.data) {
                console.log(response.data);
                var mapDate = '';
                // var len = response.data.historyStartAndEndDate.split('-');
                mapDate = response.data.historyStartAndEndDate;
                this.setState({
                    totalDaysLeft: response.data.totalDaysLeft,
                    returnDateToWork: response.data.returnDateToWork, graphDataId: mapDate
                });
                // response.data.graphData
                if (response.data.historyList == null) {
                    this.setState({ userRecordDetails: [] });
                } else {
                    this.setState({ userRecordDetails: response.data.historyList });
                }
                if (response.data.graphData == null) {
                    this.setState({ graphData: [] });
                } else {
                    this.setState({ graphData: response.data.graphData })
                }
                console.log(response.data);

            }
            this.setState({ loader: true });
        }).catch(error => {
            if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                this.setState({sessionExpired:true});
                setTimeout(() => {
                
                sessionStorage.clear();
                this.props.history.push("login");
                this.setState({ Loader: false });
                },3000);				
            }
        });	
    }
    surveyData = (selectedRow, index, event) => {
        if (this.state.empData.lastUpdatedStatus == 'Work From Home') {
            this.getSelectedSurveyQuestion(index)
        }

        if (document.getElementsByName('d-none').length) {
            for (var i = 0; i < document.getElementsByName('d-none').length; i++) {
                document.getElementsByName('d-none')[i].className = 'd-none';
            }
        }
        if (selectedRow.historyDate) {
            document.getElementById(selectedRow.historyDate).className = '';
        }
        if (selectedRow.bcmEmployeeHealthSurveyData) {
            var surveyData = selectedRow.bcmEmployeeHealthSurveyData;
            var celicusValue = surveyData.feverRecord;
            celicusValue = (celicusValue - 32) * 5 / 9;
            celicusValue = Math.round(celicusValue * 10) / 10;
            this.setState({ surveyData: selectedRow.bcmEmployeeHealthSurveyData, celicusValue: celicusValue });

        }
        this.setState({ flagfamilyTestedPositive: selectedRow.familyTestedPositive })
    }
    closeRowDetailsModel = (selectedRow, event) => {
        if (document.getElementsByName('d-none').length) {
            for (var i = 0; i < document.getElementsByName('d-none').length; i++) {
                document.getElementsByName('d-none')[i].className = 'd-none';
            }
        }
    }
    scrollUpSurvayPopup = (id) => {
        var elm = document.getElementById(id);
        if (elm) {
            elm.scrollIntoView();
        }
    }
    getEmployeeCodeById = (bcmUserId) => {
        if (bcmUserId) {
            return EmployeeHealthService.getUserDetails(bcmUserId)
                .then(response => {
                    const value = response.data.employeeCode ? response.data.employeeCode : '--';
                    this.setState({ employeeCode: value });
                }).catch(error => {
                    if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                        this.setState({sessionExpired:true});
                        setTimeout(() => {
                        
                        sessionStorage.clear();
                        this.props.history.push("login");
                        this.setState({ Loader: false });
                        },3000);				
                    }
                });	
        }
    }
    findDay = (monthWithDay) => {
        var Day = '';
        if (monthWithDay) {
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var currentYear = new Date();
            var yr = currentYear.getFullYear();
            var mValue = monthWithDay.split(' ')[0]
            var dyValue = monthWithDay.split(' ')[1];
            var monVal = '';
            if (shortMonths.indexOf(mValue) == -1) {
                monVal = fullMonths.indexOf(mValue) + 1;
            } else {
                monVal = shortMonths.indexOf(mValue) + 1;
            }
            // var monVal = shortMonths.indexOf(mValue)+1;           
            var mappingValue = yr + '/' + monVal + '/' + dyValue;
            var dateValue = new Date(mappingValue);
            var dayindex = dateValue.getDay();
            Day = fullDays[dayindex];
        }
        return Day;
    }
    getShortMon = (dateVal) => {
        var date = null;
        if (dateVal) {
            var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var monVal = dateVal.split(' ')[1];
            var indexfulmont = fullMonths.indexOf(monVal);
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // return shortMonths[indexfulmont];
            date = dateVal.split(' ')[0] + " " + shortMonths[indexfulmont] + " " + dateVal.split(' ')[2];
        } else {
            date = null;
        }
        return date;
    }
    getDynamicSurveyQuestion = (userId) => {
        if (userId) {
            const url = UrlConstants.getDynamciSurveyQuestionUrl + userId;
            GenericApiService.getAll(url)
                .then(response => {
                    if (response.status.success == 'SUCCESS') {
                        this.setState({ surveyQuestions: response.data });
                    } else {
                        this.setState({ loader: true });
                    }
                }).catch(error => {
                    if(error.message == "Request failed with status code 401" || error.message == "Network Error"){
                        this.setState({sessionExpired:true});
                        setTimeout(() => {
                        
                        sessionStorage.clear();
                        this.props.history.push("login");
                        this.setState({ Loader: false });
                        },3000);				
                    }
                });	
        }
    }


    getSelectedSurveyQuestion(index) {

        if (this.state.surveyQuestions.length > 0 && this.state.surveyQuestions.length > index) {
            var UIQuestions = [];
            for (let quez of this.state.surveyQuestions[index].options) {
                for (let option of quez.surveyQuestion.surveyQuestionOptions) {
                    if (option.optionValue == quez.optionValue) {
                        if (option.optionValue == 'Temperature') {
                            option.optionValue = quez.inputValue;
                        }
                        option.selected = true;
                    }
                }
            }
            var questionArray = this.state.surveyQuestions[index].options.map(elme => elme.surveyQuestion);
            UIQuestions.push(questionArray[0]);
            this.setState({ dbQuestions: questionArray, UIQuestions: UIQuestions }, () => {
                for (let quez of this.state.surveyQuestions[index].options) {
                    for (let option of quez.surveyQuestion.surveyQuestionOptions) {
                        if (option.optionValue == quez.optionValue) {
                            if (option.optionValue == 'Temperature') {
                                option.optionValue = quez.inputValue;
                            }
                            if (option.selected) {
                                this.onClickOption(quez.surveyQuestion, option);
                            }

                        }
                    }
                }
            });
        } else {
            this.setState({ dbQuestions: [], UIQuestions: [] });
        }
    }

    onClickOption(quesionObj, ansObj) {
        var dbQuestions = [];
        var UIQuestions = [];
        dbQuestions = this.state.dbQuestions;
        UIQuestions = this.state.UIQuestions;
        var questionIndex = UIQuestions.findIndex(qn => qn.parentSurveyQuestionOptionId == quesionObj.parentSurveyQuestionOptionId);
        var optionIndex = quesionObj.surveyQuestionOptions.findIndex(opt => opt.surveyQuestionOptionId == ansObj.surveyQuestionOptionId);
        // if it is remodify  questions...
        var options = quesionObj.surveyQuestionOptions;
        for (let option of options) {
            if (option.selected == true) {
                //if alreday selected make it as  unselect it and 
                option.selected = false;
                //remove remaining......
                UIQuestions.splice(questionIndex + 1)

            }
        }
        //To highlight the option...
        ansObj.selected = true;
        quesionObj.surveyQuestionOptions[optionIndex] = ansObj;
        UIQuestions[questionIndex] = quesionObj;
        //To get next question...

        var index = dbQuestions.findIndex(quesn => quesn.parentSurveyQuestionOptionId == ansObj.surveyQuestionOptionId);
        if (index != -1) {
            UIQuestions.push(dbQuestions[index]);
            this.setState({
                UIQuestions: UIQuestions
            })
        }
        else {
            this.setState({
                UIQuestions: UIQuestions,

            })
        }
    }

    render() {
        const { UIQuestions } = this.state;
        return (
            <Modal id="caseHistory" show={this.state.modalShow} onHide={this.setModalHide} size="lg"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="pl-1">
                        Case History
                   </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Alert show={this.state.sessionExpired} variant="danger">
                        <div className="alert-container">
                        <p><i className="icons"></i> Session Expired,Please login again.</p>
                     </div>
                </Alert>
                    {
                        this.state.loader == false ? (
                            <div className="loader">
                                <Spinner animation="grow" variant="dark" />
                            </div>
                        ) : (
                                <div className="whiteBg">
                                    <div className="caseDetailsContainer">
                                        <Row className="px-3">
                                            <Col md="5" xl="5">
                                                <Row className="scrollHeader borderRight">
                                                    <Col xl="12" className="userDetails modelUserDetails">
                                                        <h5 className="name">{this.state.empData.employeeName}</h5>
                                                        <div className="row user-info">
                                                            <div className="col-6 user-info-left">
                                                                <h6>{this.state.employeeCode}</h6>
                                                            </div>
                                                            <div className="col-6 user-info-right">
                                                                <h6 className="dept">{this.state.empData.department}</h6>
                                                                <h6 className="desination">{this.state.empData.designation}</h6>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xl="12">
                                                        <div className="emp-tableContainer">
                                                            <Table striped bordered hover className="emp-table caseHistoryTable mt-2">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Status</td>
                                                                        <td>
                                                                            <div className="text-right ">
                                                                                <span className="confirm text-uppercase">
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Confirmed' ? <p style={{ color: '#c90000' }}>COVID Confirmed</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Stay at Home' ? <p style={{ color: '#E36600' }}>Quarantine</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Suspected' ? <p style={{ color: 'red' }}>Suspected</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Worsening' ? <p style={{ color: '#c90000' }}>Worsening</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'On Site' ? <p style={{ color: '#77e500' }} title="Work From Office">WFO</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Recovered' ? <p style={{ color: '#418600' }}>Recovered</p> : null
                                                                                    }
                                                                                    {
                                                                                        this.state.empData.lastUpdatedStatus == 'Work From Home' ? <p style={{ color: '#BE83FF' }} title="Work From Home">WFH</p> : null
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    {this.state.empData.lastUpdatedStatus != 'Work From Home' ? <tr>
                                                                        <td>Quarantine Days</td>
                                                                        <td>
                                                                            <div style={{ textAlign: 'right' }}>{this.state.totalDaysLeft + '/14'}</div>
                                                                        </td>
                                                                    </tr> : null}
                                                                    <tr>
                                                                        <td>Health Condition</td>
                                                                        <td>
                                                                            {
                                                                                this.state.empData.lastUpdatedCondition == null ? (
                                                                                    <div>---</div>
                                                                                ) : (
                                                                                        this.state.empData.lastUpdatedCondition == 'Stay at Home' ||
                                                                                            this.state.empData.lastUpdatedCondition == 'Suspected' ||
                                                                                            this.state.empData.lastUpdatedCondition == 'Worsening' ? (
                                                                                                <div className="option text-uppercase confirm">
                                                                                                    {this.state.empData.lastUpdatedCondition}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="option text-uppercase green-text-color  ">
                                                                                                    {this.state.empData.lastUpdatedCondition}
                                                                                                </div>
                                                                                            )
                                                                                    )
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                    {this.state.empData.lastUpdatedStatus != 'Work From Home' ? <tr>
                                                                        <td>Expected Date of Return</td>
                                                                        <td>
                                                                            <div className="option">
                                                                                {this.getShortMon(this.state.returnDateToWork)}
                                                                            </div>
                                                                        </td>
                                                                    </tr> : null}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md="7" xl="7" className="modal-right">
                                                <div className="caseHeader">
                                                    <div className="date-year">
                                                        {
                                                            // this.state.graphData[0] ? (
                                                            //     this.state.graphData[0].historyDate != undefined ? (
                                                            //         (this.state.graphData[0].historyDate.split(' ')[0] == this.state.graphData[13].historyDate.split(' ')[0]) ? (
                                                            //             <h6>{this.state.graphData[0].historyDate.split(' ')[0]} - 2020 </h6>
                                                            //         ) : (
                                                            //                 <h6>{this.state.graphData[0].historyDate.split(' ')[0]} - {this.state.graphData[13].historyDate.split(' ')[0]} &nbsp;&nbsp;2020 </h6>
                                                            //             )
                                                            //     ) : (
                                                            //             this.state.returnDateToWork ? (
                                                            //                 <h6>{this.state.returnDateToWork.split(' ')[1]} - 2020</h6>
                                                            //             ) : null
                                                            //         )
                                                            // ) : null
                                                            this.state.graphDataId == '' ? null : (
                                                                <h6>{this.state.graphDataId}</h6>
                                                            )
                                                        }

                                                        <span className="small">Health Condition</span>
                                                    </div>
                                                    <div className="optionList d-none">
                                                        <ul className="list">
                                                            <li><i><img src={callIcon} alt="CallIcon" /></i></li>
                                                            <li><i><img src={videoIcon} alt="videoIcon" /></i></li>
                                                            <li><i><img src={mailIcon} alt="mailIcon" /></i></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="graph">
                                                    <div>
                                                        <table className="table table-sm grapTable">
                                                            {
                                                                this.state.graphData ? (
                                                                    <tbody>
                                                                        <tr>
                                                                            {
                                                                                this.state.graphData.map((Object, index) => {
                                                                                    return (
                                                                                        <td key={index}>
                                                                                            {
                                                                                                (Object.healthCondition == 'Stay at Home' || Object.healthCondition == 'Suspected' ||
                                                                                                    Object.healthCondition == 'Worsening') ?
                                                                                                    <div className="circle red"></div> : (
                                                                                                        Object.healthCondition == 'Improving' ? (
                                                                                                            <div className="circle green" style={{ color: '#4ABF21' }}></div>
                                                                                                        ) : null
                                                                                                    )
                                                                                            }

                                                                                        </td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            {
                                                                                this.state.graphData.map((Object, index) => {
                                                                                    return (
                                                                                        <td key={index}>
                                                                                        <div className="historyDate">
                                                                                            {
                                                                                                Object.historyDate ? (
                                                                                                    Object.historyDate.length == 5 ? '0'+Object.historyDate : Object.historyDate
                                                                                                ):null
                                                                                            }
                                                                                        </div>
                                                                                        </td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                ) : null
                                                            }
                                                        </table>
                                                    </div>
                                                    <div className="text-right w-100">
                                                        {
                                                            this.state.empData.lastUpdatedStatus == 'Suspected' ?
                                                                <Button className="covid-test" size="sm">schedule a <span>COVID</span> test</Button>
                                                                : null
                                                        }
                                                    </div>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                    <Row>
                                        <Col xl="12 caseDetailsContainer">
                                            <div className="caseDetails">
                                                {
                                                    this.state.userRecordDetails ? (
                                                        <Table striped responsive className="caseDetailsTable">
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Health Status</th>
                                                                    <th>Condition</th>
                                                                    <th>Survey</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="caseDetailsTableBody">
                                                                {
                                                                    this.state.userRecordDetails.map((Object, index) => {

                                                                        return (
                                                                            <>
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <div className="d-flex align-items-center">
                                                                                            <div className="caseDateIcon">
                                                                                                <img src={mailIcon} alt="caseDateIcon" />
                                                                                            </div>
                                                                                            <div className="caseDate">
                                                                                                <span className="date">{Object.historyDate}</span>
                                                                                                <span className="day">{this.findDay(Object.historyDate)}</span>
                                                                                                {
                                                                                                    Object.isCreatedFromSecurity == true && this.state.empData.lastUpdatedStatus != 'Work From Home' ? (
                                                                                                        <span className="day">(Security)</span>
                                                                                                    ) : (
                                                                                                            <span className="day">(Employee)</span>
                                                                                                        )
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            Object.bcmEmployeeHealthSurveyData == null ? null : (
                                                                                                <ul className="healthStatus">
                                                                                                    <li className={
                                                                                                        (
                                                                                                            Object.bcmEmployeeHealthSurveyData.feverSymptomValue === true ?
                                                                                                                'error' : 'success'
                                                                                                        )
                                                                                                    }>Fever</li>
                                                                                                    <li className={
                                                                                                        (
                                                                                                            Object.bcmEmployeeHealthSurveyData.coughSymptomValue === true ?
                                                                                                                'error' : 'success'
                                                                                                        )
                                                                                                    }>Cough</li>
                                                                                                    <li className={
                                                                                                        (
                                                                                                            Object.bcmEmployeeHealthSurveyData.bodyAcheAndPainSymptomValue === true ?
                                                                                                                'error' : 'success'
                                                                                                        )
                                                                                                    }>Aches & Pain</li>
                                                                                                    <li className={
                                                                                                        (
                                                                                                            Object.bcmEmployeeHealthSurveyData.shortnessOfBreathSymptomValue === true ?
                                                                                                                'error' : 'success'
                                                                                                        )
                                                                                                    }>Shortness of Breath</li>
                                                                                                     <li className={
                                                                                                        (
                                                                                                            Object.bcmEmployeeHealthSurveyData.senseOfSmell === true ?
                                                                                                                'error' : 'success'
                                                                                                        )
                                                                                                    }>Sense of Smell</li>
                                                                                                </ul>
                                                                                            )
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            Object.healthCondition == null ? (
                                                                                                <div>---</div>
                                                                                            ) : (
                                                                                                    Object.healthCondition == 'Stay at Home' || Object.healthCondition == 'Suspected' ||
                                                                                                        Object.healthCondition == 'Worsening' ? (
                                                                                                            <span className="option confirm">{Object.healthCondition}</span>
                                                                                                        ) : (
                                                                                                            <span className="green-text-color ">{Object.healthCondition}</span>
                                                                                                        )
                                                                                                )
                                                                                        }
                                                                                    </td>
                                                                                    <td><span className="surveyIcon" onClick={e => this.scrollUpSurvayPopup(Object.historyDate)}><img src={surveyIcon} alt="SurveyIcon"
                                                                                        onClick={this.surveyData.bind(this, Object, index)} /></span></td>
                                                                                </tr>
                                                                                <tr id={Object.historyDate} className="d-none" name="d-none">
                                                                                    <div className="tableData row align-items-center" style={{ marginTop: 10, marginBottom: 10 }}>
                                                                                        <button type="button" className="close" onClick={this.closeRowDetailsModel.bind(this, Object)}>
                                                                                            <span aria-hidden="true">×</span>
                                                                                            <span className="sr-only">Close</span>
                                                                                        </button>

                                                                                        {this.state.empData.lastUpdatedStatus != 'Work From Home' ?
                                                                                            <>
                                                                                                <div className="col-md-3 col-lg-3">
                                                                                                    <div className="tableDataDetails">
                                                                                                        <p className="big">Temperature</p>
                                                                                                        {/* green color  text for class name :  .green
                                                                                                            red color text for class name : red
                                                                                                        */}
                                                                                                        {this.state.surveyData.feverRecord > 99.5 ? (<p className="degreeCelsius red">{this.state.surveyData.feverRecord}
                                                                                                            <span> °F  </span>
                                                                                                            ({this.state.celicusValue}
                                                                                                            <span> °C</span>)
                                                                                                        </p>) : <p className="degreeCelsius green">{this.state.surveyData.feverRecord}
                                                                                                                <span> °F  </span>
                                                                                                                (
                                                                                                                    {this.state.surveyData.feverRecord == '0.0' ? '0.0' : this.state.celicusValue}
                                                                                                                <span> °C</span>
                                                                                                                )
                                                                                                        </p>}
                                                                                                        <p className="big">Oximeter</p>
                                                                                                        {(this.state.surveyData.oximeterReading >= 90 && this.state.surveyData.oximeterReading <= 120) ? <p className="degreeCelsius green">{this.state.surveyData.oximeterReading}<span> mm Hg</span></p> : <p className="degreeCelsius red">{this.state.surveyData.oximeterReading}<span> mm Hg</span></p>}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-4 col-lg-4 ">
                                                                                                    <div className="tableDataDetails">
                                                                                                        <p className="samll">Symptoms</p>
                                                                                                        <div className="fever">
                                                                                                            {
                                                                                                                this.state.surveyData.feverSymptomValue == true ? (
                                                                                                                    <div className="feverDetails">
                                                                                                                        <img src={fever} alt="fever" />
                                                                                                                        <p>Fever</p>
                                                                                                                    </div>
                                                                                                                ) : null
                                                                                                            }
                                                                                                            {
                                                                                                                this.state.surveyData.coughSymptomValue == true ? (
                                                                                                                    <div className="feverDetails">
                                                                                                                        <img src={dryCough} alt="Cough" />
                                                                                                                        <p>Cough</p>
                                                                                                                    </div>
                                                                                                                ) : null
                                                                                                            }
                                                                                                            {
                                                                                                                this.state.surveyData.bodyAcheAndPainSymptomValue == true ? (
                                                                                                                    <div className="feverDetails">
                                                                                                                        <img src={sneezing} alt="sneezing" />
                                                                                                                        <p>Body Ache and Pain</p>
                                                                                                                    </div>
                                                                                                                ) : null
                                                                                                            }
                                                                                                            {
                                                                                                                this.state.surveyData.shortnessOfBreathSymptomValue == true ? (
                                                                                                                    <div className="feverDetails">
                                                                                                                        <img src={shortBreath} alt="shortBreath" />
                                                                                                                        <p>Shortness of Breath</p>
                                                                                                                    </div>
                                                                                                                ) : null
                                                                                                            }
                                                                                                            {
                                                                                                                this.state.surveyData.senseOfSmell == true ? (
                                                                                                                    <div className="feverDetails">
                                                                                                                        <img src={smell} alt="senseofsmell" />
                                                                                                                        <p>Sense of Smell</p>
                                                                                                                    </div>
                                                                                                                ) : null
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-md-3 col-lg-3 ">
                                                                                                    <div className="tableDataDetails">
                                                                                                        <p>Have you left your home in the last 12 hours?</p>
                                                                                                        <p className="highlight">
                                                                                                            {
                                                                                                                this.state.empData.lastUpdatedStatus == 'Stay at Home' ? (
                                                                                                                    <span>No</span>
                                                                                                                ) : (
                                                                                                                    this.state.surveyData.leftHomeInLast12Hours == null ? (
                                                                                                                        <span>--</span>
                                                                                                                    ):(
                                                                                                                        this.state.surveyData.leftHomeInLast12Hours === true ? (
                                                                                                                            <span>Yes</span>
                                                                                                                        ) : (<span>No</span>)
                                                                                                                    )   
                                                                                                                )
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-2 col-lg-2">
                                                                                                    <div className="tableDataDetails">
                                                                                                        <p>Have any of your family members tested positive for covid ?</p>
                                                                                                        <p className="highlight">
                                                                                                            {
                                                                                                                // this.state.empData.lastUpdatedStatus == 'Stay at Home' ? (
                                                                                                                //     <span>No</span>
                                                                                                                // ) : (
                                                                                                                //         this.state.flagfamilyTestedPositive == true ? (
                                                                                                                //             <span>Yes</span>
                                                                                                                //         ) : (<span>No</span>)
                                                                                                                //     )
                                                                                                                this.state.flagfamilyTestedPositive == null ? (
                                                                                                                    <span>--</span>
                                                                                                                ):(
                                                                                                                    this.state.flagfamilyTestedPositive == true ? (
                                                                                                                        <span>Yes</span>
                                                                                                                    ) : (<span>No</span>)
                                                                                                                )                                                                                                                
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>

                                                                                            : <>

                                                                                                {UIQuestions.length > 0 ? UIQuestions.slice(0, 4).map((qobject, index) =>
                                                                                                    <div key={index} className="col-md-3 col-lg-3">
                                                                                                        <div className="tableDataDetails">
                                                                                                            <p>{qobject.question}</p>

                                                                                                            {qobject.surveyQuestionOptions.map((optionObj, opindex) =>
                                                                                                                // onClick={() => this.onClickOption(qobject, optionObj)}

                                                                                                                qobject.questionType != 'FB' && optionObj.selected ? <p key={opindex} className="highlight mt-2"><span>{optionObj.optionValue}</span>
                                                                                                                </p> : qobject.questionType == 'FB' ? <p className="temperature-color mt-2">
                                                                                                                    <span className="green">{optionObj.optionValue} &#8451;</span></p>
                                                                                                                        : null

                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>) : <p>No Records Found</p>}

                                                                                                {UIQuestions.length > 4 ? <div className="col-12 border-line"></div> : null}
                                                                                                {UIQuestions.length > 0 ? UIQuestions.slice(4, 8).map((qobject, index) =>
                                                                                                    <div key={index} className="col-md-3 col-lg-3">
                                                                                                        <div className="tableDataDetails">
                                                                                                            <p>{qobject.question}</p>

                                                                                                            {qobject.surveyQuestionOptions.map((optionObj, opindex) =>

                                                                                                                qobject.questionType != 'FB' && optionObj.selected ? <p key={opindex} className="highlight mt-2"><span>{optionObj.optionValue}</span>
                                                                                                                </p> : qobject.questionType == 'FB' ? <p className="temperature-color mt-2">
                                                                                                                    <span className="green">{optionObj.optionValue} &#8451;</span></p>
                                                                                                                        : null

                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>) : null}
                                                                                            </>
                                                                                        }


                                                                                    </div>
                                                                                </tr>
                                                                            </>

                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    ) : null
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )
                    }
                </Modal.Body>
            </Modal>
        )
    }
}
export default ModelCaseHistory;
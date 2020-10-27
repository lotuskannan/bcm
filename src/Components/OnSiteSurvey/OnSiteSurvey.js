import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Button, Form, Spinner, ToggleButton, ToggleButtonGroup, Alert } from 'react-bootstrap';
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead';
import avatar from '../../assets/images/avatar.svg';
import fever from '../../assets/images/fever.png';
import dryCough from '../../assets/images/dry-cough.png';
import sneezing from '../../assets/images/sneezing.png';
import shortBreath from '../../assets/images/short-breath.png';
import smell from '../../assets/images/smell.png';
import notes from '../../assets/images/notes.svg';
import sharingService from '../../Service/DataSharingService';
import * as OnSiteSurveyService from './OnSiteSurveyService';
import BaseUrl from '../../Service/BaseUrl';
import './site.css';
const AsyncTypeahead = asyncContainer(Typeahead);
var CloneSymptoms = [];
var selectUserId = '';
var selectUserCode = '';

class OnSiteSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: '',
            employeeCodeList: [],
            userDetails: [],
            Symptoms: [{ fever: false },
            { drycough: false },
            { sneezing: false },
            { shortofbreath: false }],
            symptomsFever: false,
            symptomsdrycough: false,
            symptomssneezing: false,
            symptomsshortofbreath: false,
            scan: '',
            scanned: '',
            ppeflag: false,
            ppeValue: null,
            ppeViewFlag: false,
            familyflas: false,
            familytest: null,
            familyView: false,
            submintEntryHealthCheckFormMsg: false,
            loader: false,
            scanCardloader: true,
            employeListloader: false,
            isErrorTemperature: '',
            verifyFormClass: 'survey-form',
            checkbooxGroupClass: 'checkboox-group',
            userDetailsFirstName: '',
            userDetailsLastName: '',
            multiple: '',
            options: [],
            isLoading: false,
            empID: '',
            message: '',
            messageType: '',
            userGroup: '',
            fullName: '',
            ppeErrorMsg: '',
            familytestErrorMsg: '',
            flagTempTest: '',
            temperatureColor: '#418600',
            empViewFlag: 'notview',
            empViewStatus: '',
            familyTestedPositive: false,
            selectEmpLoder: false,
            belowtempflag: false,
            varifyClass: 'ml-5 mr-4',
            OximeterReading: null,
            OximeterReadingError: null,
            plantErrorMsg: '',
            temparatureType: "F",
            temparatureF: '',
            SymptomFeverEventColor: 'survey-icons',
            SymptomDryCoughEventColor: 'survey-icons',
            SymptomAchesAndPainEventColor: 'survey-icons',
            SymptomShortofBreathEventColor: 'survey-icons',
            SenceofsmallColor:'survey-icons',
            sessionExpired:false

        };
        // this.getEmployeeCodeList();
        this.getScancount();
    }
    componentDidMount() {
        selectUserCode = '';
        document.getElementsByTagName('Body')[0].className = 'onsite-profile';
        var ele = document.getElementById('temp');
        ele.onkeypress = function (e) {
            if (isNaN(this.value + "" + String.fromCharCode(e.charCode)))
                return false;
        }
        ele.onpaste = function (e) {
            e.preventDefault();
        }
        this.setState({ userGroup: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup });
        var lname = JSON.parse(sessionStorage.LoginUserObject).lastName == '' ? '' : JSON.parse(sessionStorage.LoginUserObject).lastName;
        var name = JSON.parse(sessionStorage.LoginUserObject).firstName + ' ' + lname;
        this.setState({ fullName: name });
        this.subscription = sharingService.getMessage().subscribe(message => {
            if (message) {
                if (this.props.history.location.pathname == '/home/onsitesurvey') {                    
                    if(document.getElementsByClassName('rbt-input-main')){
                        if(document.getElementsByClassName('rbt-input-main')[0]){
                            document.getElementsByClassName('rbt-input-main')[0].value = '';
                        }
                    }
                    if(this.refs.SubjectTypeahead){
                        setTimeout(() => this.refs.SubjectTypeahead.clear(), 0);
                    }                    
                    setTimeout(() => {                        
                        this.formReset();
                        this.setState({ userDetails: [] });
                        document.getElementById('department').value = '';
                        document.getElementsByClassName('rbt-input-main')[0].value = '';
                    }, 100);
                    this.getScancount();
                }
            }
        });
    }
    onChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ value: e.target.value })
        }
    }
    getEmployeeCodeList = (e) => {
        var SearchCode = e;
        OnSiteSurveyService.getEmployeeCodeListNew(SearchCode).then(Response => {            
            if (Response.status.message === 'Search Users are available') {                
                if (Response.data.length === 0) {
                    this.setState({ employeeCodeList: [] })
                } else {
                    this.setState({ employeeCodeList: Response.data })
                }
            }
            // this.setState({employeeCodeList:Response.data});
            // this.setState({employeListloader:false});
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
    userCodeSearch = (query) => {
        if (sessionStorage.plantId == '0' || sessionStorage.plantId == undefined) {
            this.setState({ plantErrorMsg: 'Select the branch From Header' });
            setTimeout(() => this.refs.SubjectTypeahead.getInstance().clear(), 0);
            document.getElementsByClassName('rbt-input-main')[0].value = '';
        } else {
            var SearchCode = query;
            this.setState({ isLoading: true, plantErrorMsg: '' });
            OnSiteSurveyService.getEmployeeCodeListNew(SearchCode).then(Response => {
                ;
                if (Response.data.length === 0) {
                    this.setState({ options: [], isLoading: false })
                } else {
                    this.setState({ options: Response.data })
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
    submintEntryHealthCheck = (e) => {
        e.preventDefault();
        if (this.state.temperature == '') {
            this.setState({ isErrorTemperature: 'Please enter a temperature' });
        }
        if (this.state.temperatureColor == '#418600' && this.state.ppeValue == null) {
            this.setState({ ppeErrorMsg: 'Please select PPE status' });
        }
        if (this.state.familytest == null) {
            this.setState({ familytestErrorMsg: 'Please select family members test status' });
        }
        if (this.state.temperature == '') {
        } else {
            if (this.state.familytest == null) {
            } else {
                this.setState({ verifyFormClass: 'survey-form verify' });
                // document.getElementById('gtest').className = 'btn-group btn-group-toggle item-two';
                // this.setState({ checkbooxGroupClass: 'checkboox-group mouse-block', varifyClass: '' });
            }
        }
    }
    editEntryHealthCheck = () => {
        this.setState({ verifyFormClass: 'survey-form', varifyClass: 'ml-5 mr-3' });
        // document.getElementById('gtest').className = 'btn-group btn-group-toggle';
        // this.setState({ checkbooxGroupClass: 'checkboox-group' });
    }
    verifyedEntryHealthCheck = () => {
        if (this.state.familytest == null) {
            this.setState({ familytestErrorMsg: 'Please select family members test status' });
        } else {
            this.enterHealthCheckRequest();
            this.editEntryHealthCheck();
            // this.formReset();
            this.setState({ options: [] });
            this.setState({ userDetails: [] });
            this.setState({ empID: '' });
            setTimeout(() => {
                this.formReset();
                document.getElementById('department').value = '';
                document.getElementsByClassName('rbt-input-main')[0].value = '';
            }, 500);
            setTimeout(() => this.refs.SubjectTypeahead.getInstance().clear(), 0);
        }
    }
    formReset = () => {
        selectUserCode = '';
        this.setState({ userDetailsFirstName: '' });
        this.setState({ userDetailsLastName: '' });
        this.setState({ temperature: '' });
        this.setState({ OximeterReading: '' });
        this.setState({ OximeterReading: null });
        this.setState({ ppeValue: null });
        this.setState({ familytest: null });
        this.setState({ SymptomFeverEventColor: 'survey-icons' });
        this.setState({ SymptomDryCoughEventColor: 'survey-icons' });
        this.setState({ SymptomAchesAndPainEventColor: 'survey-icons' });
        this.setState({ SymptomShortofBreathEventColor: 'survey-icons' });
        this.setState({ SenceofsmallColor: 'survey-icons' });
        document.getElementById('department').value = '';
        this.setState({ temperatureColor: '#418600' });
        this.setState({ userDetails: [] });
    }
    enterHealthCheckRequest() {
        var temperature = +this.state.temperature;
        if (this.state.temparatureType == "C") {
            temperature = temperature * 9 / 5 + 32;
        }
        temperature = Math.round(temperature * 10) / 10;
        var RequestObject = {
            "anyContactWithCovidPositive": false,
            "employeeId": selectUserCode,
            "providePpeForSiteEmployees": document.getElementById('yesid') == null ? false : document.getElementById('yesid').classList.contains("active"),
            "feverSymtomValue": temperature,            
            "coughSymtomValue": this.state.SymptomDryCoughEventColor == 'survey-icons' ? false : true,
            "achesPain": this.state.SymptomAchesAndPainEventColor == 'survey-icons' ? false : true,
            "shortnessOfBreathValue": this.state.SymptomShortofBreathEventColor == 'survey-icons' ? false : true,
            "senseOfSmell": this.state.SenceofsmallColor == 'survey-icons' ? false : true,
            familyTestedPositive: document.getElementById('familytestyesid').classList.contains("active"),
            "workStatus": "SEC",
            "oximeterReading": +this.state.OximeterReading
        }
        this.setState({ message: '' });        
        this.setState({ employeListloader: true });
        OnSiteSurveyService.submitEntryHealthCheckDetails(RequestObject).then(Response => {
            if (Response.status.success == 'SUCCESS') {
                if (Response.data.isAllowedAccessToSite) {
                    this.setState({
                        message: 'Employee Access Granted to Site',
                        messageType: 'success'
                    });

                } else if (!Response.data.isAllowedAccessToSite) {
                    this.setState({
                        message: 'Employee Access Denied to Site due to symptoms',
                        messageType: 'danger'
                    });
                }
                this.setState({ submintEntryHealthCheckFormMsg: true });
                this.setState({ OximeterReading: '' });
                this.setState({ OximeterReading: null });
                this.setState({ employeListloader: false });
                selectUserId = '';
                this.getScancountClone();
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
    getScancount = () => {
        this.setState({ scanCardloader: true });
        OnSiteSurveyService.getScancount().then(Response => {
            this.setState({ scan: Response.data.totalLeftForToday });
            this.setState({ scanned: Response.data.scannedToday });
            this.setState({ submintEntryHealthCheckFormMsg: false });
            this.setState({ plantErrorMsg: '', scanCardloader: false });
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
    getScancountClone = () => {
        this.setState({ scanCardloader: true });
        OnSiteSurveyService.getScancount().then(Response => {
            this.setState({ scan: Response.data.totalLeftForToday });
            this.setState({ scanned: Response.data.scannedToday });
            this.setState({ scanCardloader: false });
            setTimeout(() => {
                this.setState({ submintEntryHealthCheckFormMsg: false });
            }, 3000);
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
    // selectEmp = (e) => {
    //     if (e.length === 0) {
    //         this.formReset();
    //     } else {
    //         selectUserId = e[0].bcmUserId;
    //         selectUserCode = e[0].userCode;
    //         this.getUserDetails(selectUserId);
    //     }
    // }
    selectAsyncTypeahead = (e) => {
        this.setState({ empViewFlag: 'notview' });
        if (e.length === 0) {
            this.formReset();
        } else {
            this.formReset();
            this.setState({ selectEmpLoder: true });
            selectUserId = e[0].bcmUserId;
            selectUserCode = e[0].userCode;
            OnSiteSurveyService.getEmpStatusUserCodeWise(selectUserCode).then(Res => {
                // if (Res.data[0].employeeHealthStatus == "Suspected" || Res.data[0].employeeHealthStatus == "Stay at Home") {                   
                //     this.setState({ empViewFlag: 'view' });
                //     this.setState({ empViewStatus: Res.data[0].employeeHealthStatus });
                //     this.getUserDetails(selectUserId);
                // } else {                   
                //     this.getUserDetails(selectUserId);
                // }
                this.getUserDetails(selectUserId);
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
    getUserDetails = (userId) => {
        OnSiteSurveyService.getUserDetails(userId).then(Response => {
            this.setState({ selectEmpLoder: false });
            this.setState({ userDetails: Response.data });
            this.setState({ userDetailsFirstName: Response.data.firstName });
            this.setState({ userDetailsLastName: Response.data.lastName });
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
    selectSymptoms = (SelectSymIndex, data) => {
        // if(SelectSymIndex == 1 && this.state.temperature > 99.5){  
        //     document.getElementById("gtest").getElementsByTagName("label")[0].className = 
        //     'btn active btn-primary';            
        // }
    }
    singleArrayRemove(array, value) {
        var index = array.indexOf(value);
        if (index > -1) array.splice(index, 1);
        return array;
    }
    ppeEvent = (e) => {
        this.setState({ ppeflag: (e == 1 ? false : true) });
        this.setState({ ppeValue: e });
        this.setState({ ppeErrorMsg: '' });
    }
    familytestEvent = (e) => {
        this.setState({ familytestflag: (e == 1 ? false : true) });
        this.setState({ familytest: e });
        this.setState({ familytestErrorMsg: ' ' });
    }
    ordinal_suffix_of = (i) => {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }
    cardDate = () => {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var d = new Date();
        var dvalue = d.getDate();
        var convertdvalue = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
        return monthNames[d.getMonth()] + " " + this.ordinal_suffix_of(convertdvalue) + ", " + d.getFullYear();
    }
    temperatureChangeEvent = e => {
        var temparature = e.target.value;
        this.setState({ temperature: temparature, belowtempflag: false,ppeValue:null });
        this.setState({ SymptomFeverEventColor: 'survey-icons' });
        this.setState({ SymptomDryCoughEventColor: 'survey-icons' });
        this.setState({ SymptomAchesAndPainEventColor: 'survey-icons' });
        this.setState({ SymptomShortofBreathEventColor: 'survey-icons' });
        this.setState({ SenceofsmallColor: 'survey-icons' });
        if (this.state.temparatureType == "C") {
            temparature = temparature * 9 / 5 + 32;
        }
        this.setState({ temparatureF: temparature });
        if (temparature > 99.5) {            
            this.setState({ temperatureColor: '#FF4C58', ppeViewFlag: false });
        }
        else {          
            this.setState({ temperatureColor: '#418600', ppeViewFlag: true });
        }
        if (temparature > 99.5 && temparature <= 104) {
            this.setState({ SymptomFeverEventColor: 'survey-icons active' });
        } else {
            this.setState({ SymptomFeverEventColor: 'survey-icons' });
        }
        if (this.state.temperature) {
            this.setState({ isErrorTemperature: '' });
        }
        if (this.state.temperature) {
            if (parseFloat(temparature) < 97.50) {
                this.setState({ belowtempflag: true });
            }
            if (parseFloat(temparature) > 104.99) {
                this.setState({ belowtempflag: true });
            }
        }    
        this.abletoselectSyntoms();
    }
    SymptomFeverEvent = () => {
        if (this.state.verifyFormClass == 'survey-form verify') {
        } else {
            if (parseFloat(this.state.temparatureF) > 97.7 && parseFloat(this.state.temparatureF) <= 99.5) {
                this.setState({ SymptomFeverEventColor: 'survey-icons' });
            } else {
                if (this.state.SymptomFeverEventColor == 'survey-icons') {
                    this.setState({ SymptomFeverEventColor: 'survey-icons active' });
                } else {
                    this.setState({ SymptomFeverEventColor: 'survey-icons' });
                }
            }
        }
    }
    SymptomDryCoughEvent = () => {
        if (this.state.verifyFormClass == 'survey-form verify') {
        } else {
            if (this.state.SymptomDryCoughEventColor == 'survey-icons') {
                this.setState({ SymptomDryCoughEventColor: 'survey-icons active' });
            } else {
                this.setState({ SymptomDryCoughEventColor: 'survey-icons' });
            }
        }
    }
    SymptomAchesAndPainEvent = () => {
        if (this.state.verifyFormClass == 'survey-form verify') {
        } else {
            if (this.state.SymptomAchesAndPainEventColor == 'survey-icons') {
                this.setState({ SymptomAchesAndPainEventColor: 'survey-icons active' });
            } else {
                this.setState({ SymptomAchesAndPainEventColor: 'survey-icons' });
            }
        }
    }
    SymptomShortofBreathEvent = () => {
        if (this.state.verifyFormClass == 'survey-form verify') {
        } else {
            if (this.state.SymptomShortofBreathEventColor == 'survey-icons') {
                this.setState({ SymptomShortofBreathEventColor: 'survey-icons active' });
            } else {
                this.setState({ SymptomShortofBreathEventColor: 'survey-icons' });
            }
        }
    }
    SenceofsmallEvent = () => {
        if (this.state.verifyFormClass == 'survey-form verify') {
        } else {
            if (this.state.SenceofsmallColor == 'survey-icons') {
                this.setState({ SenceofsmallColor: 'survey-icons active' });
            } else {
                this.setState({ SenceofsmallColor: 'survey-icons' });
            }
        }
    }    
    temperatureValidator = (Param) => {
        var returnMsg = '';
        if (Param == '') {
            returnMsg = 'Please enter a temperature';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }
    hideAlret = () => {
        this.setState({ submintEntryHealthCheckFormMsg: false });
    }

    getOrdinalNum = (n) => {
        return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }
    abletoselectSyntoms = () => {
        // console.log((t >= 99.5 && t<=104));
        var res = false;
        if (this.state.temperature > 99.5 && this.state.temperature <= 104) {
            res = true;
        } else {
            res = false;
        }
        return res;
    }
    handleTypeChange = (e) => {
        var temperature = this.state.temperature;
        console.log(temperature)
        var selectedType = e.target.value;
        if (temperature != "") {

            if (selectedType != this.state.temparatureType) {
                temperature = +temperature
                if (this.state.temparatureType == "F") {
                    temperature = (temperature - 32) * 5 / 9;
                }
                else {
                    temperature = (temperature * 9) / 5 + 32;
                }
                temperature = Math.round(temperature * 10) / 10
            }

        }

        this.setState({ temparatureType: e.target.value, temperature: temperature })
    }

    OximeterReadingEvent = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({ OximeterReading: e.target.value });
        }
    }

    render() {
        const styles = {
            fontSize: "20px"
        };
        const { isLoading, temperature, temparatureF, OximeterReading } = this.state;
        return (
            <div className="dashboard-container onsite-survey">
                {/* Notification Alerts */}

                <Alert show={this.state.submintEntryHealthCheckFormMsg} variant={this.state.messageType}>
                    <div className="alert-container">
                        <p><i className="icons"></i>  {this.state.message}</p>
                        <div className="alert-btn">
                        <Button className="mt-2" variant="secondary" onClick={this.hideAlret}>OK</Button>
                    </div>
                    </div>
                    
                </Alert>
                <Alert show={this.state.sessionExpired} variant="danger">
                    <div className="alert-container">
                        <p><i className="icons"></i>  Session Expired,Please login again.</p>
                    </div>
                </Alert>
                <div className="dashboard-section">
                    {
                        this.state.userGroup == 'Security' ? (
                            <>
                                <div className="welcome-text">
                                    <div className="user-name">Hello <i>{this.state.fullName}</i></div>
                                    <div>
                                        <span className="team-name">Have a nice day at work</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                                // <div className="welcome-text">
                                //     <div className="pageTitle">
                                //         <h2>Survey Status</h2>
                                //     </div>
                                // </div>
                                <>
                                    <div className="welcome-text">
                                        <div className="user-name">Hello <i>{this.state.fullName}</i></div>
                                        <div>
                                            <span className="team-name">Have a nice day at work</span>
                                        </div>
                                    </div>
                                </>
                            )
                    }
                    <Row className="row-1 h-100">
                        <Col md="4">
                            <Card className="survey-status survey-status-left">
                                <Card.Title>
                                    <h5>Survey Status</h5>
                                </Card.Title>
                                <Card.Body>
                                    {
                                        this.state.scanCardloader === true ? (
                                            <div className="loader">
                                                <Spinner animation="grow" variant="dark" />
                                            </div>
                                        ) : null
                                    }
                                    <div className="status-count">
                                        <div className="yet-to-scan">
                                            <span className="count-label">Yet to Scan</span>
                                            <span className="count-value">
                                                {this.state.scan}
                                            </span>
                                        </div>
                                        <div className="scanned">
                                            <span className="count-label">Scanned</span>
                                            <span className="count-value">
                                                {this.state.scanned}
                                            </span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="8">
                            <Card className="entry-health-check">
                                <Card.Title>
                                    <h5>Entry Health Check</h5>
                                    <span className="action-icons">
                                        {
                                            this.cardDate()
                                        }
                                    </span>
                                </Card.Title>
                                {
                                    this.state.employeListloader === true ? (
                                        <div className="loader">
                                            <Spinner animation="grow" variant="dark" />
                                        </div>
                                    ) : null
                                }
                                <Card.Body>
                                    <div>
                                        {
                                            this.state.empViewFlag == 'view' ? (
                                                <div className="col">
                                                    <p style={{ color: '#FF4C58', textAlign: 'center' }}>
                                                        Employee already scanned for today
                                                    </p>
                                                </div>
                                            ) : null
                                        }{
                                            this.state.plantErrorMsg == '' ? (
                                                <></>
                                            ) : (
                                                    <p style={{ color: '#FF4C58', textAlign: 'center' }}>
                                                        {this.state.plantErrorMsg}
                                                    </p>
                                                )
                                        }
                                    </div>
                                    <Form className={this.state.verifyFormClass} id="messageForm"
                                        name="messageForm" noValidate>
                                        <div className="row">
                                            <div className="col basic-field">
                                                <Form.Group controlId="empId">
                                                    <AsyncTypeahead
                                                        id="async-example"
                                                        labelKey="userCode"
                                                        onSearch={this.userCodeSearch}
                                                        options={this.state.options}
                                                        isLoading={isLoading}
                                                        placeholder="Employee ID"
                                                        ref="SubjectTypeahead"
                                                        emptyLabel="User not available"
                                                        onChange={this.selectAsyncTypeahead.bind(this)}                                                        
                                                        renderMenuItemChildren={(option, props) => (
                                                            <span>{option.userCode}</span>
                                                        )}                                                        
                                                    />                                                                                                    
                                                </Form.Group>
                                                {
                                                    this.state.selectEmpLoder == true ? (
                                                        <Fragment>
                                                            <div className="loader">
                                                                <Spinner animation="grow" variant="dark" />
                                                            </div>
                                                            <Form.Group controlId="name">
                                                                <Form.Control type="text" placeholder="Name"
                                                                    value={
                                                                        this.state.userDetailsFirstName ?
                                                                            (this.state.userDetailsFirstName + ' ' + this.state.userDetailsLastName) : ''
                                                                    } id="name" readOnly />
                                                            </Form.Group>
                                                            <Form.Group controlId="department">
                                                                <Form.Control type="text" id="department" placeholder="Department"
                                                                    value={this.state.userDetails.department} readOnly />
                                                            </Form.Group>
                                                        </Fragment>
                                                    ) : (
                                                            <Fragment>
                                                                <Form.Group controlId="name">
                                                                    <Form.Control type="text" placeholder="Name"
                                                                        value={
                                                                            this.state.userDetailsFirstName ?
                                                                                (this.state.userDetailsFirstName + ' ' + this.state.userDetailsLastName) : ''
                                                                        } id="name" readOnly />
                                                                </Form.Group>
                                                                <Form.Group controlId="department">
                                                                    <Form.Control type="text" id="department" placeholder="Department"
                                                                        value={this.state.userDetails.department} readOnly />
                                                                </Form.Group>
                                                            </Fragment>
                                                        )
                                                }
                                            </div>
                                            <div className="col verify-view">
                                                <div className="label">Employee ID</div>
                                                <div className="value">{selectUserCode}</div>
                                                <div className="label">Name</div>
                                                <div className="value">
                                                    {
                                                        this.state.userDetailsFirstName ?
                                                            (this.state.userDetailsFirstName + ' ' + this.state.userDetailsLastName) : ''
                                                    }
                                                </div>
                                                <div className="label">Department</div>
                                                <div className="value">
                                                    {
                                                        this.state.userDetails.department
                                                    }
                                                </div>
                                                <div className="label">Temperature</div>
                                                <div className="value temp" style={{ color: this.state.temperatureColor }}>{temperature}
                                                    {
                                                        this.state.temparatureType == 'F' ?
                                                            <span style={{ marginLeft: 5 }}>&#x2109;</span> :
                                                            <span style={{ marginLeft: 5 }}>&#8451;</span>
                                                    }
                                                </div>
                                                <div className="label">Oximeter Reading</div>
                                                <div className="value" 
                                                style={{ color: this.state.OximeterReading >= 90 && this.state.OximeterReading <= 120 ? '#418600' : '#FF4C58' }}>{this.state.OximeterReading} mm Hg</div>
                                            </div>
                                        </div>
                                        <Form.Group className={selectUserCode == '' ? 'temp-field temperature-form line-base preventmos' : 'temp-field temperature-form line-base'}

                                            controlId="temp">
                                            <Form.Control className="temperature-input" type="text" placeholder="Temperature Recorded?" name="temperature"
                                                value={temperature}
                                                onChange={this.temperatureChangeEvent.bind(this)}
                                                maxLength={4}
                                                style={{ color: this.state.temperatureColor }}
                                            />
                                            <Form.Control as="select" className="temperature-input-select" onChange={this.handleTypeChange.bind(this)}>
                                                <option key={"F"} value={"F"}> &#x2109;</option>
                                                <option key={"C"} value={"C"}> &#8451; </option>

                                            </Form.Control>
                                            {
                                                this.state.isErrorTemperature != '' ? (
                                                    <Form.Text className="error-msg">
                                                        {this.state.isErrorTemperature}
                                                    </Form.Text>
                                                ) : null
                                            }
                                            {
                                                this.state.belowtempflag == true ? (
                                                    <Form.Text className="error-msg">
                                                        {this.state.temparatureType == "F" ? "Normal body temperature lies between 97.7-99.5" : "Normal body temperature lies between 36.5-37.5"}
                                                    </Form.Text>
                                                ) : null
                                            }

                                        </Form.Group>
                                        <Form.Group className={selectUserCode == '' ? 'line-base preventmos' : 'line-base'}>
                                            <Form.Control controlId="temp" className="temp-field" type="text" placeholder="Oximeter Reading"
                                                name="OximeterReading" id="OximeterReading"
                                                onChange={this.OximeterReadingEvent.bind()}
                                                value={this.state.OximeterReading}
                                                maxLength={3}
                                                style={{ color: this.state.OximeterReading >= 90 && this.state.OximeterReading <= 120 ? '#418600' : '#FF4C58' }}
                                            />
                                            {
                                                this.state.OximeterReading == '' ? (
                                                    <Form.Text className="error-msg">
                                                        Please enter Oximeter Reading
                                                    </Form.Text>
                                                ) : (
                                                        (this.state.OximeterReading >= 90 && this.state.OximeterReading <= 120) ? (
                                                            <></>
                                                        ) : (
                                                                this.state.OximeterReading == null ? (
                                                                    <></>
                                                                ) : (
                                                                        this.state.verifyFormClass == 'survey-form verify' ? (
                                                                            <></>
                                                                        ) : (
                                                                                <Form.Text className="error-msg">
                                                                                    Normal human body oxygen level lies between 90 mm Hg to 120 mm Hg
                                                                                </Form.Text>
                                                                            )
                                                                    )
                                                            )
                                                    )
                                            }
                                        </Form.Group>
                                        <div className={selectUserCode == '' ?
                                            'survey-icon-container preventmos' : this.state.verifyFormClass == 'survey-form verify' ? 'survey-icon-container verify-content' : 'survey-icon-container'}>

                                            <div className={this.state.SymptomFeverEventColor}
                                                onClick={this.SymptomFeverEvent}
                                                style={{
                                                    display:
                                                        (this.state.verifyFormClass == 'survey-form verify' && this.state.SymptomFeverEventColor == 'survey-icons')
                                                            ? "none" : ''
                                                }}
                                            >
                                                <div className="check-img">
                                                    <img src={fever} />
                                                </div>
                                                <div className="check-text">Fever</div>
                                            </div>
                                            <div className={this.state.SymptomDryCoughEventColor}
                                                onClick={this.SymptomDryCoughEvent}
                                                style={{
                                                    display:
                                                        (this.state.verifyFormClass == 'survey-form verify' && this.state.SymptomDryCoughEventColor == 'survey-icons')
                                                            ? "none" : ''
                                                }}>
                                                <div className="check-img">
                                                    <img src={dryCough} />
                                                </div>
                                                <div className="check-text">Dry Cough</div>
                                            </div>
                                            <div className={this.state.SymptomAchesAndPainEventColor}
                                                onClick={this.SymptomAchesAndPainEvent}
                                                style={{
                                                    display:
                                                        (this.state.verifyFormClass == 'survey-form verify' && this.state.SymptomAchesAndPainEventColor == 'survey-icons')
                                                            ? "none" : ''
                                                }}>
                                                <div className="check-img">
                                                    <img src={sneezing} />
                                                </div>
                                                <div className="check-text">Aches & Pain</div>
                                            </div>
                                            <div className={this.state.SymptomShortofBreathEventColor}
                                                onClick={this.SymptomShortofBreathEvent}
                                                style={{ display: this.state.verifyFormClass == 'survey-form verify' && this.state.SymptomShortofBreathEventColor == 'survey-icons' ? 'none' : '' }}>
                                                <div className="check-img">
                                                    <img src={shortBreath} />
                                                </div>
                                                <div className="check-text">Short of Breath</div>
                                            </div>
                                            <div className={this.state.SenceofsmallColor} onClick={this.SenceofsmallEvent}
                                            style={{ display: this.state.verifyFormClass == 'survey-form verify' && this.state.SenceofsmallColor == 'survey-icons' ? 'none' : '' }}>
                                                <div className="check-img">
                                                    <img src={smell} alt="Sence of Smell" ></img>
                                                </div>
                                                <div className="check-text">Sense of Smell</div>
                                            </div>
                                        </div>
                                        {
                                            temparatureF == '' ? (
                                                <Form.Group className="radio-group" style={{ cursor: 'not-allowed !important', pointerEvents: 'none' }}>
                                                    <ToggleButtonGroup type="radio" name="ppegiven" defaultValue={[0]} >
                                                        <div className="mr-3 radio-message radio-message">Has PPE been given to the employee?</div>
                                                        <ToggleButton id="yesid" className={this.state.varifyClass} value={1}>Yes</ToggleButton>
                                                        <ToggleButton id="noid" value={2}>No</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Form.Group>
                                            ) : (
                                                    ((temparatureF > 99.5) || (this.state.SymptomFeverEventColor != 'survey-icons' || this.state.SymptomDryCoughEventColor != 'survey-icons'                                                    
                                                    || this.state.SymptomAchesAndPainEventColor != 'survey-icons' || this.state.SymptomShortofBreathEventColor != 'survey-icons' || this.state.SenceofsmallColor != 'survey-icons')) ? (
                                                        <Form.Group className="radio-group"
                                                            style={{
                                                                cursor: 'not-allowed !important', pointerEvents: 'none', opacity: '0.3',
                                                                visibility: this.state.verifyFormClass == 'survey-form verify' ? 'hidden' : 'visible'
                                                            }}>
                                                            <ToggleButtonGroup type="radio" name="ppegiven" defaultValue={[]}>
                                                                <div className="mr-3 radio-message radio-message">Has PPE been given to the employee?</div>
                                                                <ToggleButton id="yesid" className={this.state.varifyClass} value={1}>Yes</ToggleButton>
                                                                <ToggleButton id="noid" value={2}>No</ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </Form.Group>
                                                    ) : (
                                                            <Form.Group className="radio-group">
                                                                <ToggleButtonGroup type="radio" name="ppegiven" value={this.state.ppeValue}
                                                                    onChange={this.ppeEvent.bind(this)}>
                                                                    <div className="mr-3 radio-message radio-message">Has PPE been given to the employee?</div>
                                                                    <ToggleButton id="yesid" className={this.state.varifyClass} value={1}>Yes</ToggleButton>
                                                                    <ToggleButton id="noid" value={2}>No</ToggleButton>
                                                                </ToggleButtonGroup>
                                                                {
                                                                    // this.state.ppeErrorMsg == '' ? null : (
                                                                    //     <div style={{ marginLeft: 400 }} className="error-msg">{this.state.ppeErrorMsg}</div>
                                                                    // )
                                                                }
                                                            </Form.Group>
                                                        )
                                                )
                                        }
                                        {
                                            this.state.userDetailsFirstName == '' || temparatureF == '' ? (
                                                <Form.Group className="radio-group" style={{ cursor: 'not-allowed !important', pointerEvents: 'none' }}>
                                                    <ToggleButtonGroup type="radio" name="familytest">
                                                        <div className="mr-3 radio-message">Have any of your family members tested postive for COVID?</div>
                                                        <ToggleButton id="familytestyesid" className={this.state.varifyClass} value={1}>Yes</ToggleButton>
                                                        <ToggleButton id="familytestnoid" value={2}>No</ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Form.Group>
                                            ) : (
                                                    <Form.Group className="radio-group">
                                                        <ToggleButtonGroup type="radio" name="familytest" value={this.state.familytest}
                                                            onChange={this.familytestEvent.bind(this)}>
                                                            <div className="mr-3 radio-message">Have any of your family members tested postive for COVID?</div>
                                                            <ToggleButton id="familytestyesid" className={this.state.varifyClass} value={1}>Yes</ToggleButton>
                                                            <ToggleButton id="familytestnoid" value={2}>No</ToggleButton>
                                                        </ToggleButtonGroup>
                                                        {
                                                            this.state.familytestErrorMsg == '' ? null : (
                                                                <div style={{ marginLeft: 375 }} className="error-msg">{this.state.familytestErrorMsg}</div>
                                                            )
                                                        }
                                                    </Form.Group>
                                                )
                                        }
                                        <Form.Group className="mb-0 mt-4 warning-onsite-msg">
                                            {
                                                this.state.userDetailsFirstName == '' || temparatureF == '' ? (
                                                    <div className={this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                    this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                    this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? 'notes error' : 'notes'}>
                                                        {
                                                            this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                            this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                            this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active'? (
                                                                <p>
                                                                    The employee is symptomatic, Kindly send him or her to home.
                                                                </p>
                                                            ) : (
                                                                    <p>
                                                                        Please remind the employee to wash their hands before entering the premises.
                                                                    </p>
                                                                )
                                                        }
                                                    </div>
                                                ) : (
                                                        temparatureF > 99.5 || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                        this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                        this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? (
                                                            this.state.familytest ? (
                                                                this.state.verifyFormClass == 'survey-form verify' ? (
                                                                    <div className={this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? 'notes error' : 'notes'}>
                                                                        {
                                                                            this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active'
                                                                             ? (
                                                                                <p>
                                                                                    The employee is symptomatic, Kindly send him or her to home.
                                                                                </p>
                                                                            ) : (
                                                                                    <p>
                                                                                        Please remind the employee to wash their hands before entering the premises.
                                                                                    </p>
                                                                                )
                                                                        }
                                                                    </div>
                                                                ) : null
                                                            ) : (
                                                                    <div className={this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? 'notes error' : 'notes'}>
                                                                        {
                                                                            this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? (
                                                                                <p>
                                                                                    The employee is symptomatic, Kindly send him or her to home.
                                                                                </p>
                                                                            ) : (
                                                                                    <p>
                                                                                        Please remind the employee to wash their hands before entering the premises.
                                                                                    </p>
                                                                                )
                                                                        }
                                                                    </div>
                                                                )
                                                        ) : (
                                                                this.state.familytest == null || this.state.ppeValue == null || this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active'? (
                                                                    <div className={this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                    this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? 'notes error' : 'notes'}>
                                                                        {
                                                                            this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active'? (
                                                                                <p>
                                                                                    The employee is symptomatic, Kindly send him or her to home.
                                                                                </p>
                                                                            ) : (
                                                                                    <p>
                                                                                        Please remind the employee to wash their hands before entering the premises.
                                                                                    </p>
                                                                                )
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                        this.state.verifyFormClass == 'survey-form verify' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                        this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                        this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? (
                                                                            <div className={this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                            this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active' ? 'notes error' : 'notes'}>
                                                                                {
                                                                                    this.state.temperatureColor == '#FF4C58' || this.state.SymptomFeverEventColor == 'survey-icons active' ||
                                                                                    this.state.SymptomDryCoughEventColor == 'survey-icons active' || this.state.SymptomAchesAndPainEventColor == 'survey-icons active' ||
                                                                                    this.state.SymptomShortofBreathEventColor == 'survey-icons active' || this.state.SenceofsmallColor == 'survey-icons active'? (
                                                                                        <p>
                                                                                            The employee is symptomatic, Kindly send him or her to home.
                                                                                        </p>
                                                                                    ) : (
                                                                                            <p>
                                                                                                Please remind the employee to wash their hands before entering the premises.
                                                                                            </p>
                                                                                        )
                                                                                }
                                                                            </div>
                                                                        ) : null
                                                                    )
                                                            )
                                                    )
                                            }

                                        </Form.Group>
                                        <Form.Group className="text-center submit-btn mb-0">
                                            {
                                                this.state.userDetailsFirstName == '' || temparatureF == '' || this.state.OximeterReading == '' ? (
                                                    <></>
                                                ) : (
                                                        this.state.belowtempflag == true ? (
                                                            <></>
                                                        ) : (
                                                                temparatureF > 99.5 ? (
                                                                    this.state.familytest ? (
                                                                        (this.state.OximeterReading == '' || this.state.OximeterReading == null) ? (
                                                                            <></>
                                                                        ) : (
                                                                                <Button variant="outline-primary" type="submit"
                                                                                    onClick={this.submintEntryHealthCheck}>Verify</Button>
                                                                            )
                                                                    ) : (
                                                                            <></>
                                                                        )
                                                                ) : (
                                                                        this.state.familytest == null ? (
                                                                            <></>
                                                                        ) : (
                                                                                (this.state.OximeterReading == '' || this.state.OximeterReading == null) ? (
                                                                                    <></>
                                                                                ) : (
                                                                                        ((this.state.ppeValue != null) || (this.state.SymptomFeverEventColor != 'survey-icons' ||
                                                                                        this.state.SymptomDryCoughEventColor != 'survey-icons' ||
                                                                                        this.state.SymptomAchesAndPainEventColor != 'survey-icons' ||
                                                                                        this.state.SymptomShortofBreathEventColor != 'survey-icons' ||
                                                                                        this.state.SenceofsmallColor !='survey-icons')) ? (
                                                                                            <Button variant="outline-primary" type="submit"
                                                                                            onClick={this.submintEntryHealthCheck}>Verify</Button>
                                                                                        ):(
                                                                                            <></>
                                                                                        )
                                                                                    )
                                                                            )
                                                                    )
                                                            )
                                                    )
                                            }
                                        </Form.Group>
                                        <Form.Group className="verify-btn text-center mb-0">
                                            <Button variant="outline-primary" type="button" onClick={this.editEntryHealthCheck}>Edit</Button>
                                            <Button variant="primary" type="button" onClick={this.verifyedEntryHealthCheck}>Submit</Button>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        );
    }
}


export default OnSiteSurvey;
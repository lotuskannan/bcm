import React, { Component, Fragment } from 'react';
import { Row, Col, Card, ProgressBar, Button, Modal, Table, Form, Spinner, Alert } from 'react-bootstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import 'react-circular-progressbar/dist/styles.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import ModelCaseHistory from './ModelCaseHistory';
import * as EmployeeHealthService from './EmployeeHealthService';
import './temp.css';
import sharingService from '../../Service/DataSharingService';
class EmployeeHealth extends Component {
   constructor(props) {
      super(props);
      this.state = {
         Data: [],
         modalShow: false,
         empHealthStatusList: [],
         statuscode: '',
         filterEmpList: [],
         covidConfirmedCount: '',
         covidSuspectedCount: '',
         covidStayAtHomeCount: '',
         covidRecoveredCount: '',
         covidOnSiteCount: '',
         covidOnLeaveCount: '',
         empDirectoryCount: '',
         empDirectoryList: [],
         empDirectoryfilterList: [],
         empConfirmedList: [],
         empConfirmedfilterList: [],
         empSuspectedList: [],
         empSuspectedConfirmedList: [],
         empStayAtHomeList: [],
         empStayAtHomeConfirmedList: [],
         empRecoveredList: [],
         empRecoveredConfirmedList: [],
         empOnSiteList: [],
         empOnSiteConfirmedList: [],
         empOnLeaveList: [],
         empOnLeaveConfirmedList: [],
         currentActiveCategoryEmpList: [],
         selectedRowEmpData: [],
         carouselLoder: false,
         initContainerclass: 'covidConfirmed',
         expendEmpDirectoryViewflagClass: '',
         expendConfirmedViewflagClass: '',
         expendSuspectedViewflagClass: '',
         expendStayatHomeViewflagClass: '',
         expendRecoveredViewflagClass: '',
         expendOnsiteViewflagClass: '',
         expendOnleaveViewflagClass: '',
         selectOptionColorName: 'choose-directory',
         newSelectOptionColorName: 'choose-directory',
         pageLoader: true,
         expendViewflagClass: '',
         showModal: false,
         temperature: '',
         temperatureType: 'F',
         oximeterReading: '',
         coughSymtomValue: false,
         achesPain: false,
         shortnessOfBreathValue: false,
         feverSymtomValue: false,
         oximeterCheckBox: false,
         senseOfSmell:false,
         employeeObject: '',
         isError: {
            temperature: '',
            oximeterReading: ''
         },
         message: '',
         showMessage: false,
         feverColor: '',
         sessionExpired: false
      };
      // this.onRowSelect = this.onRowSelect.bind(this);
   }
   componentDidMount() {
      var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
      this.setState({ plantId: plantId });
      this.subscription = sharingService.getMessage().subscribe(message => {
         if (message) {
            if (this.props.history.location.pathname == '/home/employeehealth') {
               var plantId = +message.text
               this.setState({ plantId: plantId });
               this.getEmployeList();
            }
         } else {
            // clear messages when empty message received
         }
      });
      this.getEmployeList();
   }
   initTable = (statuscode) => {
      if (statuscode == '0') {
         this.empDirectory();
         this.setState({ selectOptionColorName: 'choose-directory' });
      }
      if (statuscode == '1') {
         this.ConfirmedList();
         this.setState({ selectOptionColorName: 'choose-confirmed' });
      }
      if (statuscode == '2') {
         this.SuspectedList();
         this.setState({ selectOptionColorName: 'choose-suspected' });
      }
      if (statuscode == '3') {
         this.StayatHomeList();
         this.setState({ selectOptionColorName: 'choose-stayAtHome' });
      }
      if (statuscode == '4') {
         this.RecoveredList();
         this.setState({ selectOptionColorName: 'Choose-Recovered' });
      }
      if (statuscode == '5') {
         this.OnSiteList();
         this.setState({ selectOptionColorName: 'Choose-onSite' });
      }
      if (statuscode == '7') {
         this.workformhome();
         this.setState({ selectOptionColorName: 'Choose-onSite' });
      }
   }
   getEmployeList() {
      var Code = '';
      if (this.props.history.location.search.split('?statuscode=')[1]) {
         const statuscode = this.props.history.location.search.split('?statuscode=')[1];
         Code = statuscode;
      }
      else {
         Code = 0;
      }
      this.setState({
         statuscode: Code,
         pageLoader: true,
      }, () => {
         this.initTable(this.state.statuscode);
      });
   }

   changeContainerClass() {
      var code = this.state.statuscode;
      let className = '';
      if (code == '0') {
         className = 'employeeDirectory';
      }
      if (code == '1') {
         className = 'covidConfirmed';
      }
      if (code == '2') {
         className = 'suspected';
      }
      if (code == '3') {
         className = 'stayAtHome';
      }
      if (code == '4') {
         className = 'recovered';
      }
      if (code == '5') {
         className = 'onsite';
      }
      if (code == '7') {
         className = 'workFromHome';
      }
      return className;
   }
   statusFlag=(Status)=>{
      let res = '';
      if(Status == 'Confirmed'){
         res = 'COVID Confirmed';
      }else{

      }
   }
   empDirectory = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         let tempobj = [];
         if (response) {
            for(var i=0;i<response.data.length;i++){
               tempobj.push({
                  bcmUserId: response.data[i].bcmUserId,
                  contactTraced: response.data[i].contactTraced,
                  currentDaySubmitStatus: response.data[i].currentDaySubmitStatus,
                  department: response.data[i].department,
                  designation: response.data[i].designation,
                  employeeName: response.data[i].employeeName,
                  healthTrackerHeaderId: response.data[i].healthTrackerHeaderId,
                  isActive: response.data[i].isActive,
                  lastUpdatedCondition:response.data[i].lastUpdatedCondition,
                  lastUpdatedStatus: response.data[i].lastUpdatedStatus,
                  lastUpdatedStatusClone: response.data[i].lastUpdatedStatus,
                  presentDay: response.data[i].presentDay,
                  totalQuarantaineDays: response.data[i].totalQuarantaineDays
               });                  
            }
            this.setState({
               empDirectoryList: tempobj,
               empDirectoryfilterList: tempobj,
               empDirectoryCount: response.totalResults
            });
            if (this.state.statuscode == '0') {
               this.setState({ currentActiveCategoryEmpList: tempobj});
               this.setState({ pageLoader: false });
            }
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   ConfirmedList = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=1` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empConfirmedList: response.data,
               empConfirmedfilterList: response.data,
               covidConfirmedCount: response.totalResults
            });
            if (this.state.statuscode == '1') {
               this.setState({ currentActiveCategoryEmpList: response.data });
               this.setState({ pageLoader: false });
            }
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   SuspectedList = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=2` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empSuspectedList: response.data,
               empSuspectedConfirmedList: response.data,
               covidSuspectedCount: response.totalResults
            });
         }
         if (this.state.statuscode == '2') {
            this.setState({ currentActiveCategoryEmpList: response.data });
            this.setState({ pageLoader: false });
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   StayatHomeList = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=3` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empStayAtHomeList: response.data,
               empStayAtHomeConfirmedList: response.data,
               covidStayAtHomeCount: response.totalResults
            });
         }
         if (this.state.statuscode == '3') {
            this.setState({ currentActiveCategoryEmpList: response.data });
            this.setState({ pageLoader: false });
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   workformhome = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=6` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empStayAtHomeList: response.data,
               empStayAtHomeConfirmedList: response.data,
               covidStayAtHomeCount: response.totalResults
            });
         }
         if (this.state.statuscode == '7') {
            this.setState({ currentActiveCategoryEmpList: response.data });
            this.setState({ pageLoader: false });
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   RecoveredList = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=4` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empRecoveredList: response.data,
               empRecoveredConfirmedList: response.data,
               covidRecoveredCount: response.totalResults
            });
         }
         if (this.state.statuscode == '4') {
            this.setState({ currentActiveCategoryEmpList: response.data });
            this.setState({ pageLoader: false });
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   OnSiteList = () => {
      const { plantId } = this.state;
      var param = plantId != null && plantId != 0 ? '&clientPlantMasterId=' + plantId : '&clientPlantMasterId=0';
      const urlwithoutOrderBy = `start=${0}&limit=${1000}&healthStatusId=5` + param;
      EmployeeHealthService.empHealthDirectoryList(urlwithoutOrderBy).then(response => {
         if (response.data) {
            this.setState({
               empOnSiteList: response.data,
               empOnSiteConfirmedList: response.data,
               covidOnSiteCount: response.totalResults
            });
         }
         if (this.state.statuscode == '5') {
            this.setState({ currentActiveCategoryEmpList: response.data });
            this.setState({ pageLoader: false });
         }
      }).catch(error => {
         if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
            this.setState({ sessionExpired: true });
            setTimeout(() => {

               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ Loader: false });
            }, 3000);
         }
      });
   }
   setModalShow = (e) => {
      this.setState({ modalShow: true });
   }
   onHide = (e) => {
      this.setState({ modalShow: false });
   }
   changeHealthStatus = (e) => {
      this.setState({ statuscode: e.target.value });
      this.setState({ pageLoader: true });
      if (e.target.value == '0') {
         this.setState({ selectOptionColorName: 'choose-directory' });
         this.empDirectory();
      }
      if (e.target.value == '1') {
         this.setState({ selectOptionColorName: 'choose-confirmed' });
         this.ConfirmedList();
      }
      if (e.target.value == '2') {
         this.setState({ selectOptionColorName: 'choose-suspected' });
         this.SuspectedList();
      }
      if (e.target.value == '3') {
         this.setState({ selectOptionColorName: 'choose-stayAtHome' });
         this.StayatHomeList();
      }
      if (e.target.value == '4') {
         this.setState({ selectOptionColorName: 'Choose-Recovered' });
         this.RecoveredList();
      }
      if (e.target.value == '5') {
         this.setState({ selectOptionColorName: 'Choose-onSite' });
         this.OnSiteList();
      }
      if (e.target.value == '7') {
         this.setState({ selectOptionColorName: 'Choose-onSite' });
         this.workformhome();
      }
      this.changeContainerClass();
   }
   onClickRow = (e) => {
      if (e.lastUpdatedStatus === 'On Site') {
      } else {
         this.setState({ selectedRowEmpData: e, modalShow: true });
      }
   }
   onClickRowClone = (obj, event) => {
      if (obj.lastUpdatedStatus == 'On Site') {
      } else {
         this.setState({ selectedRowEmpData: obj, modalShow: true });
      }
   }
   expendView = () => {
      if (this.state.expendViewflagClass == '') {
         this.setState({ expendViewflagClass: 'active' });
      } else {
         this.setState({ expendViewflagClass: '' });
      }
   }
   setCardCategory = (Category) => {
      if (Category) {
         Category = Category.replace(/ /g, '');
      }
      return Category;
   }
   getSelectOptionClassName = (id) => {
      var clname = '';
      if (id == '0') {
         clname = 'newEmpdirtory';
      }
      if (id == '1') {
         clname = 'newconfom';
      }
      if (id == '2') {
         clname = 'newSuspected';
      }
      if (id == '3') {
         clname = 'newQuarantine';
      }
      if (id == '4') {
         clname = 'newrecoved';
      }
      if (id == '5') {
         clname = 'newonsite';
      }
      if (id == '7') {
         clname = 'newWorkfromhome';
      }
      return clname;
   }
   showSymtomModal(e) {
      this.setState({
         showModal: e
      });
      if (e == false) {
         this.resetForm();
      }
   }

   openAddSymptom = (row) => {
      this.showSymtomModal(true);
      this.setState({ employeeObject: row });
      // setTimeout(() => {
      //    var fever = document.getElementById('fever');
      //    fever.disabled = true;
      // }, 500);
   }

   onChangeTempValue = (e) => {
      var temperature = e.target.value;
      this.setState({ temperature: temperature, belowtempflag: false });
      if (this.state.temperatureType == "C") {
         temperature = temperature * 9 / 5 + 32;
         this.setState({
            feverSymtomValue: temperature > 37.5 ? true : false,
            feverColor: temperature > 37.5 ? 'error-color' : 'green-text-color'
         });
      }
      if (temperature <= 99.5) {
         var fever = document.getElementById('fever');
         fever.checked = false;
         fever.disabled = true;

      } else {
         var fever = document.getElementById('fever');
         fever.disabled = false;
      }
      this.setState({
         feverSymtomValue: temperature > 99.5 ? true : false,
         feverColor: temperature > 99.5 ? 'error-color' : 'green-text-color'
      });
      this.onChangeFormValue(e);
   }

   handleTypeChange = (e) => {

      var temperature = this.state.temperature;
      var selectedType = e.target.value;
      if (temperature != "") {

         if (selectedType != this.state.temperatureType) {
            temperature = +temperature
            if (this.state.temperatureType == "F") {
               temperature = (temperature - 32) * 5 / 9;
            }
            else {
               temperature = (temperature * 9) / 5 + 32;
            }
            temperature = Math.round(temperature * 10) / 10
         }

      }

      this.setState({ temperatureType: e.target.value, temperature: temperature });
   }


   submitSymptom = (e) => {
      e.preventDefault();

      console.log(this.validForm());
      if (this.validForm()) {
         var temperature = +this.state.temperature;
         if (this.state.temperatureType == "C") {
            temperature = temperature * 9 / 5 + 32;
         }
         temperature = Math.round(temperature * 10) / 10;

         var payload = {
            "bcmUserHealthTrackLineId": 0,
            "bcmUserId": this.state.employeeObject.bcmUserId,
            "bodyAcheAndPainSymptomValue": this.state.achesPain,
            "contactTraced": false,
            "coughSymptomValue": this.state.coughSymtomValue,
            "covidTestPositive": false,
            "employeeHealthSurveyDataId": 0,
            "familyCovidTest": false,
            "familyCovidTestResult": '0',
            "feverRecord": temperature,
            "feverSymptomValue": this.state.feverSymtomValue,
            "leftHomeInLast12Hours": false,
            "shortnessOfBreathSymptomValue": this.state.shortnessOfBreathValue,// 2nd slide 3 rd value
            "socialDistancingValue": false,
            "stayingAtHome": false,
            "submittedBy": JSON.parse(sessionStorage.LoginUserObject).bcmUserId,
            "washHandsFrequently": false,
            "wearingMask": false,
            "oximeterReading": this.state.oximeterCheckBox ? this.state.oximeterReading : '',
            "senseOfSmell":this.state.senseOfSmell
         }
         console.log(payload);

         this.setState({ modalLoader: true });
         EmployeeHealthService.submitDailySurvey(payload).then(Response => {
            this.setState({ modalLoader: false });
            if (Response.status.success == 'SUCCESS') {
               this.getEmployeList();
               var message = `${this.state.employeeObject.employeeName} employee records got updated successfully with the symptoms.`;
               this.resetForm();
               this.showNotification(message);
            }
         }).catch(error => {
            if (error.message == "Request failed with status code 401" || error.message == "Network Error") {
               this.setState({ sessionExpired: true });
               setTimeout(() => {

                  sessionStorage.clear();
                  this.props.history.push("login");
                  this.setState({ Loader: false });
               }, 3000);
            }
         });

      } else {
         let isError = { ...this.state.isError };
         isError.temperature = this.temperatureValidator(this.state.temperature);
         isError.oximeterReading = this.state.oximeterCheckBox ? this.oximeterReadingValidator(this.state.oximeterReading) : '';
         this.setState({ isError: isError });
      }

   }
   onChangeFormValue = (e) => {
      const { value, name } = e.target;
      let isError = { ...this.state.isError };
      switch (name) {
         case "oximeterReading":
            isError.oximeterReading = this.oximeterReadingValidator(value)
            break;
         case "temperature":
            isError.temperature = this.temperatureValidator(value)
            break;
         default:
            break;
      }
      this.setState({
         isError,
         [name]: value
      });
   }

   validForm = () => {
      var valid;
      if (this.temperatureValidator(this.state.temperature) == ''
         && (this.state.oximeterCheckBox == true ? this.oximeterReadingValidator(this.state.oximeterReading) == '' : true)) {
         valid = true
      } else {
         valid = false;
      }
      return valid;
   }
   temperatureValidator = (Param) => {
      var returnMsg = '';
      if (Param.length == 0) {
         returnMsg = 'Please enter temperature value';
      } else if (this.state.temperatureType == 'C' ? Param < 36.5 : Param < 97.7) {
         returnMsg = 'Please enter temperature value';
      } else {
         returnMsg = '';
      }
      return returnMsg;
   }
   oximeterReadingValidator = (Param) => {
      var returnMsg = '';
      var num = +Param;
      if (Param.length == 0) {
         returnMsg = 'Please enter oximeter reading';
      } else if (typeof num != 'number') {
         returnMsg = 'please enter valid Reading';
      }
      else if (Param < 90) {
         // || Param > 120
         returnMsg = 'Normal human body oxygen level lies between 90 mm Hg to 120 mm Hg';
      } else {
         returnMsg = ''
      }
      return returnMsg;
   }
   getUserDetails = (userId) => {
      this.setState({ modalLoader: true });
      EmployeeHealthService.getUserDetails(userId).then(response => {
         this.setState({ modalLoader: false });
         if (response.status.success == 'Success') {
            this.setState({ employeeObject: response.data });
         }
      });
   }

   resetForm = () => {
      this.setState({
         showModal: false,
         temperature: '',
         temperatureType: 'F',
         oximeterReading: '',
         coughSymtomValue: false,
         achesPain: false,
         shortnessOfBreathValue: false,
         feverSymtomValue: false,
         oximeterCheckBox: false,
         senseOfSmell:false,
         employeeObject: '',
         isError: {
            temperature: '',
            oximeterReading: ''
         }
      })
   }

   showNotification(message) {
      if (message) {
         this.setState({
            message: message,
            showMessage: true
         });
         setTimeout(() => {
            this.setState({
               message: '',
               showMessage: false
            });
         }, 4000);
      }
   }
   onCheckOximeter = (oximeterCheckBox) => {

      if (oximeterCheckBox == false) {
         let isError = { ...this.state.isError };
         isError.oximeterReading = this.oximeterReadingValidator(this.state.oximeterReading);
         this.setState({ isError: isError, oximeterCheckBox: !oximeterCheckBox });
      } else {
         let isError = { ...this.state.isError };
         isError.oximeterReading = '';
         this.setState({ isError: isError, oximeterCheckBox: !oximeterCheckBox, oximeterReading: '' });
      }
   }

   render() {
      const { showModal, temperature, temperatureType, isError, feverSymtomValue, modalLoader,
         oximeterReading, coughSymtomValue, achesPain, shortnessOfBreathValue,senseOfSmell,
         showMessage, message, oximeterCheckBox, feverColor } = this.state;
      const { SearchBar } = Search;
      const responsive = {
         desktop: {
            breakpoint: { max: 3000, min: 1280 },
            items: 4,
            // partialVisibilityGutter: 20, // this is needed to tell the amount of px that should be visible.
            slidesToSlide: 1
         },
         tablet: {
            breakpoint: { max: 1280, min: 768 },
            items: 3,

            slidesToSlide: 2
         },
         mobile: {
            breakpoint: { max: 767, min: 0 },
            items: 1,
            slidesToSlide: 1
         }
      };
      const commonColums = [
         {
            dataField: 'employeeName',
            text: 'Name',
            sort: true,
            formatter: (row, cell) =>
               <div onClick={() => this.onClickRow(cell)}>
                  <span className="td-employee-name" data-title={cell.employeeName}>{cell.employeeName}</span>
               </div>
         },
         {
            dataField: 'department',
            text: 'Department',
            sort: true,
            formatter: (row, cell) =>
               <div onClick={() => this.onClickRow(cell)}>
                  <span className="td-department" title={cell.department}>{cell.department}</span>
               </div>
         },
         {
            dataField: 'designation',
            text: 'Designation',
            sort: true,
            formatter: (row, cell) =>
               <div onClick={() => this.onClickRow(cell)}>
                  <span className="td-designation" title={cell.designation}>{cell.designation}</span>
               </div>
         },
         {
            dataField: 'totalQuarantaineDays',
            text: 'totalQuarantaineDays',
            hidden: true
         },
         {
            dataField: 'presentDay',
            text: 'Daily Self Survey',
            formatter: (row, cell) => (
               <div>
                  {
                     cell.lastUpdatedStatus == 'On Site' || cell.lastUpdatedStatus == 'Work From Home' ? (
                        <span onClick={() => this.onClickRow(cell)} className="not-applicable">
                           {
                              cell.lastUpdatedStatus == 'On Site' ? 'Not applicable' : 'Applicable'
                           }
                        </span>
                     ) : (
                           <span onClick={() => this.onClickRow(cell)} className={'dailySelfSurveySpan ' + (cell.currentDaySubmitStatus == '0' ? 'error' : '')}>
                              {row > 9 ? row : '0' + row}
                              <span className="dailySelfSurveyInnerSpan">/{cell.totalQuarantaineDays}</span>
                           </span>
                        )
                  }
               </div>
            )
         },
         {
            dataField: 'lastUpdatedStatus',
            text: 'Status',
            sort: true,
            formatter: (row, cell) => (
               <div className="dailyStatusOption">
                  <span className={this.setCardCategory(cell.lastUpdatedStatus)} onClick={() => this.onClickRow(cell)}>
                     {
                        cell.lastUpdatedStatus == 'Confirmed' ? (
                           <span>COVID Confirmed </span>
                        ) :
                           (cell.lastUpdatedStatus == 'Stay at Home') ? (
                              <span style={{ color: '#E36600', cursor: 'pointer' }}>Quarantine</span>
                           ) : (
                                 cell.lastUpdatedStatus == 'On Site' ?
                                    <span style={{ color: '#4ABF21', cursor: 'pointer' }} title="Work From Office">WFO</span>
                                    :  (cell.lastUpdatedStatus == 'Work From Home') ? 
                                    <span title="Work From Home">WFH</span> : <span>{row}</span>
                              )
                     }
                  </span>
               </div>
            ),            
            style: function callback(cell) {
               return { color: '#4ABF21', cursor: 'pointer' };
            }
         },
         {
            dataField: 'currentDaySubmitStatus',
            text: 'Survey Status',
            formatter: (row, cell) => (
               <span>
                  {(cell.lastUpdatedStatus == 'Suspected' ||
                     cell.lastUpdatedStatus == 'Stay at Home' ||
                     cell.lastUpdatedStatus == 'Confirmed' || cell.lastUpdatedStatus == 'Work From Home') ? (cell.currentDaySubmitStatus == '0' &&
                        (cell.lastUpdatedStatus == 'Suspected' ||
                           cell.lastUpdatedStatus == 'Stay at Home' ||
                           cell.lastUpdatedStatus == 'Confirmed' || cell.lastUpdatedStatus == 'Work From Home') ?
                        'Not Submitted' : 'Submitted') : '--'}
             {/* <span className="addSymptomBtn" onClick={() => this.openAddSymptom(cell)}>Add Symptom</span> */}
               </span>
            )
         },
      ];
      const onsiteColums = [
         {
            dataField: 'employeeName',
            text: 'Name',
            sort: true,
            formatter: (row, cell) =>
               <div >
                  <span className="td-employee-name" data-title={cell.employeeName}>{cell.employeeName}</span>
               </div>
         },
         {
            dataField: 'department',
            text: 'Department',
            sort: true,
            formatter: (row, cell) =>
               <div>
                  <span className="td-department" title={cell.department}>{cell.department}</span>
               </div>
         },
         {
            dataField: 'designation',
            text: 'Designation',
            sort: true,
            formatter: (row, cell) =>
               <div>
                  <span className="td-designation" title={cell.designation}>{cell.designation}</span>
               </div>
         },
         {
            dataField: 'presentDay',
            text: 'Daily Self Survey',
            formatter: (row, cell) => (
               <div>
                  {cell.lastUpdatedStatus == 'On Site' ? <span>Not Applicable</span> : <span>Applicable</span>}
               </div>
            )
         },
         {
            dataField: 'lastUpdatedStatus',
            text: 'Status',
            sort: true,
            formatter: (row, cell) => (
               <div>
                  {
                     this.state.statuscode == '5' ?
                        <span style={{ color: '#4ABF21', cursor: 'pointer' }} title="Work From Office">WFO</span> :
                        <span style={{ color: '#BE83FF', cursor: 'pointer' }} title="Work from Home">WFH</span>
                  }
               </div>
            )
         },
         {
            dataField: 'currentDaySubmitStatus',
            text: 'Survey Status',
            formatter: (row, cell) => (
               <div>
                  <span>
                     {(cell.lastUpdatedStatus == 'Work From Home') ? (cell.currentDaySubmitStatus == '0' &&
                        cell.lastUpdatedStatus == 'Work From Home') ? 'Not Submitted' : 'Submitted' : '--'}
                  </span>
               </div>
            )
         },
      ];
      return (
         <Fragment>
            <div className="dashboard-container employee-health">
               <div className={'dashboard-section ' + this.changeContainerClass()}>
                  {
                     this.state.modalShow ? (
                        <ModelCaseHistory onHide={this.onHide} empData={this.state.selectedRowEmpData} modalShow={this.state.modalShow} />
                     ) : null
                  }
                  {showMessage ? <Alert variant="dark" className="mark">
                     <div className="alert-container">
                        <p><i className="icons"></i> {message}</p>
                     </div>
                  </Alert> : null}
                  <Alert show={this.state.sessionExpired} variant="danger">
                     <div className="alert-container">
                        <p><i className="icons"></i> Session Expired,Please login again.</p>
                     </div>
                  </Alert>
                  {
                     this.state.pageLoader ? (
                        <div className="loader">
                           <Spinner animation="grow" variant="dark">
                           </Spinner>
                        </div>
                     ) : null
                  }
                  <div className="welcome-text">
                     <div className="employee-header">
                        <h2>Employee Health</h2>
                        {
                           // <div className="employee-option Choose-onSite">
                           // <Form.Group controlId="exampleForm.ControlSelect1" className="employee-option-form">
                        }
                        <div>
                           <Form.Group className="custom-emp-select">
                              <Form.Control as="select" onChange={(e) => this.changeHealthStatus(e)}
                                 value={this.state.statuscode}
                                 className={this.getSelectOptionClassName(this.state.statuscode)}>
                                 <option className="newEmpdirtory" value={0} style={{ color: '#04A18C !important' }}>Employee Directory</option>
                                 <option className="newconfom" value={1} style={{ color: '#C90000 !important' }}>COVID Confirmed</option>
                                 <option className="newSuspected" value={2} style={{ color: '#FF0000 !important' }}>Suspected</option>
                                 <option className="newQuarantine" value={3} style={{ color: '#FF8000 !important' }}>Quarantine</option>
                                 <option className="newrecoved" value={4} style={{ color: '#2d5d00 !important' }}>Recovered</option>
                                 <option className="newonsite" value={5} style={{ color: '#222222 !important' }}>WFO (Work From Office)</option>
                                 <option className="newWorkfromhome" value={7} style={{ color: '#BE83FF !important' }}>WFH (Work From Home)</option>
                              </Form.Control>
                           </Form.Group>
                        </div>
                     </div>
                  </div>

                  <Row className="userCard">
                     <Col xl="12 h-100 pb-0" className={'arrowHide' + this.state.expendViewflagClass}>
                        <Fragment>
                           {
                              this.state.currentActiveCategoryEmpList.length == 0 ? (
                                 <div className="d-flex align-items-center justify-content-center dataNotFound">No Records Found</div>
                              ) : (
                                    <Carousel partialVisible={true} responsive={responsive}
                                       keyBoardControl={false}
                                       itemclassName="carousel-item-padding-40-px">
                                       {this.state.currentActiveCategoryEmpList.map((emp, index) =>
                                          <div className="item" key={index}>
                                             <Card className={this.setCardCategory(emp.lastUpdatedStatus)} onClick={this.onClickRowClone.bind(this, emp)}>
                                                <Card.Body>
                                                   <Row className="scrollHeader">
                                                      <Col xl="12" className="userDetails text-center">
                                                         <h5 className="name">{emp.employeeName}</h5>
                                                         <h5 className="dept">{emp.department}</h5>
                                                         <h6 className="desination">{emp.designation}</h6>
                                                      </Col>
                                                   </Row>
                                                   <div className="scrollBody">
                                                      <div className="suspected-btn">
                                                         <h6 title={
                                                               this.state.statuscode == '7' ? 'Work From Home':
                                                               emp.lastUpdatedStatus == 'Work From Home' ? 'Work From Home' :
                                                               emp.lastUpdatedStatus == 'On Site' ? 'Work From Office':''
                                                            }>
                                                            {
                                                               emp.lastUpdatedStatus ? 
                                                               this.state.statuscode == '7' ? 'WFH' :
                                                               emp.lastUpdatedStatus == 'Confirmed' ? 'COVID Confirmed' : 
                                                               emp.lastUpdatedStatus == 'Stay at Home' ? 'QUARANTINE' :
                                                               emp.lastUpdatedStatus == 'On Site' ? 'WFO' : 
                                                               emp.lastUpdatedStatus == 'Work From Home' ? 'WFH' : 
                                                               emp.lastUpdatedStatus.toUpperCase():<></>
                                                            }
                                                         </h6>
                                                      </div>
                                                      <div className="emp-tableContainer">
                                                         <Table striped bordered hover className="emp-table">
                                                            <tbody>
                                                               <tr>
                                                                  <td>Health Condition</td>
                                                                  <td>
                                                                     <div className={
                                                                        emp.lastUpdatedCondition == 'Improving' || emp.lastUpdatedCondition == 'Normal' ? 'result green-text-color ' :
                                                                           emp.lastUpdatedCondition == 'Worsening' ? 'result error' : ''
                                                                     }
                                                                     >{emp.lastUpdatedCondition}</div>
                                                                  </td>
                                                               </tr>
                                                            </tbody>
                                                         </Table>
                                                      </div>
                                                   </div>
                                                </Card.Body>
                                             </Card>
                                          </div>)}
                                    </Carousel>
                                 )
                           }
                        </Fragment>
                     </Col>
                  </Row>
                  <Row className={'row-height userCardBottom ' + this.state.expendViewflagClass}>

                     <Col xl="12 h-100 bottomCardScroll pl-0 pb-0">
                        {
                           this.state.statuscode == '0' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>Employee Directory  - <span className="chartValue">{this.state.empDirectoryCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>

                                    <ToolkitProvider keyField="id" data={this.state.empDirectoryList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }
                        {
                           this.state.statuscode == '1' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>COVID Confirmed  - <span className="chartValue">{this.state.covidConfirmedCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>

                                    <ToolkitProvider keyField="id" data={this.state.empConfirmedList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '2' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>Suspected - <span className="chartValue">{this.state.covidSuspectedCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empSuspectedList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '3' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>Quarantine  - <span className="chartValue">{this.state.covidStayAtHomeCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empStayAtHomeList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '4' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>Recovered  - <span className="chartValue">{this.state.covidRecoveredCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empRecoveredList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '5' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5 title="Work From Office">WFO  - <span className="chartValue">{this.state.covidOnSiteCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empOnSiteList}
                                       columns={onsiteColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"
                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '6' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5>On Leave  - <span className="chartValue">{this.state.covidOnLeaveCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empOnLeaveList}
                                       columns={commonColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"

                                                   {...props.baseProps}
                                                />
                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                        {
                           this.state.statuscode == '7' ?
                              (
                                 <div className="tableList" >
                                    <div className="accordion__item ">
                                       <div className="accordion__button">
                                          <div className="accordionHeader">
                                             <h5 title="Work From Home">WFH  - <span className="chartValue">{this.state.covidStayAtHomeCount}</span></h5>
                                          </div>
                                          <div className="accordionProgress"></div>
                                       </div>
                                    </div>
                                    <ToolkitProvider keyField="id" data={this.state.empStayAtHomeList}
                                       columns={onsiteColums} search>
                                       {
                                          props => (
                                             <div className="accordionTable">
                                                <div className="filterSearch ml-auto">
                                                   <div className="filter">
                                                      <div className="mb-0 filterSearchForm-control">
                                                         <form className="serach-form">
                                                            <SearchBar {...props.searchProps} />
                                                            <span className="search-icon"></span>
                                                         </form>
                                                      </div>
                                                      <div className="mb-0 expand">
                                                         <i className={'icon-expand expandIcon ' + this.state.expendViewflagClass}
                                                            onClick={this.expendView}></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <BootstrapTable bordered={false} noDataIndication="No Records Found"
                                                   {...props.baseProps} rowEvents={{ onClick: (e, row) => this.onClickRow(row) }}
                                                />

                                             </div>
                                          )
                                       }
                                    </ToolkitProvider>
                                 </div>
                              ) : null
                        }

                     </Col>
                  </Row>
               </div>
            </div>

            <Modal id="symptomsModal"
               show={showModal}
               onHide={() => this.showSymtomModal(false)}
               size="md"
               aria-labelledby="contained-modal-title-vcenter"
               centered
            >
               <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                     Add Symptom
                  </Modal.Title>

               </Modal.Header>
               <Modal.Body>
                  {modalLoader &&
                     <div className="loader">
                        <Spinner animation="grow" variant="dark">
                        </Spinner>
                     </div>
                  }
                  <Form noValidate>
                     <Row>
                        <Col xs={12} sm="12" xl="12" className="order-1 order-sm-1">
                           <Row className="align-items-center">
                              <Col xs={8} sm="12" md={8} xl="8" className="addPlantForm">
                                 <h6 className="symptoms-title">Symptoms</h6>
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" id="fever" checked={feverSymtomValue} onChange={e => this.setState({ feverSymtomValue: !feverSymtomValue })} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Fever</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={4} sm="12" md={4} xl="4 pl-0" className="addPlantForm">
                                 <h6 className="symptoms-title">Temperature</h6>
                                 <Form.Group className="temperature-form-health">
                                    <Form.Control className={"temperature-input " + feverColor} type="text" maxLength={4} value={temperature} name="temperature" onChange={this.onChangeTempValue.bind(this)} placeholder="0 &#x2109;" />
                                    <Form.Control as="select" className="temperature-input-select" name="temperatureType" value={temperatureType} onChange={this.handleTypeChange.bind(this)}>
                                       <option key={"F"} value={"F"}> &#x2109;</option>
                                       <option key={"C"} value={"C"}> &#8451; </option>
                                    </Form.Control>
                                 </Form.Group>
                              </Col>
                              {isError.temperature && <Form.Text className="error-msg">
                                 {this.state.temperatureType == "F" ? "Normal body temperature lies between 97.7-99.5" : "Normal body temperature lies between 36.5-37.5"}
                              </Form.Text>}
                              <Col xs={12} sm="12" xl="12" className="addPlantForm">
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" checked={coughSymtomValue} onChange={e => this.setState({ coughSymtomValue: !coughSymtomValue })} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Cough</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={12} sm="12" xl="12" className="addPlantForm">
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" checked={achesPain} onChange={e => this.setState({ achesPain: !achesPain })} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Aches & Pain</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={12} sm="12" xl="12" className="addPlantForm">
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" checked={shortnessOfBreathValue} onChange={e => this.setState({ shortnessOfBreathValue: !shortnessOfBreathValue })} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Shortness of Breath</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={12} sm="12" xl="12" className="addPlantForm">
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" checked={senseOfSmell} onChange={e => this.setState({ senseOfSmell: !senseOfSmell })} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Sense of Smell</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={8} sm="12" md={8} xl="8" className="addPlantForm">
                                 <div className="checkbox-leave">
                                    <label className="container">
                                       <input type="checkbox" checked={oximeterCheckBox} onChange={e => this.onCheckOximeter(oximeterCheckBox)} />
                                       <span className="checkmark"></span>
                                       <span className="checkbox-text">Oximeter</span>
                                    </label>
                                 </div>
                              </Col>
                              <Col xs={4} sm="12" md={4} xl="4 pl-0" className="addPlantForm">

                                 <Form.Group className="temperature-input">
                                    <Form.Control type="text" name="oximeterReading" value={oximeterReading} onChange={this.onChangeFormValue} placeholder="0 %" />
                                 </Form.Group>
                              </Col>
                              {isError.oximeterReading && <Form.Text className="error-msg">
                                 {isError.oximeterReading}
                              </Form.Text>}
                           </Row>
                        </Col>

                        <Col xl="12 text-center mt-5" className="modal-btn order-4">
                           <Button className="mr-2" variant="secondary" size="sm" onClick={this.resetForm}>Cancel</Button>
                           <Button variant="secondary" className={this.validForm() == true ? "verify-btn" : ''} type="submit" size="sm" onClick={this.submitSymptom}>Submit</Button>
                        </Col>
                     </Row>
                  </Form>
               </Modal.Body>
            </Modal>


         </Fragment>
      );
   }
}
export default EmployeeHealth;
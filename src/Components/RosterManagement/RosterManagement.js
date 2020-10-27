import React, { Component, Fragment } from "react";
import {
    Table,
    Dropdown,
    Button,
    Form,
    Spinner,
    Alert,
} from "react-bootstrap";
import * as RosterManagementService from "./RosterManagementService";
import DatePicker from "react-datepicker";
import sharingService from "../../Service/DataSharingService";
import * as DataManagementService from "../DataManagement/DataManagementService";
import { RangeDatePicker } from "react-google-flight-datepicker";
import _ from "lodash";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Pagination from "react-js-pagination";

class RosterManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shifts: [],
            headerType: "assignShiftDisable",
            plantId: 0,
            showHeaderMsg: false,
            headerErrorMsg: "Select the branch here",
            departmentList: [],
            designationList: [],
            show: true,
            mode: "",
            shiftLines: [],
            empIdToggle: "empIdToggle",
            empNameToggle: "empNameToggle",
            designationToggle: "designationToggle",
            departmentToggle: "departmentToggle",
            branchToggle: "branchToggle",
            shiftToggle: "shiftToggle",
            sessionExpired: false,
            fromDate: null,
            toDate: null,
            dateClass:'active',
            fromDateToggle:"fromDateToggle",
            toDateToggle:"toDateToggle",
            individualStartDate:null,
            individualEndDate:null,
            individualShift:"",
            shiftId: '',
            startDate: '',
            endDate: '',
            statuscode:0,
            selectedDesignationValue:'',
            selectedDepartmentValue:'',
            totalItemsCount: 0,
            perpage: 10,
            activePage: 1,
            checkedDesigs:[],
            checkedDeparts:[],
            checkedShifts:[],
            selectedShiftValue:"",
            showDesignationFilter:false,
            showDepartmentFilter:false,
            showShiftFilter:false,
            shiftLoader:false,
            designationLoader:false,
            departmentLoader:false,
            showShiftSuccessMsg:false,
            fromShiftId:"",
            toshiftId:"",
            startDate1:"",
            toDate1:"",
            individualStartDateInvalid:false,
            individualEndDateInvalid:false,
            individualShiftInvalid:false,
            start:0,
            limit:10,
            errorMsg:""

        };
    }
    componentDidMount() {
        var plantId = +sessionStorage.getItem("plantId")
            ? sessionStorage.getItem("plantId")
            : 0;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m+1, 0);
        this.setState({ plantId ,fromDate:firstDay,toDate:lastDay},()=>{
            this.getAllSiftMasterData();
            this.getDesignationList();
            this.getDepartmentList();
            this.getShiftLines(true);
        });
        this.subscription = sharingService.getMessage().subscribe((message) => {
            if (message) {
                if (this.props.history.location.pathname == "/home/rostermanagement") {
                    var plantId = +message.text;
                    this.setState({ plantId });
                    this.setState({ showHeaderMsg: false });
                    this.getShiftLines(true);
                }
            }
        });
        this.dateEventListener();
      
    }
    onDateChange = (startDate, endDate) => {
        this.setState({
            fromDate: startDate ? startDate : "",
            toDate: endDate ? endDate : "",
            start:0,limit:10
        },()=>{
            // this.getShiftLines(false)
        });
        

        // const fromDate = this.formatDate(startDate ? startDate : "");
        // const toDate = this.formatDate(endDate ? endDate : "");
        // if (startDate != null || startDate != null) {
        //     var { isError } = this.state;
        //     isError.date = this.dateValidator(fromDate ? fromDate : toDate);
        //     this.setState({ isError, dateClass: "" });
        // }
    };

    dateEventListener = () => {
        var button = document.getElementsByClassName("submit-button");
       if(button[0]){
           button[0].addEventListener("click", ()=> {
            if (this.props.history.location.pathname == "/home/rostermanagement") {
                this.getShiftLines(false);
            }
          });
        }
    }

    sort = (order, propPath, type) => {
        console.log(order);
        var shiftslines = this.state.shiftLines.sort(function (obj1, obj2) {
            if(type=="string"){
                var value1 = _.get(obj1, propPath, "optionalDefaultValue").toLowerCase();
                var value2 = _.get(obj2, propPath, "optionalDefaultValue").toLowerCase();
            }
            else{
                var value1 = _.get(obj1, propPath, "optionalDefaultValue").toString().split("T")[0];
                var value2 = _.get(obj2, propPath, "optionalDefaultValue").toString().split("T")[0];
            }
           
            if (order) {
                if (value1 < value2)
                    //sort string ascending
                    return 1;
                if (value1 > value2) return -1;
                return 0; //default return value (no sorting)
            } else {
                if (value1 < value2)
                    //sort string desc
                    return -1;
                if (value1 > value2) return 1;
                return 0; //default return value (no sorting)
            }
        });
        this.setState({ shiftLines: shiftslines });
    };
    getShiftLines = (headerChange) => {
     
       if(this.state.statuscode==0){
         this.getUnAssignedShiftLines(headerChange);
       }
       if(this.state.statuscode==1){
        this.getAssignedShiftLines(headerChange);
    }
    };
    formateGMTDate(date){
        var fDate="";
        if(date){
            var month=date.getMonth()+1;
            var month=month.toString().length==1?("0"+month):month;
            var date1=date.getDate().toString().length==1?("0"+date.getDate()):date.getDate();
    fDate= date.getFullYear()+"-"+month+"-"+date1;  
        }
      return fDate;  
    }
    getUnAssignedShiftLines(headerChange){
        this.setState({ pageLoader: true,shiftLines:[] });
        var params="?fromDate="+this.formateGMTDate(this.state.fromDate)
        +"&toDate="+this.formateGMTDate(this.state.toDate)
        +"&clientPlantMasterId="+this.state.plantId
        +"&start="+this.state.start
        +"&limit="+this.state.limit
        if(this.state.selectedDesignationValue!=""){
            params=params+"&designation="+this.state.selectedDesignationValue
        }
        if(this.state.selectedDepartmentValue!=""){
            params=params+"&department="+this.state.selectedDepartmentValue 
        }
        RosterManagementService.getUnAssignedShiftLines(params)
        .then(
            (response) => {
                if (response.data) {
                    var shifts = response.data;
                    for (let shift of shifts) {
                        shift.toggle = false;
                        shift.clientShiftLineId=shift.userId+"T"+Math.random();
                    }
                    this.setState({ shiftLines: shifts ,totalItemsCount: response.totalResults});

                    for (
                        var i = 0;
                        i < document.getElementsByName("childCheckbox").length;
                        i++
                    ) {
                        document.getElementsByName("childCheckbox")[i].checked = false;
                    }
                    document.getElementById("parenCheckbox").checked = false;
                    if (headerChange == true) {
                        if(this.state.statuscode==0){
                            this.setState({ headerType: "assignShiftDisable" });
                        }
                        else{
                            this.setState({ headerType: "changeShiftDisable" });
                        }
                       
                    }
                } else {
                    this.setState({ shiftLines: [] });
                }
                this.setState({ pageLoader: false });
            },
            (error) => {
                this.setState({ pageLoader: false });
            }
        )
        .catch((error) => {
            console.log("caled............");
            if (
                error.message == "Request failed with status code 401" ||
                error.message == "Network Error"
            ) {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }
    getAssignedShiftLines(headerChange){
        this.setState({ pageLoader: true,shiftLines:[] });
        var params="?fromDate="+this.formateGMTDate(this.state.fromDate)
                   +"&toDate="+this.formateGMTDate(this.state.toDate)
                   +"&clientPlantMasterId="+this.state.plantId
                   +"&start="+this.state.start
                   +"&limit="+this.state.limit
                   if(this.state.selectedDesignationValue!=""){
                    params=params+"&designation="+this.state.selectedDesignationValue
                }
                if(this.state.selectedDepartmentValue!=""){
                    params=params+"&department="+this.state.selectedDepartmentValue 
                }
                if(this.state.selectedShiftValue!=""){
                    params=params+"&shiftIds="+this.state.selectedShiftValue
                }
        RosterManagementService.getAssignedShiftLines(params)
        .then(
            (response) => {
                if (response.data) {
                    var shifts = response.data;
                    for (let shift of shifts) {
                        shift.toggle = false;
                        shift.department=shift.bcmUser.bcmDesignation.bcmDepartment.name;
                        shift.departmentId=shift.bcmUser.bcmDesignation.bcmDepartment.bcmDepartmentId
                        shift.designation=shift.bcmUser.bcmDesignation.name;
                        shift.designationId=shift.bcmUser.bcmDesignation.bcmDesignationId;
                        shift.employeeId=shift.bcmUser.userCode;
                        shift.firstName=shift.bcmUser.firstName;
                        shift.userId=shift.bcmUser.bcmUserId;
                        shift.clientShiftLineId=shift.clientShiftLineId+"T"+shift.clientShiftMaster.clientShiftMasterId
                        console.log(shift.clientShiftLineId)
                    }
                    this.setState({ shiftLines: shifts ,totalItemsCount: response.totalResults});

                    for (
                        var i = 0;
                        i < document.getElementsByName("childCheckbox").length;
                        i++
                    ) {
                        document.getElementsByName("childCheckbox")[i].checked = false;
                    }
                    document.getElementById("parenCheckbox").checked = false;
                    if (headerChange == true) {
                        if(this.state.statuscode==0){
                            this.setState({ headerType: "assignShiftDisable" });
                        }
                        else{
                            this.setState({ headerType: "changeShiftDisable" });
                        }
                       
                    }
                } else {
                    this.setState({ shiftLines: [] });
                }
                this.setState({ pageLoader: false });
            },
            (error) => {
                this.setState({ pageLoader: false });
            }
        )
        .catch((error) => {
            console.log("caled............");
            if (
                error.message == "Request failed with status code 401" ||
                error.message == "Network Error"
            ) {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ Loader: false });
                }, 3000);
            }
        });
    }

    getDepartmentList = () => {
        this.setState({ departmentLoader: true });
        DataManagementService.getAlldepartmentList().then((Response) => {
            this.setState({
                departmentList: Response.data ? Response.data : [],
                departmentLoader: false,
            });
        }).catch((error) => {
            console.log("caled............");
            if (
                error.message == "Request failed with status code 401" ||
                error.message == "Network Error"
            ) {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ departmentLoader: false });
                }, 3000);
            }
        });
    };
    getDesignationList = (id) => {
        this.setState({ designationLoader: true, designationList: [] });
        DataManagementService.getAllDesignations(id).then((Response) => {
            this.setState({
                designationList: Response.data ? Response.data : [],
                designationLoader: false,
            });
        }).catch((error) => {
            if (
                error.message == "Request failed with status code 401" ||
                error.message == "Network Error"
            ) {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ designationLoader: false });
                }, 3000);
            }
        });
    };
    onChangeEvent = (e) => {
        var value = e.target.value;
        this.setState({ show: !this.state.show,statuscode:e.target.value,start:0,limit:10 },()=>{
            this.getShiftLines(false);
            if (value == 0) {
                this.setState({ headerType: "assignShiftDisable" });
            } else {
                this.setState({ headerType: "changeShiftDisable" });
            }
        });
        
    };
    childCheckboxEvent = (event) => {
        var id = event.target.id;
        if (this.state.plantId != 0) {
            this.setState({ showHeaderMsg: false });
            var headerType = this.state.headerType;
            if (document.getElementById(id).checked == false) {
                document.getElementById(id).checked = false;
                
            } else {
                document.getElementById(id).checked = true;

                if (headerType == "assignShiftDisable") {
                    this.setState({ headerType: "assignShift" });
                }
                if (headerType == "changeShiftDisable") {
                    this.setState({ headerType: "changeShift" });
                }
            }
            //check not even one also checked..
            var atleastOneChecked=false;
            for (
                var i = 0;
                i < document.getElementsByName("childCheckbox").length;
                i++
            ) {
                if (document.getElementsByName("childCheckbox")[i].checked == true) {
                     atleastOneChecked=true;
                } else {

                }

            }
            if(atleastOneChecked==false){
                if (headerType == "assignShift") {
                    this.setState({ headerType: "assignShiftDisable" });
                }
                if (headerType == "changeShift") {
                    this.setState({ headerType: "changeShiftDisable" });
                }
            }
            var parentCheckboxFlag = 0;
            var howManychildChecked = 0;
            for (
                var i = 0;
                i < document.getElementsByName("childCheckbox").length;
                i++
            ) {
                if (document.getElementsByName("childCheckbox")[i].checked == false) {
                    parentCheckboxFlag = 1;
                } else {
                    howManychildChecked = howManychildChecked + 1;
                }
            }
            document.getElementById("parenCheckbox").checked =
                parentCheckboxFlag == 0 ? true : false;
            if (howManychildChecked == 1 || howManychildChecked == 0) {
                this.setState({ expendViewClass: "bottom-action" });
            } else {
                this.setState({ expendViewClass: "bottom-action active" });
            }
        } else {
            this.setState({ showHeaderMsg: true });
        }
    };
    parentCheckboxEvent = (object) => {
        if (this.state.plantId != 0) {
            this.setState({ showHeaderMsg: false });
            var headerType = this.state.headerType;
            if (object.target.checked == true) {
                for (
                    var i = 0;
                    i < document.getElementsByName("childCheckbox").length;
                    i++
                ) {
                    document.getElementsByName("childCheckbox")[i].checked = true;
                }
                if (headerType == "assignShiftDisable") {
                    this.setState({ headerType: "assignShift" });
                }
                if (headerType == "changeShiftDisable") {
                    this.setState({ headerType: "changeShift" });
                }
            } else {
                for (
                    var i = 0;
                    i < document.getElementsByName("childCheckbox").length;
                    i++
                ) {
                    document.getElementsByName("childCheckbox")[i].checked = false;
                }
                if (headerType == "assignShift") {
                    this.setState({ headerType: "assignShiftDisable" });
                }
                if (headerType == "changeShift") {
                    this.setState({ headerType: "changeShiftDisable" });
                }
            }
        } else {
            this.setState({ showHeaderMsg: true });
            document.getElementById("parenCheckbox").checked = false;
        }
    };
    getAllSiftMasterData = () => {
        this.setState({ shiftLoader: true, shifts: [] });
        RosterManagementService.getAllClientShiftMaster(this.state.plantId).then(
            (response) => {
                if (response.data != null) {
                    this.setState({ shifts: response.data ,shiftLoader:false});
                } else {
                    this.setState({ shifts: [] ,shiftLoader:false});
                }
            },
            (error) => {
                this.setState({ shifts: [],shiftLoader:false });
            }
        ).catch((error) => {
            if (
                error.message == "Request failed with status code 401" ||
                error.message == "Network Error"
            ) {
                this.setState({ sessionExpired: true });
                setTimeout(() => {
                    sessionStorage.clear();
                    this.props.history.push("login");
                    this.setState({ shiftLoader:false });
                }, 3000);
            }
        });
    };
   

// form validation code 
    onChangeStartDate=(date,name)=>{
        const obj = {name:name,value:date};
        this.handleChange({target:obj});
    }
    onChangeEndDate=(date,name)=>{
        // this.setState({ endDate: date })
        const obj = {name:name,value:date};
        this.handleChange({target:obj});
    }
    handleChange=(e)=>{
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    shiftNameValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Shift Name is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    startDateValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'Start Date is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

    endDateValidator = (Param) => {
        var returnMsg = '';
        if (Param.length == 0) {
            returnMsg = 'End Date is required';
        } else {
            returnMsg = '';
        }
        return returnMsg;
    }

  

    submitAssignShift = ()=>{
        var startDate=this.formateGMTDate(this.state.startDate);
        var endDate=this.formateGMTDate(this.state.endDate);
        var datesValid=(startDate<=endDate)
        debugger
        if(datesValid){
            this.setState({pageLoader:true})
            var users=[];
            for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
                if (document.getElementsByName('childCheckbox')[i].checked == true) {
                   var id = document.getElementsByName('childCheckbox')[i].value.split("T")[0];
                  users.push({
                    "bcmUserId": id
                  })
                }
             }
            var payload={
                "clientShiftMaster": {
                    "clientShiftMasterId": this.state.shiftId.split("T")[0],
                    "clientShiftName": this.state.shiftId.split("T")[1]
                },
                "fromDate": startDate,
                "toDate": endDate,
                "userList":users
              }
             
             console.log(payload);
            
    this.submitAssignShiftCall(payload)
        }
        else{
            this.setState({showShiftErrorMsg:true,errorMsg:"Start Date should be less than End Date"})
            setTimeout(() => {
                this.setState({showShiftErrorMsg:false})
            }, 2500);
        }
       
       

    }
    submitAssignShiftCall(payload){
        this.setState({pageLoader:true})
        RosterManagementService.assignShift(payload).then(response=>{
            if(response.data!=null){
               this.setState({showShiftSuccessMsg:true,startDate:"",endDate:"",shiftId:"",
               pageLoader:false,headerType:"assignShiftDisable",successMsg:"Shift Assigned Successfully",
               individualEndDate:null,individualStartDate:null,individualShift:""})
               this.getShiftLines(false)
            }
            else{
               this.setState({showShiftErrorMsg:true,pageLoader:false,errorMsg:"Error while assigning shift"})
            }
            setTimeout(() => {
               this.setState({ showShiftSuccessMsg: false,showShiftErrorMsg:false })
            }, 3000);
            
        },error=>{
           this.setState({showShiftErrorMsg:true,pageLoader:false,errorMsg:"Error while assigning shift"})
        }).catch((error) => {
           console.log("caled............");
           if (
               error.message == "Request failed with status code 401" ||
               error.message == "Network Error"
           ) {
               this.setState({ sessionExpired: true });
               setTimeout(() => {
                   sessionStorage.clear();
                   this.props.history.push("login");
                   this.setState({ pageLoader: false });
               }, 3000);
           }
       });
    }
    submitChangeShift = ()=>{
        //check all the employees are from same shift or not
        var shiftIds=[]
        for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
            if (document.getElementsByName('childCheckbox')[i].checked == true) {
               var shiftId = document.getElementsByName('childCheckbox')[i].value.split("T")[1];
               shiftIds.push(shiftId);
            }
         }
         var sameshift=shiftIds.every((val, i, arr) => val === arr[0]);
         console.log(sameshift)
        //from shift and to shift should not be same
        console.log(this.state.fromShiftId!=this.state.toshiftId);
        var toShiftIsdiff=this.state.fromShiftId!=this.state.toshiftId;

        var startDate=this.formateGMTDate(this.state.startDate1);
        var endDate=this.formateGMTDate(this.state.endDate1);
        var datesValid=startDate<=endDate
       
        if(sameshift==true && toShiftIsdiff==true && datesValid==true){
           
            var shiftLines=[];
            for (var i = 0; i < document.getElementsByName('childCheckbox').length; i++) {
                if (document.getElementsByName('childCheckbox')[i].checked == true) {
                   var id = document.getElementsByName('childCheckbox')[i].value.split("T")[0];
                   shiftLines.push({
                    "clientShiftLineId": id,
                    "clientShiftMaster": {
                        "clientShiftMasterId": this.state.toshiftId.split("T")[0],
                        "clientShiftName": this.state.toshiftId.split("T")[1]
                    },
                    "fromDate": this.formateGMTDate(this.state.startDate1),
                    "toDate": this.formateGMTDate(this.state.endDate1)
                  })
                }
             }
             console.log(shiftLines);
             this.submitChangeShiftCall(shiftLines)
        }
        else{
            if(sameshift==false){
                this.setState({showShiftErrorMsg:true,errorMsg:"Please select all the employees from same shift"})
            }
            if(toShiftIsdiff==false){
                this.setState({showShiftErrorMsg:true,errorMsg:"From shift and To shift should not be same"})
            }
            if(datesValid==false){
                this.setState({showShiftErrorMsg:true,errorMsg:"Start Date should be less than End Date"})
            }
            setTimeout(() => {
                this.setState({ showShiftErrorMsg: false })
             }, 2500);
        }
        
    }
submitChangeShiftCall(shiftLines){
    this.setState({pageLoader:true})
    RosterManagementService.changeShift(shiftLines).then(response=>{
        if(response.data!=null){
           this.setState({showShiftSuccessMsg:true,startDate1:"",endDate1:"",fromShiftId:"",
           toShiftId:"",pageLoader:false,headerType:"changeShiftDisable",
           successMsg:"Shift changed Successfully",
           individualEndDate:null,individualStartDate:null,individualShift:""});

           this.getShiftLines(false)
        }
        else{
           this.setState({showShiftErrorMsg:true,pageLoader:false,errorMsg:"Error while changing shift"})
        }
        setTimeout(() => {
            this.setState({ showShiftSuccessMsg: false,errorMsg:"Error while changing shift" ,showShiftErrorMsg:false})
         }, 3000);
        
    },error=>{
       this.setState({showShiftErrorMsg:true,pageLoader:false,errorMsg:"Error while changing shift"})
    }).catch((error) => {
       console.log("caled............");
       if (
           error.message == "Request failed with status code 401" ||
           error.message == "Network Error"
       ) {
           this.setState({ sessionExpired: true });
           setTimeout(() => {
               sessionStorage.clear();
               this.props.history.push("login");
               this.setState({ pageLoader: false });
           }, 3000);
       }
   });
}
    
    renderHeader() {
        const {isError}=this.state;
        var header = "";
        switch (this.state.headerType) {
            case "assignShiftDisable":
                header =
                (<div className="filterSearch ml-auto mt-1">
                    <div className="form1 w-auto">
                    {this.state.showHeaderMsg == true ? <p style={{ color: 'red' }}>{this.state.headerErrorMsg}</p> : null}
                        <form className="serach-form">
                            <Button variant="success" disabled title="Please Select Employee/s">Assign Shift</Button>
                        </form>
                       
                        </div>
                    </div>
                );
                break;
            case "assignShift":
                header = (
                    <div className="filterSearch ml-auto mt-1">
                        <div className="form1">
                            <form className="serach-form">
                                <Form.Control
                                    as="select"
                                    name="shiftId"
                                    style={{
                                        color: "#dddddd !important",
                                        backgroundColor: "#5D5D5D !important",
                                    }}
                                    onChange={this.handleChange}
                                >
                                    <option
                                        value={''}
                                        style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                         >
                                     Select Shift
                                     </option>
                                    {this.state.shifts.map((shift, index) => (
                                        <option
                                            key={index}
                                            style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                            value={shift.clientShiftMasterId+"T"+shift.clientShiftName}
                                        >
                                            {shift.clientShiftName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </form>
                               
                        </div>
                        <div className="form1 rightArw">
                            <form className="serach-form">
                                <Form.Group className="datePicker">
                                    <DatePicker
                                        placeholderText="Start Date"
                                        selected={this.state.startDate}
                                        minDate={new Date()}
                                        dateFormat="dd-MM-yyyy"
                                        onChange={(date) => this.onChangeStartDate(date,"startDate")}
                                    />
                                    <i className="calIcon"></i>
                                </Form.Group>
                            </form>
                            <span>&#8594;</span>
        
                        </div>
                        <div className="form1">
                            <form className="serach-form">
                                <Form.Group className="datePicker">
                                    <DatePicker
                                        placeholderText="End Date"
                                        selected={this.state.endDate}
                                        minDate={new Date()}
                                        dateFormat="dd-MM-yyyy"
                                        onChange={(date) => this.onChangeEndDate(date,"endDate")}
                                    />
                                    <i className="calIcon"></i>
                                </Form.Group>
                            </form>
                                   
                        </div>
                        <div className="form1">
                            <form className="serach-form">
                             {this.state.shiftId.length>0 && this.state.startDate.toString().length>0 && this.state.endDate.toString().length>0?
                                 <Button variant="success"  onClick={this.submitAssignShift}>Assign Shift</Button>:  
                                 <Button variant="success" disabled title="Please fill all the fields">Assign Shift</Button>}  
                            </form>
                        </div>
                    </div>
                );
                break;
            case "changeShiftDisable":
                header =
                (<div className="filterSearch ml-auto mt-1">
                    <div className="form1 w-auto">
                    {this.state.showHeaderMsg == true ? <p style={{ color: 'red' }}>{this.state.headerErrorMsg}</p> : null}
                        <form className="serach-form">
                            <Button variant="success" disabled title="Please Select Employee/s">Change Shift</Button>
                        </form>
                       
                        </div>
                    </div>
                );
                break;
            case "changeShift":
                header = (
                    <div className="filterSearch ml-auto mt-1">
                        <div className="form1 rightArw">
                            <form className="serach-form">
                                <Form.Control
                                    as="select"
                                    name="fromShiftId"
                                    style={{
                                        color: "#dddddd !important",
                                        backgroundColor: "#5D5D5D !important",
                                    }}
                                    onChange={this.handleChange}
                                >
                                    <option
                                        value={''}
                                        style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                    >
                                        Select Shift
                  </option>
                                    {this.state.shifts.map((Object, index) => (
                                        <option
                                            key={index}
                                            style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                            value={Object.clientShiftMasterId+"T"+Object.clientShiftName}
                                        >
                                            {Object.clientShiftName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </form>
                            <span>&#8594;</span>
                
                        </div>
                        <div className="form1">
                            <form className="serach-form">
                                <Form.Control
                                    as="select"
                                    name="toshiftId"
                                    style={{
                                        color: "#dddddd !important",
                                        backgroundColor: "#5D5D5D !important",
                                    }}
                                    onChange={this.handleChange}
                                >
                                    <option
                                        value={''}
                                        style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                    >
                                        Select Shift
                                        </option>
                                    {this.state.shifts.map((Object, index) => (
                                        <option
                                            key={index}
                                            style={{ backgroundColor: "#ffffff", color: "#222222" }}
                                            value={Object.clientShiftMasterId+"T"+Object.clientShiftName}
                                        >
                                            {Object.clientShiftName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </form>
                            
                        </div>
                        <div className="form1 rightArw">
                            <form className="serach-form">
                                <Form.Group className="datePicker">
                                    <DatePicker
                                        placeholderText="Start Date"
                                        selected={this.state.startDate1}
                                        minDate={new Date()}
                                        dateFormat="dd-MM-yyyy"
                                        onChange={(date) => this.onChangeStartDate(date,"startDate1")}
                                    />
                                    <i className="calIcon"></i>
                                </Form.Group>
                            </form>
                            <span>&#8594;</span>
                          
                        </div>
                        <div className="form1">
                            <form className="serach-form">
                                <Form.Group className="datePicker">
                                    <DatePicker
                                        placeholderText="End Date"
                                        selected={this.state.endDate1}
                                        minDate={new Date()}
                                        dateFormat="dd-MM-yyyy"
                                        onChange={(date) => this.onChangeEndDate(date,"endDate1")}
                                    />
                                    <i className="calIcon"></i>
                                </Form.Group>
                            </form>
                          
                        </div>
                        <div className="form1">
                        <form className="serach-form">
                             {this.state.fromShiftId.length>0 && this.state.toshiftId.length>0 && this.state.startDate1 && this.state.endDate1?
                                 <Button variant="success"  onClick={this.submitChangeShift}>Change Shift</Button>:  
                                 <Button variant="success" disabled title="Please fill all the fields">Change Shift</Button>}  
                            </form>
                        </div>
                    </div>
                );
                break;
            default:
                header = "assignShiftDisable";
        }
        return header;
    }

    onEdit = (shiftLine,toggle,fromEdit) => {
        if(fromEdit){
            if(shiftLine.fromDate!=null){
                this.setState({individualStartDate:new Date(shiftLine.fromDate.toString().split("T")[0])})
            }
            if(shiftLine.toDate!=null){
                this.setState({individualEndDate:new Date(shiftLine.toDate.toString().split("T")[0])})
            }
            if(shiftLine.clientShiftMaster!=null){
                this.setState({individualShift:shiftLine.clientShiftMaster.clientShiftMasterId+"T"+shiftLine.clientShiftMaster.clientShiftName})
            }
        }
       
        var shifts = this.state.shiftLines;
        for(let shift of shifts){
            if(shift.clientShiftLineId == shiftLine.clientShiftLineId){
                shift.toggle=toggle
            }
            else{
                shift.toggle=false
            }
        }
        this.setState({ shiftLines: shifts });
    };
    shiftChange=(shiftLine,toggle)=>{
        this.setState({showShiftErrorMsg:false,errorMsg:""});
        console.log(this.state.individualStartDate,this.state.individualEndDate,this.state.individualShift);
        if(this.state.individualStartDate==null){
            this.setState({individualStartDateInvalid:true})
        }
        if(this.state.individualEndDate==null){
            this.setState({individualEndDateInvalid:true})
        }
        if(this.state.individualShift==""){
            this.setState({individualShiftInvalid:true})
        }
       setTimeout(() => {
        if(this.state.individualStartDateInvalid==false && this.state.individualEndDateInvalid==false && this.state.individualShiftInvalid==false){
            var startDate=this.formateGMTDate(this.state.individualStartDate);
            var endDate=this.formateGMTDate(this.state.individualEndDate);
            if(startDate<=endDate){
                if(this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"){
                    var users=[{
                        "bcmUserId": shiftLine.userId
                      }]
                    var payload={
                        "clientShiftMaster": {
                            "clientShiftMasterId": this.state.individualShift.split("T")[0],
                            "clientShiftName": this.state.individualShift.split("T")[1]
                        },
                        "fromDate":startDate ,
                        "toDate": endDate,
                        "userList":users
                      }
                      console.log(payload)
                      this.submitAssignShiftCall(payload)
                      var shifts = this.state.shiftLines;
                      for(let shift of shifts){
                          if(shift.clientShiftLineId == shiftLine.clientShiftLineId){
                              shift.toggle=toggle
                          }
                          else{
                              shift.toggle=false
                          }
                      }
                
                      this.setState({ shiftLines: shifts });
                }
                else{
                    var shiftLines=[]
                    shiftLines.push({
                        "clientShiftLineId": shiftLine.clientShiftLineId.split("T")[0],
                        "clientShiftMaster": {
                            "clientShiftMasterId": this.state.individualShift.split("T")[0],
                            "clientShiftName": this.state.individualShift.split("T")[1]
                        },
                        "fromDate": startDate,
                        "toDate": endDate,
                      })
                      this.submitChangeShiftCall(shiftLines)
                      var shifts = this.state.shiftLines;
                      for(let shift of shifts){
                          if(shift.clientShiftLineId == shiftLine.clientShiftLineId){
                              shift.toggle=toggle
                          }
                          else{
                              shift.toggle=false
                          }
                      }
                
                      this.setState({ shiftLines: shifts });
                }
            }
           
                else{
                    this.setState({showShiftErrorMsg:true,errorMsg:"From Date should be less than End Date"});
                    setTimeout(() => {
                        this.setState({showShiftErrorMsg:false,errorMsg:""});
                    }, 2500);
                }      
                    } 
       }, 300); 
       
        
       
    }

    //Pagination......
    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing {from} to {to} of {size} Results
        </span>
    );
    SerachChange = (object) => {
        var paginationOptions = { ...this.state.paginationOptions };
        this.setState({ paginationOptions });
    };
    sizePerPageCountChange = (object, object1) => {
        this.setState({ pageLoader: true });
        let limit = object.target.value;
        let start = 0;
        const { plantId } = this.state;
        //Call api ith start,limit,plantId
        this.setState({start,limit},()=>{
            this.getShiftLines(false)
        })
        
    };
    handlePageChange = (pageNumber) => {
        this.setState({ pageLoader: true });
        let start = pageNumber;
        let limit = this.state.perpage;
        const { plantId } = this.state;
        //Call api ith start,limit,plantId
        this.setState({start,limit},()=>{
            this.getShiftLines(false);
            this.setState({ perpage: limit, activePage: start });
        })
    };
    handleClass(prop, value) {
        var styleClass = "";
        if (prop == value) {
            styleClass = "sorting";
        } else {
            if (prop == true) {
                styleClass = "sorting desc";
            } else {
                styleClass = "sorting asc";
            }
        }
        return styleClass;
    }
    formateDate(dateObj){
        var date=""
        if(dateObj!=null && dateObj !=undefined){
            var date=dateObj.toString().split("T")[0];
            var datearray= date.split("-");
            date= datearray[2]+"-"+datearray[1]+"-"+datearray[0]
        }
       return date;
    }
  
    selectDesignation=(e)=>{
        var value = e.target.value;
        var checked = e.target.checked;
         if(checked){
             this.state.checkedDesigs.push(value)
         }else{
           var index =  this.state.checkedDesigs.indexOf(value);
           this.state.checkedDesigs.splice(index,1);
         }
         console.log(this.state.checkedDesigs.join());
         this.setState({
            selectedDesignationValue:this.state.checkedDesigs.join()
         });
    }
    selectShift=(e)=>{
        var value = e.target.value;
        var checked = e.target.checked;
         if(checked){
             this.state.checkedShifts.push(value)
         }else{
           var index =  this.state.checkedShifts.indexOf(value);
           this.state.checkedShifts.splice(index,1);
         }
         console.log(this.state.checkedShifts.join());
         this.setState({
            selectedShiftValue:this.state.checkedShifts.join()
         });
    }

    
    selectDepartment=(e)=>{
        
        var value = e.target.value;
        var checked = e.target.checked;
         if(checked){
             this.state.checkedDeparts.push(value)
         }else{
           var index =  this.state.checkedDeparts.indexOf(value);
           this.state.checkedDeparts.splice(index,1);
         }
         console.log(this.state.checkedDeparts.join());
         this.setState({
            selectedDepartmentValue:this.state.checkedDeparts.join()
         });


    }
    filterDesignations=(applyFilters)=>{
        document.getElementById('designationbtn').click();
        if(applyFilters==true){
            this.getShiftLines(false)
        }
    }
    filterDepartments=(applyFilters)=>{
        document.getElementById('departmentbtn').click();
        if(applyFilters==true){
            this.getShiftLines(false)
        }
    }
    filterShifts=(applyFilters)=>{
        document.getElementById('shiftbtn').click();
        if(applyFilters==true){
            this.getShiftLines(false)
        }
    }
    onfoucus=()=>{
        console.log("called,,,,,,,,,,,,,,")
    }
    render() {
        const { fromDate, toDate, dateClass, isError} = this.state;
        return (
            <Fragment>
                <div className="dashboard-container roster-management-container">
                    <div className="dashboard-section">
                        <div className="welcome-text">
                            <div className="employee-header">
                                <h2>Roster Management</h2>
                                <div className="roster-management  Choose-onSite">
                                    <Form.Group
                                        controlId="exampleForm.ControlSelect1"
                                        className="roster-option-form"
                                    >
                                        <Form.Control
                                            as="select"
                                            onChange={(e) => this.onChangeEvent(e)}
                                            value={this.state.statuscode}
                                            className={this.state.selectOptionColorName}
                                        >
                                            <option value={0}>Un Assigned</option>
                                            <option value={1}>Assigned</option>
                                        </Form.Control>
                                        <div className="form1">
                                            <form className={`serach-form ${dateClass}`} id="RangeDatePicker">
                                            <RangeDatePicker
                                                startDate={fromDate ? new Date(fromDate) : null}
                                                endDate={toDate ? new Date(toDate) : null}
                                                onChange={(startDate, endDate) => this.onDateChange(startDate, endDate)}
                                                startDatePlaceholder="Start Date"
                                                endDatePlaceholder="End Date"
                                                dateFormat="MMM DD,YYYY"
                                               // onFocus={()=>this.onfoucus()}
                                            />
                                        </form>
                                       </div>
                                    </Form.Group>
                            </div>
                        </div>

                    </div>
                    <div className="tableList">
                        <div className="accordion__item">
                            <div className="accordion__button btm-radius-zero">
                                <div className="accordionHeader">
                                    <h5>Employee Shift Details</h5>
                                </div>
                                <div className="tableSearch"></div>
                            </div>
                        </div>
                        <div className="h-100">
                            {this.renderHeader()}
                            {/* Success alert */}
                            {this.state.showShiftSuccessMsg==true ? <Alert variant="success" className="custom-alert center mark">
                                <p className="alert-msg">{this.state.successMsg}</p>
                            </Alert> : null}
                            {/* Failure alert */}
                            {this.state.showShiftErrorMsg==true ? <Alert variant="danger" className="custom-alert center mark">
                                <p className="alert-msg">{this.state.errorMsg}</p>
                            </Alert> : null}
                            <div className="accordionTable merits-table">
                                {this.state.pageLoader ==true? (
                                    <div className="loader">
                                        <Spinner animation="grow" variant="dark"></Spinner>
                                    </div>
                                ) : null}
                                <Alert show={this.state.sessionExpired} variant="danger">
                                <div className="alert-container">
                                    <p><i className="icons"></i>  Session Expired,Please login again.</p>
                                </div>
                                </Alert>
                                {/* React bootstrap normal table */}
                                <div className="html-table">
                                <Table>
                                    <thead>
                                        <tr>
                                        <th className="th-checkbox" >
                                            <div className="checkbox-leave" >
                                                <label className="container">
                                                    <input type="checkbox" id="parenCheckbox" onClick={this.parentCheckboxEvent.bind(this)} name="menucheckbox"/>
                                                    <span className="checkmark"></span>
                                                    <span className="checkbox-text"></span>
                                                </label>
                                            </div>
                                        </th>
                                        <th className="th-emp-id">
                                            <div  className={this.handleClass(this.state.empIdToggle,"empIdToggle")} onClick={()=>(this.sort(this.state.empIdToggle,"employeeId"),"string",this.setState({empIdToggle:!this.state.empIdToggle}))}>Employee ID                                           
                                                <span className="order">
                                                    
                                                </span>
                                            </div>
                                        </th>
                                        <th className="th-emp-name">
                                            <div  className={this.handleClass(this.state.empNameToggle,"empNameToggle")} onClick={()=>(this.sort(this.state.empNameToggle,"firstName","string"),this.setState({empNameToggle:!this.state.empNameToggle}))}>Employee Name                                            
                                                <span className="order">
                                                   
                                                </span>
                                            </div>
                                        </th>
                                        <th className="th-designation">
                                            <div className={this.handleClass(this.state.designationToggle,"designationToggle")} onClick={()=>(this.sort(this.state.designationToggle,"designation","string"),this.setState({designationToggle:!this.state.designationToggle}))}>Designation                                      
                                                <span className="order" >
                                                   
                                                </span>
                                            </div>
                                            <div className="filter-dropdown">
                                                <Dropdown>
                                                
                                                    <Dropdown.Toggle variant="secondary" id="designationbtn">
                                                        <svg id="filter_alt-24px" width="20" height="20" viewBox="0 0 24 24">
                                                            <path id="Path_3279" data-name="Path 3279" d="M0,0H24m0,24H0" fill="none"/>
                                                            <path id="Path_3280" data-name="Path 3280" d="M4.25,5.61C6.57,8.59,10,13,10,13v5a2.006,2.006,0,0,0,2,2h0a2.006,2.006,0,0,0,2-2V13s3.43-4.41,5.75-7.39A1,1,0,0,0,18.95,4H5.04A1,1,0,0,0,4.25,5.61Z" fill="#1d1d1d"/>
                                                            <path id="Path_3281" data-name="Path 3281" d="M0,0H24V24H0Z" fill="none"/>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                 <Dropdown.Menu >
                                                 {this.state.designationLoader ==true? (
                                                    <div className="loader">
                                                        <Spinner animation="grow" variant="dark"></Spinner>
                                                    </div>
                                                ) : null}
                                                 <div className="scroll-dropdown">
                                                     {this.state.designationList.map((designation,index) =>
                                                        <a className="dropdown-item">
                                                            <div className="checkbox-leave" >
                                                                <label className="container">
                                                                    <input type="checkbox" value={designation.bcmDesignationId} onChange={e=>this.selectDesignation(e)} id="menucheckbox" name="menucheckbox"/>
                                                                    <span className="checkmark"></span>
                                                                    <span className="checkbox-text">{designation.name}</span>
                                                                </label>
                                                            </div>                                                            
                                                        </a>
                                                     )}                                                            
                                                        </div>  
                                                        <a className="dropdown-submit">
                                                            <Button variant="light" onClick={()=>this.filterDesignations(false)}>Cancel</Button>
                                                            <Button variant="dark" onClick={()=>this.filterDesignations(true)}>Apply</Button>
                                                        </a>                                                    
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </th>
                                        <th className="th-department">
                                            <div className={this.handleClass(this.state.departmentToggle,"departmentToggle")} 
                                            onClick={()=>(this.sort(this.state.departmentToggle,"department","string"),
                                            this.setState({departmentToggle:!this.state.departmentToggle}))}>Department                                            
                                            <span className="order" >
                                                   
                                                </span>
                                            </div>
                                            <div className="filter-dropdown">
                                            <Dropdown>
                                           
                                                    <Dropdown.Toggle variant="secondary" id="departmentbtn">
                                                        <svg id="filter_alt-24px" width="20" height="20" viewBox="0 0 24 24">
                                                            <path id="Path_3279" data-name="Path 3279" d="M0,0H24m0,24H0" fill="none"/>
                                                            <path id="Path_3280" data-name="Path 3280" d="M4.25,5.61C6.57,8.59,10,13,10,13v5a2.006,2.006,0,0,0,2,2h0a2.006,2.006,0,0,0,2-2V13s3.43-4.41,5.75-7.39A1,1,0,0,0,18.95,4H5.04A1,1,0,0,0,4.25,5.61Z" fill="#1d1d1d"/>
                                                            <path id="Path_3281" data-name="Path 3281" d="M0,0H24V24H0Z" fill="none"/>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                    {this.state.departmentLoader ==true? (
                                                        <div className="loader">
                                                            <Spinner animation="grow" variant="dark"></Spinner>
                                                        </div>
                                                    ) : null}
                                                        <div className="scroll-dropdown">
                                               {this.state.departmentList.map((department,index)=><a className="dropdown-item">
                                                            <div className="checkbox-leave" >
                                                                <label className="container">
                                                                    <input type="checkbox" value={department.bcmDepartmentId} onChange={e=>this.selectDepartment(e)} id="menucheckbox5" name="menucheckbox5"/>
                                                                    <span className="checkmark"></span>
                                                                    <span className="checkbox-text">{department.name}</span>
                                                                </label>
                                                            </div>                                                            
                                                        </a>)}         
                                                        
                                                       
                                                        </div>   
                                                        <a className="dropdown-submit">
                                                            <Button variant="light" onClick={()=>this.filterDepartments(false)}>Cancel</Button>
                                                            <Button variant="dark" onClick={()=>this.filterDepartments(true)}>Apply</Button>
                                                        </a>                                                     
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </th>
                                      
                                         <th className="th-from-date">
                                            <div  className={this.handleClass(this.state.fromDateToggle,"fromDateToggle")} onClick={()=>(this.sort(this.state.fromDateToggle,"fromDate","date"),this.setState({fromDateToggle:!this.state.fromDateToggle}))}>From Date                                      
                                            {this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?null:  <span class="order">
                                                   
                                                   </span>}
                                            </div>
                                        </th>
                                        <th className="th-to-date">
                                            <div  className={this.handleClass(this.state.toDateToggle,"toDateToggle")} onClick={()=>(this.sort(this.state.toDateToggle,"toDate","date"),this.setState({toDateToggle:!this.state.toDateToggle}))}>To Date
                                            {this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?null:  <span class="order">
                                                   
                                                   </span>}
                                            </div>
                                        </th>
                                         <th className="th-shift">
                                            <div className={this.handleClass(this.state.shiftToggle,"shiftToggle")} onClick={()=>(this.sort(this.state.shiftToggle,"clientShiftName","string"),this.setState({shiftToggle:!this.state.shiftToggle}))}>Shift                                         
                                            {this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?null:  <span class="order">
                                                   
                                                   </span>}
                                            </div>
                                            <div className="filter-dropdown">
                                            {this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?null:           <Dropdown>
                                           
                                                    <Dropdown.Toggle variant="secondary" id="shiftbtn">
                                                        <svg id="filter_alt-24px" width="20" height="20" viewBox="0 0 24 24">
                                                            <path id="Path_3279" data-name="Path 3279" d="M0,0H24m0,24H0" fill="none"/>
                                                            <path id="Path_3280" data-name="Path 3280" d="M4.25,5.61C6.57,8.59,10,13,10,13v5a2.006,2.006,0,0,0,2,2h0a2.006,2.006,0,0,0,2-2V13s3.43-4.41,5.75-7.39A1,1,0,0,0,18.95,4H5.04A1,1,0,0,0,4.25,5.61Z" fill="#1d1d1d"/>
                                                            <path id="Path_3281" data-name="Path 3281" d="M0,0H24V24H0Z" fill="none"/>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                    {this.state.shiftLoader ==true? (
                                                        <div className="loader">
                                                            <Spinner animation="grow" variant="dark"></Spinner>
                                                        </div>
                                                    ) : null}
                                                    <div className="scroll-dropdown">
                                                   {this.state.shifts.map((shift,index)=>
                                                   <a className="dropdown-item">
                                                            <div className="checkbox-leave" >
                                                                <label className="container">
                                                                    <input type="checkbox" id="menucheckbox5" name="menucheckbox5" value={shift.clientShiftMasterId} onChange={e=>this.selectShift(e)}/>
                                                                    <span className="checkmark"></span>
                                                                    <span className="checkbox-text">{shift.clientShiftName}</span>
                                                                </label>
                                                            </div>                                                            
                                                        </a>)}                                                           
                                                         
                                                        </div>    
                                                        <a className="dropdown-submit">
                                                            <Button variant="light" onClick={()=>this.filterShifts(false)}>Cancel</Button>
                                                            <Button variant="dark" onClick={()=>this.filterShifts(true)}>Apply</Button>
                                                        </a>                                                  
                                                    </Dropdown.Menu>
                                                </Dropdown>}
                                            </div>
                                        </th>
                                        <th>Edit
                                            
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            { this.state.shiftLines.length>0?                   
                            this.state.shiftLines.map((shiftLine,index)=>
<tr key={index}>
<td className="td-checkbox">
    <div className="checkbox-leave" >
        <label className="container" >
        <input type="checkbox" onClick={this.childCheckboxEvent.bind(this)}
                     id={shiftLine.clientShiftLineId} value={shiftLine.clientShiftLineId} name="childCheckbox" />
            <span className="checkmark"></span>
            <span className="checkbox-text"></span>
        </label>
    </div>
</td>

{shiftLine.toggle==true?<td><Form.Control  type="text" placeholder={shiftLine.employeeId} disabled /></td>:<td>{shiftLine.employeeId}</td>}
{shiftLine.toggle==true?<td className="blue-text"><Form.Control  type="text" placeholder={shiftLine.firstName} disabled /></td>:<td className="blue-text">{shiftLine.firstName}</td>}
{shiftLine.toggle==true?<td><Form.Control  type="text" placeholder={shiftLine.designation} disabled /></td>:<td>{shiftLine.designation}</td>}
{shiftLine.toggle==true?<td><Form.Control  type="text" placeholder={shiftLine.department} disabled /></td>:<td>{shiftLine.department}</td> }
{shiftLine.toggle==true?<td><Form.Group className={`datePicker ${this.state.individualStartDateInvalid==true?"invalid":""}`} >
<DatePicker
    placeholderText="From Date"
    selected={this.state.individualStartDate}
    minDate={new Date()}
    dateFormat="dd-MM-yyyy"
    onChange={(date) => this.setState({ individualStartDate: date ,individualStartDateInvalid:false})}
/>
<i className="calIcon"></i>
</Form.Group></td>:<td>{this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?"DD-MM-YYYY":this.formateDate(shiftLine.fromDate)}</td> }
{shiftLine.toggle==true?<td><Form.Group className={`datePicker ${this.state.individualEndDateInvalid==true?"invalid":""}`}>
<DatePicker
    placeholderText="To Date"
    selected={this.state.individualEndDate}
    minDate={new Date()}
    dateFormat="dd-MM-yyyy"
    onChange={(date) => this.setState({ individualEndDate: date ,individualEndDateInvalid:false})}
/>
<i className="calIcon"></i>
</Form.Group></td>:<td>{this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?"DD-MM-YYYY":this.formateDate(shiftLine.toDate)}</td> }
 {/* {this.state.headerType=="changeShiftDisable"||this.state.headerType=="changeShift"?shiftLine.toggle==true?<td><Form.Control type="text" placeholder="Department" disabled /></td>:<td>{shiftLine.clientShiftMaster.clientPlantMaster.plant}</td> :null} */}
 {shiftLine.toggle==true?<td><Form.Control  className={`${this.state.individualShiftInvalid==true?"invalid":""}`} as="select" name="clientPlanAreaDetailId"  value={this.state.individualShift}
                                    style={{ color: '#dddddd !important', backgroundColor: '#5D5D5D !important' }}
                                  onChange={(event)=>this.setState({individualShift:event.target.value,individualShiftInvalid:false})} >
                                    <option value={""} selected style={{ backgroundColor: '#ffffff', color: '#222222' }}>Select Shift</option>
                                    {this.state.shifts.map((Object, index) =>
                                        <option key={index} style={{ backgroundColor: '#ffffff', color: '#222222' }}
                                            value={Object.clientShiftMasterId+"T"+Object.clientShiftName}>{Object.clientShiftName}
                                        </option>)}
                                </Form.Control></td>:<td>{this.state.headerType=="assignShift" || this.state.headerType=="assignShiftDisable"?"Not Assigned":shiftLine.clientShiftName}</td> }


<td className="td-edit">
   
   {shiftLine.toggle==true?(
       <div class="action-btn">
       <i class="icon icon-save" onClick={()=>this.shiftChange(shiftLine,false)}>
            <svg id="done-24px" width="24" height="24" viewBox="0 0 24 24"> 
                <path id="Path_3286" data-name="Path 3286" d="M0,0H24V24H0Z" fill="none"/>
                <path id="Path_3287" data-name="Path 3287" d="M9,16.2,5.5,12.7a.99.99,0,1,0-1.4,1.4l4.19,4.19a1,1,0,0,0,1.41,0L20.3,7.7a.99.99,0,0,0-1.4-1.4Z" fill="#729fe5"/>
            </svg>
        </i>
       <i class="icon icon-cancel" onClick={()=>this.onEdit(shiftLine,false,false)}>
            <svg id="close-24px" width="24" height="24" viewBox="0 0 24 24">
                <path id="Path_3284" data-name="Path 3284" d="M0,0H24V24H0Z" fill="none"/>
                <path id="Path_3285" data-name="Path 3285" d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89A1,1,0,0,0,7.11,18.3L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12,18.3,7.11A1,1,0,0,0,18.3,5.71Z" fill="#5a5a5a"/>
            </svg>
       </i>
   </div>): <div class="action-btn">
        <i class="icon-edit" onClick={()=>this.onEdit(shiftLine,true,true)}></i>
    </div>} 
</td>
</tr>  
                                      ) :<tr><td colSpan="6" className="text-center">Employee Shift Details not found</td></tr>}          
          
                                      
                                                       
                                    </tbody>
                                </Table>
                                </div>
                            </div>
                            {this.state.shiftLines.length >=10 ? (
                                <div className="row pagination-row">
                                    <div className="col-md-3 pb-0 mb-0">
                                        <Form.Control
                                            className="show-list d-inline-block"
                                            as="select"
                                            value={this.state.perpage}
                                            onChange={this.sizePerPageCountChange.bind(this)}
                                        >
                                            <option value={10}>10</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                            <option value={500}>500</option>
                                            <option value={1000}>1000</option>
                                            <option value={this.state.totalItemsCount}>All</option>
                                        </Form.Control>
                                        {/* <span className="showing">Showing 1 to 10 of 1000 Results</span>                    */}
                                    </div>
                                    <div className="col-md-9 pb-0 mb-0">
                                       
                                        <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={+this.state.perpage}
                                        totalItemsCount={this.state.totalItemsCount}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                       
                                    </div>
                                </div>
                            ) : null}
                        </div>
                       
                    </div>
                </div>
                </div>
            </Fragment >
        );
    }
}

export default RosterManagement;

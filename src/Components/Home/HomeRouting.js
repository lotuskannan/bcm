import React, { Component } from 'react'
import Dashboard from '../Dashboard/Dashboard';
import { Switch, Route, Redirect } from 'react-router-dom';
import CleanlinessAndSanitization from '../CleanlinessAndSanitization/CleanlinessAndSanitization';
import EmployeeHealth from '../EmployeeHealth/EmployeeHealth';
import CourseDetails from '../TraningAndAwareness/CourseDetails/CourseDetails';
import NewsAndUpdates from '../NewsAndUpdates/NewsAndUpdates';
import TraningAndAwareness from '../TraningAndAwareness/TraningAndAwareness';
import OnSiteSurvey from '../OnSiteSurvey/OnSiteSurvey';
import RosterManagement from '../RosterManagement/RosterManagement';
import ReportManagement from '../ReportManagement/ReportManagement';
import DataManagement from '../DataManagement/DataManagement';
import HealthManagement from '../DataManagement/HealthManagement';
import PlantManagement from '../DataManagement/PlantManagement';
import LeaveAttendanceCard from '../LeaveAttendance/LeaveAttendanceCard';
import RoleManagementContainer from '../RoleManagement/RoleManagementContainer';
import NoTAuthorised from '../NotAuthorised/NotAuthorised';

class HomeRouting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userGroup: '',
            components: []
        };
    }
    componentDidMount() {
        var dbComponents = JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.objBcmAppPermissionWrapper;
        var UIComponents = [];
        for (let compo of dbComponents) {
            var menu = compo.navigationMenu;
            menu = menu.replace(/\s/g, '');;
            UIComponents.push(menu);
        }
        this.setState({
            userGroup: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup,
            components: UIComponents
        });
    }
    render() {
        return (
            <Switch>
                {
                    // Dashboard
                    // Survey
                    // EmployeeHealth
                    // CleanlynessAndSanitization
                    // DataManagement
                    // ReportManagement
                    // TrainingAndAwareness
                    // NewsAndUpdates
                    // RoleManagement
                    // LeaveManagement
                    //RosterManagement
                    <React.Fragment>
                        <Route exact path='/home/dashboard' render={(props) => this.state.components.includes("Dashboard") ? (<Dashboard  {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/employeehealth' render={(props) => this.state.components.includes("EmployeeHealth") ? (<EmployeeHealth {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/cleansanitization' render={(props) => this.state.components.includes("Cleanliness&Sanitization") ? (<CleanlinessAndSanitization {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/traningawareness' render={(props) => this.state.components.includes("Training&Awareness") ? (<TraningAndAwareness  {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/coursedetails' render={(props) => this.state.components.includes("Dashboard") ? (<CourseDetails {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/reportmanagement' render={(props) => this.state.components.includes("ReportManagement") ? (<ReportManagement {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/healthmanagement' render={(props) => this.state.components.includes("Dashboard") ? (<HealthManagement {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/plantmanagement' render={(props) => this.state.components.includes("Dashboard") ? (<PlantManagement {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/newsandupdates' render={(props) => this.state.components.includes("News&Updates") ? (<NewsAndUpdates {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/datamanagement' render={(props) => this.state.components.includes("DataManagement") ? (<DataManagement {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/leaveAttendancecard' render={(props) => this.state.components.includes("LeaveManagement") ? (<LeaveAttendanceCard {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/onsitesurvey' render={(props) => this.state.components.includes("Survey") ? (<OnSiteSurvey {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/roleManagement' render={(props) => this.state.components.includes("RoleManagement") ? (<RoleManagementContainer {...props} />) : <NoTAuthorised />} />
                        <Route exact path='/home/rostermanagement' render={(props) => this.state.components.includes("RosterManagement") ? (<RosterManagement {...props} />) : <NoTAuthorised />} />
                        {/* <Route exact path='/home/rostermanagement' component={RosterManagement}/> */}
                        <Route exact path="/home/notAuthorised" component={NoTAuthorised}/>
                    </React.Fragment>

                        }
            </Switch>
        )
                }
            }
            
            export default HomeRouting

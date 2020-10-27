import React, { Component } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import dashboardIcon from '../../assets/images/menu/dashboard.svg';
import empHealth from '../../assets/images/menu/profile.svg';
import cleanSan from '../../assets/images/menu/sanitise.svg';
import trainAware from '../../assets/images/menu/course-1.svg';
import shift from '../../assets/images/menu/employee.svg'
import report from '../../assets/images/menu/seo-report.svg'
import leave from '../../assets/images/menu/sun-umbrella-o.svg'
import newsUpdates from '../../assets/images/menu/news.svg';
import dataManagement from '../../assets/images/menu/marketing.svg';
import role from '../../assets/images/role-management.svg';
import guard from '../../assets/images/guard.svg';

import survey from '../../assets/images/guard.svg';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Data: [],
			userGroup: '',
			addClass: false,
			components: [],
		};
	}
	componentDidMount() {
		var dbComponents = JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.objBcmAppPermissionWrapper;
		var UIComponents = [];
		for (let compo of dbComponents) {
			var menu=compo.navigationMenu;
            menu=menu.replace(/\s/g,'');;
			UIComponents.push(menu);
		}
		this.setState({
			userGroup: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup,
			components: UIComponents
		});
		// setTimeout(() => {
		// 	console.log(this.state.components)
		// 	console.log("dashboard..........", this.state.components.includes("Dashboard"))
		// }, 1000);

	}
	toggle() {
		this.setState({ addClass: !this.state.addClass });
	}
	refreshPage = () => {
		// window.location.href = window.origin+'/#/home/dashboard';		
		// return <Redirect to='/home/dashboard' />
		window.location.reload(false);
	}
	render() {
		let boxClass = ["box"];
		if (this.state.addClass) {
			boxClass.push('active');
		}
		return (
			<div id="sidebar" className={boxClass.join(' ')}>
				<div className={boxClass.join(' ')} onClick={this.toggle.bind(this)} id="toggle">
					<span></span>
				</div>
				<div className="menu">
					{
						// this.state.userGroup == 'Security' ?(
						// 	<ul className="list-unstyled">											
						// 		<li><NavLink to="/home/onsitesurvey" title="Survey"><span className="have-icon" onClick={this.refreshPage}><img src={survey}/></span></NavLink></li>																				  					
						// 	</ul>
						// ):(
						// 	<ul className="list-unstyled">																	
						// 		<li ><NavLink to="/home/dashboard" title="Dashboard"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={dashboardIcon}/></span></NavLink></li>
						// 		{/* <li><NavLink to="/home/onsitesurvey" title="Survey"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={empHealth}/></span></NavLink></li>
						// 		<li><NavLink to="/home/employeehealth" title="Employee Health"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={guard}/></span></NavLink></li> */}
						// 		<li><NavLink to="/home/onsitesurvey" title="Survey"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={survey}/></span></NavLink></li>
						// 		<li><NavLink to="/home/employeehealth" title="Employee Health"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={empHealth}/></span></NavLink></li>

						// 		<li><NavLink to="/home/cleansanitization" title="Cleanliness & Sanitization"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={cleanSan}/></span></NavLink></li>
						// 		<li><NavLink to="/home/datamanagement" title="Data Management"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={dataManagement}/></span></NavLink></li>					
						// 		{/* <li><NavLink to="/home/rostermanagement" title="Roster Management"><span className="have-icon cus-icon" onClick={this.toggle.bind(this)}><img src={shift}/></span></NavLink></li> */}
						// 		<li><NavLink to="/home/reportmanagement" title="Report Management"><span className="have-icon cus-icon" onClick={this.toggle.bind(this)}><img src={report}/></span></NavLink></li>
						// 		<li><NavLink to="/home/traningawareness" title="Traning & Awareness"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={trainAware}/></span></NavLink></li>
						// 		<li><NavLink to="/home/newsandupdates" title="News & updates"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={newsUpdates}/></span></NavLink></li>
						// 		<li><NavLink to="/home/roleManagement" title="Role Management"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={role}/></span></NavLink></li>
						// 		{/* <li><NavLink to="/home/leaveAttendancecard" title="Leave Attendance"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={leave}/></span></NavLink></li> */}

						// 		{
						// 			// <li><NavLink to="/home/roleManagement" title="Role Management"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={role}/></span></NavLink></li>					
						// 			// <li><NavLink to="/home/onsitesurvey"><span className="have-icon"><img src={onsite}/></span></NavLink></li>
						// 		}																				  					
						// 	</ul>
						// )
					// 	Dashboard
                    //   Survey
					// EmployeeHealth
					// CleanlynessAndSanitization
					// DataManagement
					// ReportManagement
					// TrainingAndAwareness
					// NewsAndUpdates
					// RoleManagement
					// LeaveManagement
					 //RosterManagement
											//this is only for merit
						<ul className="list-unstyled">
						{this.state.components.includes("Dashboard") ? <li ><NavLink to="/home/dashboard" title="Dashboard"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={dashboardIcon} /></span></NavLink></li> : null}
						{this.state.components.includes("Survey") ? <li><NavLink to="/home/onsitesurvey" title="Survey"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={survey} /></span></NavLink></li> : null}
						{this.state.components.includes("EmployeeHealth") ? <li><NavLink to="/home/employeehealth" title="Employee Health"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={empHealth} /></span></NavLink></li> : null}
						{this.state.components.includes("Cleanliness&Sanitization") ? <li><NavLink to="/home/cleansanitization" title="Cleanliness & Sanitization"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={cleanSan} /></span></NavLink></li> : null}
						{this.state.components.includes("DataManagement") ? <li><NavLink to="/home/datamanagement" title="Data Management"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={dataManagement} /></span></NavLink></li> : null}
						{this.state.components.includes("ReportManagement") ? <li><NavLink to="/home/reportmanagement" title="Report Management"><span className="have-icon cus-icon" onClick={this.toggle.bind(this)}><img src={report} /></span></NavLink></li> : null}
						{this.state.components.includes("RosterManagement") ? <li><NavLink to="/home/rostermanagement" title="Roster Management"><span className="have-icon cus-icon" onClick={this.toggle.bind(this)}><img src={shift}/></span></NavLink></li> : null}
						{/* <li><NavLink to="/home/rostermanagement" title="Roster Management"><span className="have-icon cus-icon" onClick={this.toggle.bind(this)}><img src={shift}/></span></NavLink></li> */}
						{this.state.components.includes("Training&Awareness") ? <li><NavLink to="/home/traningawareness" title="Training & Awareness"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={trainAware} /></span></NavLink></li> : null}
						{/* {this.state.components.includes("LeaveManagement") ? <li><NavLink to="/home/leaveAttendancecard" title="Leave Attendance"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={leave}/></span></NavLink></li> : null} */}
						{this.state.components.includes("News&Updates") ? <li><NavLink to="/home/newsandupdates" title="News & updates"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={newsUpdates} /></span></NavLink></li> : null}
						{this.state.components.includes("RoleManagement") ? <li><NavLink to="/home/roleManagement" title="Role Management"><span className="have-icon" onClick={this.toggle.bind(this)}><img src={role} /></span></NavLink></li> : null}
					</ul>
					}
				</div>
			</div>
		);
	}
}

export default Sidebar;
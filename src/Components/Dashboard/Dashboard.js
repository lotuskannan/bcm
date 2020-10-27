import React, { Component } from 'react';
import { Row, Col, Card, ProgressBar, Spinner, Form, Tab, Tabs,Alert } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import OwlCarousel from 'react-owl-carousel';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-multi-carousel/lib/styles.css";
import 'react-circular-progressbar/dist/styles.css';
import calendarIcon from '../../assets/images/calendar.svg';
import editIcon from '../../assets/images/edit.svg';
import empIcon from '../../assets/images/pencil.svg';
import teamIcon from '../../assets/images/team.svg';
// import originalDoughnutDraw from './ChartController';
import NewAndUpdateCard from './NewAndUpdateCard';
import CleaninessAndSanitization from './CleaninessAndSanitization';
import * as DashboardService from './DashboardService';
import { GenericApiService } from '../../Service/GenericApiService';
import Axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import sharingService from '../../Service/DataSharingService';

const legend = {
	display: false,
	position: "bottom"
};
const options = {
	maintainAspectRatio: false,
	scales: {
		yAxes: [
			{
				gridLines: {
					drawBorder: true,
					color: "rgba(61, 61, 61, 0.1)",
					zeroLineColor: "rgba(61, 61, 61, 0.1)"
				},
				ticks: {
					fontColor: "rgba(118, 166, 188, 0.57)",
					suggestedMin: 0,
					suggestedMax: 100,
					stepSize: 20,
					callback: function (value) {
						return value + "%"
					}
				}
			}
		],
		xAxes: [
			{
				gridLines: {
					display: false
				},
				ticks: {
					fontColor: "rgba(118, 166, 188, 0.57)",
					// suggestedMin: 0,
					// suggestedMax: 100							
				}
			}
		]
	},
};

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chartManipulationObject: {},
			confirmedValue: '',
			confirmedText: '',
			suspectedValue: '',
			suspectedText: '',
			stayatHomeValue: '',
			stayatHomeText: '',
			recoveredValue: '',
			recoveredText: '',
			onSiteValue: '',
			onSiteText: '',
			OnLeaveValue: '',
			OnLeaveText: '',
			workFromHomeCountValue: '',
			workFromHomeCountText: '',
			tobeScannedValue:'',
			tobeScannedText:'',
			userGroup: '',
			covidStatus: { Confirmed: 1, Suspected: 2, StayatHome: 3, Recovered: 4, OnSite: 5, workFromHomeCount: 7 },
			Loader: false,
			Loader_two: false,
			courseList: [],
			selected: 0,
			totalVal: 0,
			errorMessage: 'No Records Found',
			animtedProgressStartValue: 0,
			animtedProgressEndValue: 0,
			animtedProgresDuration: 0,
			lineData: [],
			Surveydetails: 0,
			healthtrackerScancount: [],
			leaveChartObject: {
				labels: ['0', '0', '0', '0', '0', '0', '0'],
				datasets: [
					{
						backgroundColor: 'rgb(108 224 220)',
						borderColor: 'rgb(108 224 220)',
						borderWidth: 1,
						hoverBackgroundColor: 'rgb(86 179 176)',
						hoverBorderColor: 'rgb(86 179 176)',
						data: [10, 80, 60, 79, 40, 55, 90]
					}
				]
			},
			plantId: 0,
			plantList: [],
			sessionExpired:false
		};
	}
	componentDidMount() {
		this.setState({ Loader: true });
		var plantId = sessionStorage.getItem("plantId") ? sessionStorage.getItem("plantId") : 0;
		this.setState({ plantId: plantId })
		this.subscription = sharingService.getMessage().subscribe(message => {
			if (message) {
				if (this.props.history.location.pathname == '/home/dashboard') {
					var plantId = +message.text
					this.setState({ plantId: plantId })
					this.setState({ userGroup: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup });
					var lname = JSON.parse(sessionStorage.LoginUserObject).lastName == '' ? '' : JSON.parse(sessionStorage.LoginUserObject).lastName;
					var name = JSON.parse(sessionStorage.LoginUserObject).firstName + ' ' + lname;
					this.setState({ fullName: name });
					this.getdashboardDetails(plantId);
					// this.initChart(plantId);
					// this.getSurveydetails(plantId);
					// this.dailyHealthRecordCount(plantId);
					this.setState({ courseanimtedProgressStartValueist: 0, animtedProgressEndValue: 60, animtedProgresDuration: 1.4 });
				}
			}
		});
		this.setState({ userGroup: JSON.parse(sessionStorage.LoginUserObject).bcmUserGroupWrapper.userGroup });
		var lname = JSON.parse(sessionStorage.LoginUserObject).lastName == '' ? '' : JSON.parse(sessionStorage.LoginUserObject).lastName;
		var name = JSON.parse(sessionStorage.LoginUserObject).firstName + ' ' + lname;
		this.setState({ fullName: name });
		this.getdashboardDetails(plantId);
		// this.initChart(plantId);
		// this.getSurveydetails(plantId);
		// this.dailyHealthRecordCount(plantId);
		// this.getCourseList();		
		this.setState({ courseanimtedProgressStartValueist: 0, animtedProgressEndValue: 60, animtedProgresDuration: 1.4 });
		document.getElementById('survey-tab-tab-workFromHome').setAttribute("title", "Work From Home");
	}

	getdashboardDetails = (plantId) => {
		this.setState({ Loader: true });
		DashboardService.getDashboardDetails(plantId)
			.then(response => {
				if (response.data) {
					var plantList = response.data.plantTaskStatusCount;
					this.plantStatusList(plantList)
					this.setState({
						Surveydetails: response.data.workFromHomeSurveyWidgetDto,
					});
					if (response.data.healthTrackerStatusCount) {
						var empHealth = response.data.healthTrackerStatusCount;
						this.employeeHealthGride(empHealth);
					}
					if (response.data.dailyHealthRecordCount) {
						var lineGraphData = response.data.dailyHealthRecordCount;
						this.dailyEmpHealthLineGraph(lineGraphData);
					}
				}
				this.setState({ Loader: false });
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

	plantStatusList(plantList) {
		if (plantList) {
			plantList.filter(plant => {
				if ((plant.overdueCount == 0 && plant.doneCount == 0 && plant.ipCount > 0)
					|| (plant.overdueCount == 0 && plant.doneCount > 0 && plant.ipCount > 0)) {
					plant.color = 3;
				} else if (plant.overdueCount == 0 && plant.ipCount == 0 && plant.doneCount > 0) {
					plant.color = 2;
				} else if (plant.overdueCount == 0 && plant.ipCount == 0 && plant.doneCount == 0) {
					plant.color = 0;
				} else {
					plant.color = 1;
				}

			});
		}
		this.setState({ plantList: plantList });
	}



	initChart = (plantId) => {
		this.setState({ Loader: true });
		DashboardService.getDashboardObject(plantId).then(Response => {
			var response = Response.data;
			this.employeeHealthGride(response);
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
	dailyHealthRecordCount = (plantId) => {
		this.setState({ Loader: true });
		DashboardService.dailyHealthRecordCount(plantId).then(Response => {
			this.dailyEmpHealthLineGraph(Response.data);
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
	renderRedirect = () => {
		this.props.history.push("/home/onsitesurvey");
	}
	goToEmployeeHealth = (statuscode) => {
		this.props.history.push('/home/employeehealth?statuscode=' + statuscode);
	}
	chartLableClick = (lableName) => {
		if (lableName == 'COVID Confirmed') {
			this.props.history.push('/home/employeehealth?statuscode=1');
		}
		if (lableName == 'Suspected') {
			this.props.history.push('/home/employeehealth?statuscode=2');
		}
		if (lableName == 'Stay at Home') {
			this.props.history.push('/home/employeehealth?statuscode=3');
		}
		if (lableName == 'Recovered') {
			this.props.history.push('/home/employeehealth?statuscode=4');
		}
		if (lableName == 'On Site') {
			this.props.history.push('/home/employeehealth?statuscode=5');
		}
		if (lableName == 'On Leave') {
			this.props.history.push('/home/employeehealth?statuscode=6');
		}
		if (lableName == 'Work from Home') {
			this.props.history.push('/home/employeehealth?statuscode=7');
		}
		if (lableName == 'All') {
			this.props.history.push('/home/employeehealth');
		}
	}
	allEmpHealth = () => {
		this.props.history.push('/home/employeehealth');
	}
	navigate = url => {
		this.props.history.push(url);
	}

	dailyEmpHealthLineGraph(response) {

		var label = [];
		var healthCount = [];
		if (response) {
			for (var i = 0; i < response.length; i++) {
				label.push(response[i].dayValue);
				healthCount.push(response[i].healthPercentageValue);
			}
		}
		const lineData = {
			labels: label,
			datasets: [
				{
					fill: false,
					backgroundColor: 'rgb(2 102 255)',
					borderColor: 'rgb(2 102 255)',
					borderWidth: 1,
					hoverBackgroundColor: 'rgb(86 179 176)',
					hoverBorderColor: 'rgb(86 179 176)',
					data: healthCount
				}
			]
		};
		this.setState({ lineData: lineData });
	}

	employeeHealthGride(response) {
		var suspectedCount = response.suspectedCount;
		var confirmedCount = response.confirmedCount;
		var stayAtHomeCount = response.stayAtHomeCount;
		var recoveredCount = response.recoveredCount;
		var onsiteCount = response.onsiteCount;
		var workFromHomeCount = response.workFromHomeCount;
		var tobeScannedCount = response.tobeScannedCount;
		var totalVal = suspectedCount + confirmedCount + stayAtHomeCount + recoveredCount + onsiteCount + workFromHomeCount+tobeScannedCount;
		this.setState({
			confirmedValue: confirmedCount == null ? 0 : 100 - parseInt((confirmedCount / totalVal) * 100), confirmedText: confirmedCount == null ? 0 : confirmedCount,
			suspectedValue: suspectedCount == null ? 0 : 100 - parseInt((suspectedCount / totalVal) * 100), suspectedText: suspectedCount == null ? 0 : suspectedCount,
			stayatHomeValue: stayAtHomeCount == null ? 0 : 100 - parseInt((stayAtHomeCount / totalVal) * 100), stayatHomeText: stayAtHomeCount == null ? 0 : stayAtHomeCount,
			recoveredValue: recoveredCount == null ? 0 : 100 - parseInt((recoveredCount / totalVal) * 100), recoveredText: recoveredCount == null ? 0 : recoveredCount,
			onSiteValue: onsiteCount == null ? 0 : 100 - parseInt((onsiteCount / totalVal) * 100), onSiteText: onsiteCount == null ? 0 : onsiteCount,
			workFromHomeCountValue: workFromHomeCount == null ? 0 : 100 - parseInt((workFromHomeCount / totalVal) * 100), workFromHomeCountText: workFromHomeCount == null ? 0 : workFromHomeCount,
			tobeScannedValue: tobeScannedCount == null ? 0 : 100 - parseInt((tobeScannedCount / totalVal) * 100), tobeScannedText: tobeScannedCount == null ? 0 : tobeScannedCount
		});
		var getDummyData = { "COVID Confirmed": confirmedCount, "Suspected": suspectedCount, "Quarantine": stayAtHomeCount, "Recovered": recoveredCount, "On Site": onsiteCount, "Work from Home": workFromHomeCount };
		var backgroundColor = ['#C90000', '#FF0000', '#FF8000', '#418600', '#77E500', '#960027','#F4F4F4','#d16f00'];
		var hoverBackgroundColor = [];
		var lablesName = [];
		var lablesData = [];

		// backgroundColor: backgroundColor,
		for (var i = 0; i < Object.keys(getDummyData).length; i++) {
			lablesName.push(Object.keys(getDummyData)[i]);
		}
		for (var i = 0; i < Object.values(getDummyData).length; i++) {
			lablesData.push(Object.values(getDummyData)[i]);
		}
		var ObjMapping = {
			labels: lablesName,
			datasets: [
				{
					data: lablesData,
					backgroundColor: backgroundColor,
					hoverBackgroundColor: hoverBackgroundColor,
					borderWidth: 0,
				}
			],
			text: 'Total ' + totalVal
		};

		this.setState({ totalVal: totalVal });
		var CloneObjMapping = [];
		for (var M = 0; M < lablesName.length; M++) {

			var f1 = 'url(#gradient1)';
			var f2 = 'url(#gradient2)';
			var f3 = 'url(#gradient3)';
			var f4 = 'url(#gradient4)';
			var f5 = 'url(#gradient5)';
			var f6 = 'url(#gradient6)';
			// var f7 = 'url(#gradient7)';
			// var f8 = 'url(#gradient8)';
			var re = '';

			if (M == 0) {
				re = f1;
			}
			if (M == 1) {
				re = f2;
			}
			if (M == 2) {
				re = f3;
			}
			if (M == 3) {
				re = f4;
			}
			if (M == 4) {
				re = f5;
			}
			if (M == 5) {
				re = f6;
			}
			// if (M == 6) {
			// 	re = f7;
			// }
			// if (M == 7) {
			// 	re = f8;
			// }
			if (lablesData[M] == '0') {
			} else {
				CloneObjMapping.push({
					title: lablesName[M],
					value: lablesData[M],
					color: re
				});
			}
		}
		this.setState({ chartManipulationObject: CloneObjMapping });
	}

	getCourseList() {
		const orgId = sessionStorage.orgId;
		const token = sessionStorage.token;
		this.setState({ Loader_two: true });
		DashboardService.elmsGetCourseList(orgId).then(response => {

			if (response.data.length != 0) {
				response.data.filter(elem => {
					elem.percentage = Math.ceil((elem.completedCount / elem.allocatedCount) * 100);
					elem.statusColor = elem.percentage >= 68 ? 'success' : (elem.percentage >= 34 && elem.percentage <= 67) ? 'warning' : 'danger';
					elem.classValue = elem.percentage >= 68 ? 'distance' : (elem.percentage >= 34 && elem.percentage <= 67) ? 'sanitize' : 'mask';
				});
			}
			this.setState({ courseList: response.data, Loader_two: false });
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
	goToCourseDetailsPage = (e) => {
		this.props.history.push('/home/coursedetails?id=' + e.categoryId)
	}
	onClickChartLable = (index) => {
		const { selected } = this.state;
		this.setState({
			selected: index === selected ? undefined : index
		});
	}
	setanimtedProgressValue = () => {
		this.setState({ courseanimtedProgressStartValueist: 0, animtedProgressEndValue: 0, animtedProgresDuration: 0 });
		setTimeout(() => {
			this.setState({ courseanimtedProgressStartValueist: 0, animtedProgressEndValue: 60, animtedProgresDuration: 1.4 });
		}, 500);
	}
	cardDate = () => {

		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var d = new Date();
		var dvalue = d.getDate();
		var convertdvalue = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
		return monthNames[d.getMonth()] + " " + convertdvalue + ", " + d.getFullYear();
	}
	cardWeek = () => {
		var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var current = new Date();
		var curMonth = new Date().toString().split(' ')[1];
		let PassDate = new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000));
		let PassMonth = monthNames[PassDate.getMonth()];
		return this.dateZeroAdd(PassDate.getDate()) + ' ' + PassMonth + '-' + this.dateZeroAdd(current.getDate()) + ' ' + curMonth;
	}
	dateZeroAdd = (date) => {
		return date.toString().length == 1 ? '0' + date.toString() : date.toString();
	}
	render() {
		const { Loader, Loader_two, courseList, errorMessage, Surveydetails, plantList } = this.state;
		const segmentsStyle = { transition: 'stroke .3s', cursor: 'pointer' };
		return (
			this.state.userGroup == 'Security' ? (
				<div>{this.renderRedirect()}</div>
			) : (
					<div className="dashboard-container dashboard-home">
						<div className="dashboard-section">

							<div className="welcome-text">
								<div className="user-name">Hello <i> {this.state.fullName},</i></div>
								<div>
									<span className="team-name">Have a nice day at work</span>
								</div>
							</div>
							<Alert show={this.state.sessionExpired} variant="danger">
								<div className="alert-container">
									<p><i className="icons"></i> Session Expired,Please login again.</p>
								</div>
								
							</Alert>
							<Row className="row-1">
								<Col xl="8">
									<Card className="emp-health">
										<Card.Title>
											<div className="cursor-pointer" onClick={e => this.navigate('/home/employeehealth')}>Employee Health</div>

										</Card.Title>
										<Card.Body className="pl-0">
											{Loader ? <div className="loader">
												<Spinner animation="grow" variant="dark" />
											</div> : null}
											<div className="PieChart">
												<PieChart
													data={this.state.chartManipulationObject}
													segmentsStyle={(index) => {
														return index === this.state.selected
															? { transition: 'stroke .3s', cursor: 'pointer', strokeWidth: 25 }
															: { transition: 'stroke .3s', cursor: 'pointer' };
													}}
													segmentsTabIndex={1}
													segmentsShift={(index) => (index === this.state.selected ? 1.5 : 0)}
													animation
													animationDuration={500}
													animationEasing="ease-out"
													lengthAngle={360}
													radius={43}
													lineWidth={55}
													labelPosition={70}
													onClick={(_, index) => { this.onClickChartLable(index) }}
												>
													{/* Covid Confirmed */}
													<linearGradient id="gradient1" x1="0%" y1="0%" x2="2%" y2="80%">
														<stop offset="0%" style={{ stopColor: 'rgb(128,0,38)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(187,31,41)', stopOpacity: 1 }} />
													</linearGradient>
													{/* Suspected */}
													<linearGradient id="gradient2" x1="0%" y1="0%" x2="2%" y2="80%">
														<stop offset="0%" style={{ stopColor: 'rgb(255,0,50)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(198,5,43)', stopOpacity: 1 }} />
													</linearGradient>
													{/* Stay at home - Quarantine */}
													<linearGradient id="gradient3" x1="0%" y1="0%" x2="2%" y2="80%">
														<stop offset="0%" style={{ stopColor: 'rgb(255,131,0)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(209,111,0)', stopOpacity: 1 }} />
													</linearGradient>
													{/*Recovered  */}
													<linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
														<stop offset="0%" style={{ stopColor: 'rgb(69,131,14)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(55,109,0)', stopOpacity: 1 }} />
													</linearGradient>
													{/* On Site */}
													<linearGradient id="gradient5" x1="0%" y1="0%" x2="2%" y2="80%">
														<stop offset="0%" style={{ stopColor: 'rgb(114,230,0)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(85,172,0)', stopOpacity: 1 }} />
													</linearGradient>
													{/* On Leave */}
													<linearGradient id="gradient6" x1="0%" y1="100%" x2="00%" y2="0%">
														<stop offset="0%" style={{ stopColor: 'rgb(55,55,100,)', stopOpacity: 1 }} />
														<stop offset="100%" style={{ stopColor: 'rgb(190, 131, 255, 0.95)', stopOpacity: 1 }} />
													</linearGradient>
													{/* scanned */}
													{
														// <linearGradient id="gradient7" x1="0%" y1="100%" x2="00%" y2="0%">
														// <stop offset="0%" style={{ stopColor: 'rgb(62.7, 39.2, 10)', stopOpacity: 1 }} />
														// <stop offset="100%" style={{ stopColor: 'rgb(120, 39.2, 0)', stopOpacity: 1 }} />
														// </linearGradient>
														// <linearGradient id="gradient8" x1="0%" y1="100%" x2="00%" y2="0%">
														// 	<stop offset="0%" style={{ stopColor: 'rgb(209,111,0, 0.8)', stopOpacity: 1 }} />
														// 	<stop offset="100%" style={{ stopColor: 'rgb(209,111,0, 0.8)', stopOpacity: 1 }} />
														// </linearGradient>
													}
												</PieChart>
												<span className="pie-total" style={{ cursor: 'pointer' }} onClick={this.allEmpHealth}>Total <h5>{this.state.totalVal}</h5></span>

											</div>

											<div className="progress-circle">
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.Confirmed)}>
													<CircularProgressbar
														value={this.state.confirmedValue}
														text={`${this.state.confirmedText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#C90000"
														})}
													/>
													<span className="progress-label dark-red">COVID Confirmed</span>
												</div>
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.Suspected)}>
													<CircularProgressbar
														value={this.state.suspectedValue}
														text={`${this.state.suspectedText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#FF0000"
														})}
													/>
													<span className="progress-label red">Suspected</span>
												</div>
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.StayatHome)}>
													<CircularProgressbar
														value={this.state.stayatHomeValue}
														text={`${this.state.stayatHomeText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#FF8000"
														})}
													/>
													<span className="progress-label orange">Quarantine</span>
												</div>
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.Recovered)}>
													<CircularProgressbar
														value={this.state.recoveredValue}
														text={`${this.state.recoveredText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#418600"
														})}
													/>
													<span className="progress-label dark-green">Recovered</span>
												</div>
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.workFromHomeCount)} title="Work From Home">
													<CircularProgressbar
														value={this.state.workFromHomeCountValue}
														text={`${this.state.workFromHomeCountText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#BE83FF"
														})}
													/>
													<span className="progress-label pink" title="Work From Home">WFH</span>
												</div>
												<div onClick={() => this.goToEmployeeHealth(this.state.covidStatus.OnSite)} title="Work From Office">
													<CircularProgressbar
														value={this.state.onSiteValue}
														text={`${this.state.onSiteText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#77E500"
														})}/>
													<span className="progress-label green" title="Work From Office">WFO</span>
												</div>
												<div>
													<CircularProgressbar
														value={0}
														text={`${0}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#848484"
														})}
													/>
													<span className="progress-label ash">On Leave</span>
												</div>
												<div>
													<CircularProgressbar
														value={this.state.tobeScannedValue}
														text={`${this.state.tobeScannedText}`}
														strokeWidth={4}
														styles={buildStyles({
															textColor: "#747474",
															pathColor: "#CACACA",
															trailColor: "#d16f00 "
														})}/>
													<span className="progress-label to-be-scanned-color">To be Scanned</span>
												</div>

											</div>
										</Card.Body>
									</Card>
								</Col>
								<Col xl="4">
									<Card className="clean-sanitization">
										<Card.Title>
											<div>Survey</div>
											<div className="card-date">
												<h6>{this.cardDate()} <img src={calendarIcon} ></img></h6>
											</div>
										</Card.Title>
										<div className="card-body-1 survey-container">
											<div className="survey-types">
												{Loader ? <div className="loader">
													<Spinner animation="grow" variant="dark" />
												</div> : null}
												<Tabs defaultActiveKey="workFromHome" id="survey-tab" onClick={this.setanimtedProgressValue}>
												<Tab eventKey="workFromHome" title="WFH">
														<div className="survey-progressbar">
															<div className="progressbar-item">
																<AnimatedProgressProvider valueStart={this.state.animtedProgressStartValue}
																	valueEnd={this.state.animtedProgressEndValue}
																	duration={this.state.animtedProgresDuration}
																	easingFunction={easeQuadInOut}>
																	{value => {
																		var roundedValue = Surveydetails.wfhSurveyPercentage ? Surveydetails.wfhSurveyPercentage : 0;
																		return (
																			<CircularProgressbar
																				value={roundedValue}
																				text={`${roundedValue}%`}
																				styles={buildStyles({ pathTransition: "none" })}
																			/>
																		);
																	}}
																</AnimatedProgressProvider>
															</div>
															<div className="surveys-taken">
																<div className="surveys-item">
																	<div className="taken">Surveys Taken</div>
																	<div className="taken">
																		{
																			Surveydetails.wfhSurveyCompletedCount}
																	</div>
																</div>
																<div className="surveys-item">
																	<div className="taken">Not Taken</div>
																	<div className="taken">{
																		Surveydetails.wfhSurveyNotCompletedCount}</div>
																</div>
																<div className="surveys-item">
																	<div className="taken">Total Employees</div>
																	<div className="taken">
																		{Surveydetails.wfhEmployeeCount}</div>
																</div>
															</div>
														</div>

													</Tab>
													<Tab eventKey="onsiteWork" title="Quarantine">
														<div className="survey-progressbar">
															<div className="progressbar-item">
																<AnimatedProgressProvider valueStart={this.state.animtedProgressStartValue}
																	valueEnd={this.state.animtedProgressEndValue}
																	duration={this.state.animtedProgresDuration}
																	easingFunction={easeQuadInOut}>
																	{() => {
																		var roundedValue = Surveydetails.symptomaticSurveyPercentage ? Surveydetails.symptomaticSurveyPercentage : 0;
																		return (
																			<CircularProgressbar
																				value={roundedValue}
																				text={`${roundedValue}%`}
																				styles={buildStyles({ pathTransition: "none" })}
																			/>
																		);
																	}}
																</AnimatedProgressProvider>
															</div>
															<div className="surveys-taken">
																<div className="surveys-item">
																	<div className="taken">Surveys Taken</div>
																	<div className="taken">
																		{
																			Surveydetails.symptamaticSurveyCompletedCount}
																	</div>
																</div>
																<div className="surveys-item">
																	<div className="taken">Not Taken</div>
																	<div className="taken">
																		{
																			Surveydetails.symptamaticSurveyNotCompletedCount}
																	</div>
																</div>
																<div className="surveys-item">
																	<div className="taken">Total</div>
																	<div className="taken">{
																		Surveydetails.symptamaticEmployeeCount}</div>
																</div>
															</div>
														</div>

													</Tab>

												</Tabs>

											</div>

										</div>
									</Card>

								</Col>
							</Row>
							<Row className="row-2">

								<Col md="12" xl="6">
								<Card className="clean-sanitization">
										<Card.Title>
											<div className="cursor-pointer" onClick={e => this.navigate('/home/cleansanitization')}>Cleanliness & Sanitization</div>
											<div className="action-icons">
												<span>
													<img src={calendarIcon} />
												</span>
												<span>
													<img src={editIcon} />
												</span>
											</div>
										</Card.Title>
										<div className="card-body-1">
											{Loader ? <div className="loader">
												<Spinner animation="grow" variant="dark" />
											</div> : <CleaninessAndSanitization Loader={Loader} plantList={plantList} />}
										</div>
									</Card>
								</Col>

								<Col md="12" xl="6">
									<Card className="clean-sanitization">
										<Card.Title>
											<div>Employee Overall Health</div>
										</Card.Title>
										<div className="card-body-1 leave-attendance-container">
											{Loader ? <div className="loader">
												<Spinner animation="grow" variant="dark" />
											</div> : null}
											<div className="emp-health-chart">
												<div className="lineChartTitle">
													<h6>
														{
															// new Date().toDateString().split(' ')[0]+' '+new Date().toDateString().split(' ')[2]+' '+new Date().toDateString().split(' ')[1]+' '+new Date().toDateString().split(' ')[3]												
														}
														Health Status
											</h6>
												</div>
												<div className="lineChart">
													<Line ref="chart" data={this.state.lineData}
														legend={legend}
														options={options} />
												</div>
											</div>

										</div>
									</Card>

								</Col>

							</Row>

						</div>
					</div>
				)
		)
	}
}


export default withRouter(Dashboard);
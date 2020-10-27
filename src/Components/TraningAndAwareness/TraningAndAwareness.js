import React, { Component } from 'react';
import { Row, Col, Card, Form, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import BaseUrl from '../../Service/BaseUrl';
import Axios from 'axios';

class TraningAndAwareness extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalShow: false,
			analyticsStatus: [],
			courseList: [],
			Loader: false,
			imagePrefixUrl: 'https://storage.googleapis.com/elms-prod-meritgroup/Organisation',
			departmentList: [],
			assignedUserList: [],
			userList: [],
			categoryId: '',
			departmentName: '',
			isError: {
				categoryId: '',
				departmentName: '',
			},
			message: '',
			showMessage: false,
			modalLoader: false,
			courseSelectBox: 'selectPlaceholder',
			departmentSelectBox: 'selectPlaceholder',


		};
	}


	onChange = (value) => {

		this.setState({ assignedUserList: value });
	};

	componentDidMount() {
		this.getCourseChartData();
		this.getDepartmentList();
	}
	setModalShow = (e) => {
		this.setState({
			modalShow: e
		})
	}

	onHide = () => {
		this.setState({
			modalShow: false
		})
	}

	getCourseChartData() {
		const orgId = sessionStorage.orgId;
		const token = sessionStorage.token;
		this.setState({ Loader: true });
		const url = BaseUrl.demoElmsHornbillfxUrl+"hbfx-cnt-elms/category/bcmAllCoursesAdminGraphAnalytics?organisationId="+orgId;
		Axios(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'token': token
			}
		})
			.then(response => {
				if (response.data.categoryAnalytics) {
					response.data.categoryAnalytics.analyticsStatus.filter(elem => {

						if (elem.statusCode == 'YS') {
							elem.color = '#FB0033';
						} else if (elem.statusCode == 'CO') {
							elem.color = '#00D225'

						} else if (elem.statusCode == 'IP') {
							elem.color = '#F47700';

						}
						if (elem.idList.length != 0) {

							elem.courseCount = (elem.idList.length).toString().length == 1 ? `0${elem.idList.length}` : elem.idList.length;
						} else {
							elem.courseCount = `0${elem.idList.length}`
						}
					})
				}
				this.setState({
					courseList: response.data.categoryAnalytics?response.data.categoryAnalytics.category:[],
					analyticsStatus:response.data.categoryAnalytics? response.data.categoryAnalytics.analyticsStatus:[],
					Loader: false
				});

			}).catch(error => {
				this.setState({ Loader: false });

			})

	}

	goToCourseDetailsPage = (e) => {
		this.props.history.push('/home/coursedetails?id=' + e.categoryId)
	}


	onchangeHandle = () => {

		const { categoryId, departmentName } = this.state;

		if (categoryId && departmentName) {
			const orgId = sessionStorage.orgId;
			const token = sessionStorage.token;
			const payload = { organisationId: orgId, categoryId: categoryId, department: departmentName };
			const url =  BaseUrl.demoElmsHornbillfxUrl+"hbfx-cnt-elms/bcmCategoryUserList";

			Axios(url, {
				method: 'POST',
				data: payload,
				headers: {
					'content-type': 'application/json',
					'token': token
				}
			})
				.then(response => {
					if (response.data) {
						var unAssignedList = [];
						var assignedList = [];

						if (response.data[0].length != 0) {
							unAssignedList = response.data[0].map(e => {
								let arr = { value: `${e.userId}`, label: e.firstName };
								return arr;
							});
						}
						if (response.data[1].length != 0) {
							assignedList = response.data[1].map(e => `${e.userId}`);

							var tempArr = response.data[1].map(e => {
								let arr = { value: `${e.userId}`, label: e.firstName };
								return arr;
							});
							unAssignedList = unAssignedList.concat(tempArr);
						}

						this.setState({
							assignedUserList: assignedList,
							userList: unAssignedList,
						});

					}

				}).catch(error => {

				})
		}
	}

	getDepartmentList = () => {
		const orgId = sessionStorage.orgId;
		const token = sessionStorage.token;
		const url = BaseUrl.demoElmsHornbillfxUrl+"hbfx-cnt-elms/bcmDepartment/List/"+orgId;		
		Axios(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'token': token
			}
		})
			.then(response => {
				if (response.data) {
					this.setState({
						departmentList: response.data
					});
				}

			}).catch(error => {

			})
	}

	submitAssignCourse = e => {

		const { categoryId, assignedUserList, departmentName, isError } = this.state;

		if (this.validForm()) {

			var arr = [];

			for (let id of assignedUserList) {

				var obj = {
					createdBy: 1,
					updatedBy: 1,
					userId: id,
					organisationId: 945,
					categoryId: categoryId,
					isActive: true,
					createdOn: new Date().toISOString(),
					lastAccessed: new Date().toISOString(),
					department: departmentName
				}

				arr.push(obj)
			}

			this.setState({ modalLoader: true, });
			const orgId = sessionStorage.orgId;
			const token = sessionStorage.token;
			const orgName = sessionStorage.orgName;			
			const payload = arr;
			const url = BaseUrl.demoElmsHornbillfxUrl+`hbfx-cnt-elms/bcmCategoryUser/${categoryId}?orgName=${orgName}&department=${departmentName}&orgId=${orgId}`;
			Axios(url, {
				method: 'POST',
				data: payload,
				headers: {
					'content-type': 'application/json',
					'token': token
				}
			})
				.then(response => {
					if (response.data.status.success == 'Success') {
						this.setState({ modalLoader: false });
						const message = `Course Allocation was Successfull`;
						this.showNotification(message);
						this.resetForm();
						// this.getCourseChartData();

					}
				}).catch(error => {

				})
		} else {

			// console.log(isError);
			isError.categoryId = this.categoryValidator(categoryId);
			isError.departmentName = this.departmentValidator(departmentName);
			this.setState({ isError: isError });
		}

	}

	resetForm() {

		this.setModalShow(false);
		this.setState({
			assignedUserList: [],
			userList: [],
			categoryId: '',
			departmentName: '',
			isError: {
				categoryId: '',
				departmentName: '',
			},
			courseSelectBox: 'selectPlaceholder',
			departmentSelectBox: 'selectPlaceholder',

		})
	}
	// form valisation
	categoryValidator = (Param) => {
		var returnMsg = '';
		if (Param.length != 0) {
			returnMsg = '';
		} else {
			returnMsg = 'Course name is required';
		}
		return returnMsg;
	}
	departmentValidator = (Param) => {
		var returnMsg = '';
		if (Param.length != 0) {
			returnMsg = '';
		} else {
			returnMsg = 'Department name is required';
		}
		return returnMsg;
	}
	formValChange = e => {
		e.preventDefault();
		const { name, value } = e.target;
		let isError = { ...this.state.isError };
		switch (name) {
			case "categoryId":
				isError.categoryId = this.categoryValidator(value)
				break;
			case "departmentName":
				isError.departmentName = this.departmentValidator(value)
				break;
			default:
				break;
		}

		this.setState({
			isError,
			[name]: value
		});

		if (name == 'departmentName') {
			const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
			this.setState({ departmentSelectBox: color });
			setTimeout(() => {
				this.onchangeHandle();
			}, 1000);

		} else if (name == 'categoryId') {
			const color = value == '' ? 'selectPlaceholder' : 'activeSelect';
			this.setState({ courseSelectBox: color });
			setTimeout(() => {
				this.onchangeHandle();
			}, 1000);
		}


	};

	validForm() {
		if (this.categoryValidator(this.state.categoryId) == ''
			&& this.departmentValidator(this.state.departmentName) == '') {
			return true;
		} else {
			return false;
		}
	}

	showNotification(message) {
		this.setState({
			message: message,
			showMessage: true
		});
		setTimeout(() => {
			this.setState({
				message: '',
				showMessage: false
			});
		}, 3000);
	}

	render() {
		const { assignedUserList, analyticsStatus, courseList, userList,
			Loader, imagePrefixUrl, departmentList, isError, modalLoader,
			categoryId, departmentName, message, showMessage, departmentSelectBox, courseSelectBox } = this.state;
		return (
			<div className="dashboard-container training-awareness">

				<div className="dashboard-section">
					{Loader ? <div className="loader">
						<Spinner animation="grow" variant="dark" />
					</div> : null}
					<div className="welcome-text">
						<div className="pageTitle training-header">
							<h2>Training & Awareness</h2>
							<div className="training-option" onClick={() => this.setModalShow(true)}>

							</div>
						</div>
					</div>
					{showMessage ? <Alert variant="dark" className="mark">
						<div className="alert-container">
							<p><i className="icons"></i> {message}</p>
						</div>
					</Alert> : null}

					<Row className="h-100">
						{/* Course Summary */}
						<Col md="12" xl="3 course-summary">
							<Card>
								<Card.Body>
									<div className="total-courses">
										<h3>Total Courses <span>{courseList.length}</span></h3>
									</div>
									<div className="progress-circle">
										{analyticsStatus.map((elem, index) =>
											<div key={index}>
												<CircularProgressbar
													value={elem.courseCount}
													text={elem.courseCount}
													strokeWidth={4}
													styles={buildStyles({
														textColor: "#9A9A9A",
														pathColor: "#CBCBCB",
														trailColor: elem.color
													})}
												/>
												<span className="progress-label">{elem.status}</span>
											</div>)}
									</div>
								</Card.Body>
							</Card>
						</Col>
						{/* Course List */}

						<Col md="12" xl="9 course-list">
							<Row className="m-0">
								{courseList.map((course, index) =>
									<Col sm="6" md="4" xl="4" key={index}>
										<Card onClick={(e) => this.goToCourseDetailsPage(course)} className="card-traning">
											<Card.Body>
												<div className="card-images" style={{ backgroundImage: `url(${imagePrefixUrl + course.bannerPath})` }} >
												</div>
												<div className="courseDetails">
													<Card.Title>{course.name}</Card.Title>
													<Card.Text>
														{course.description}
													</Card.Text>
												</div>

											</Card.Body>
										</Card>
									</Col>)}



							</Row>
						</Col>
					</Row>


					{/*  AddPlant*/}
					<Modal id="dualListBox"
						show={this.state.modalShow}
						onHide={() => { this.setModalShow(false) }}
						size="md"
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter">
								Assign Course
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{modalLoader ? <div className="loader">
								<Spinner animation="grow" variant="dark" />
							</div> : null}
							<div className="modal-box">

								<Form.Group controlId="exampleForm.ControlSelect1" className="row mb-4 align-items-center mr-0">
									<Form.Label className="col-3 mb-0 pb-0 courseName">Course</Form.Label>
									<Form.Control as="select" name={"categoryId"} value={categoryId} onChange={this.formValChange.bind(this)}
										className={`col-9 pb-2 modal-box-select pl-0 ${courseSelectBox}`}>
										<option value={''}>Select Course </option>
										{courseList.map((course, index) =>
											<option key={index} value={course.categoryId}>
												{course.name}
											</option>)}

									</Form.Control>
									{isError.categoryId.length > 0 && (
										<Form.Text className="error-msg col-9 offset-3 pl-0"> {isError.categoryId} </Form.Text>
									)}
								</Form.Group>
								<div className="ListBox">
									<Form.Group controlId="exampleForm.ControlSelect1">
										<Form.Control as="select" className={departmentSelectBox} name={'departmentName'} value={departmentName}
											onChange={this.formValChange.bind(this)}>
											<option value={''}>Select Department</option>
											{departmentList.map((elem, index) =>
												<option key={index} value={elem}>{elem}</option>)}
										</Form.Control>
										{isError.departmentName.length > 0 && (
											<Form.Text className="error-msg"> {isError.departmentName} </Form.Text>
										)}
									</Form.Group>
									<DualListBox
										options={userList}
										selected={assignedUserList}
										onChange={this.onChange}
									/>
									<div className="btn-container text-center">
										<Button variant="secondary" className="cancel-btn" onClick={() => this.setModalShow(false)}>Cancel</Button>
										<Button variant={"success"} className={this.validForm() ? "assign-btn" : "cancel-btn"} onClick={this.submitAssignCourse}>Assign</Button>
									</div>
								</div>
							</div>

						</Modal.Body>
					</Modal>

				</div>
			</div>
		);
	}
}

export default TraningAndAwareness;